"""Weekly Google Search Console snapshot for denver-real-estates.com.

Runs in GitHub Actions (see .github/workflows/gsc-weekly.yml).
Needs the secret GSC_SERVICE_ACCOUNT_JSON (service account with Restricted
access to the Search Console property).

Writes to seo-data/ (not published on the website):
  daily.csv          clicks/impressions/ctr/position per day (full history, rewritten)
  queries-history.csv  one row per query per week  (appended, deduped by week_end)
  pages-history.csv    one row per page per week   (appended, deduped by week_end)
  report.md          this week vs last week, readable summary
"""
import csv
import datetime as dt
import json
import os
import sys
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build

SITE = os.environ.get("GSC_SITE", "sc-domain:denver-real-estates.com")
OUT = Path(__file__).resolve().parent.parent / "seo-data"
LAG_DAYS = 3  # GSC data is final ~2-3 days later

# Searches we especially care about (substring match, case-insensitive)
WATCH = [
    "tamila", "1%", "1 percent", "one percent",
    "listing agent", "real estate agent", "va loan", "pcs",
    "aurora", "centennial", "parker", "highlands ranch", "thornton",
    "brighton", "colorado springs", "denver", "mortgage", "divorce",
    "short sale", "foreclosure",
]


# Google mixes up Tamila's last name with Aspen, CO (ski town). Queries that
# mention "aspen" but not "tamila" are about the town, not her: they are kept
# in the raw CSVs but left out of the report's lists and clean averages.
def is_aspen_noise(q):
    q = q.lower()
    return "aspen" in q and "tamila" not in q


def service():
    info = json.loads(os.environ["GSC_SERVICE_ACCOUNT_JSON"])
    creds = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def query(svc, start, end, dims, limit=25000):
    rows, start_row = [], 0
    while True:
        body = {"startDate": str(start), "endDate": str(end), "dimensions": dims,
                "rowLimit": limit, "startRow": start_row, "type": "web"}
        resp = svc.searchanalytics().query(siteUrl=SITE, body=body).execute()
        batch = resp.get("rows", [])
        rows += batch
        if len(batch) < limit:
            return rows
        start_row += limit


def flat(rows, dims):
    out = []
    for r in rows:
        d = dict(zip(dims, r["keys"]))
        d.update(clicks=int(r["clicks"]), impressions=int(r["impressions"]),
                 ctr=round(r["ctr"] * 100, 2), position=round(r["position"], 1))
        out.append(d)
    return out


def write_csv(path, rows, fields):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


def read_csv(path):
    if not path.exists():
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def append_history(path, week_end, rows, key):
    fields = ["week_end", key, "clicks", "impressions", "ctr", "position"]
    old = [r for r in read_csv(path) if r["week_end"] != str(week_end)]
    new = [{"week_end": str(week_end), **{k: r[k] for k in fields[1:]}} for r in rows]
    write_csv(path, old + new, fields)
    return old + new


def totals(rows):
    c = sum(int(r["clicks"]) for r in rows)
    i = sum(int(r["impressions"]) for r in rows)
    pos = (sum(float(r["position"]) * int(r["impressions"]) for r in rows) / i) if i else 0
    return c, i, round(pos, 1)


def main():
    OUT.mkdir(exist_ok=True)
    svc = service()

    try:
        sites = [s["siteUrl"] for s in svc.sites().list().execute().get("siteEntry", [])]
    except Exception as e:  # noqa: BLE001
        sys.exit(f"Cannot list Search Console sites: {e}\n"
                 "Check that the Search Console API is enabled in Google Cloud.")
    if SITE not in sites:
        sys.exit(f"Service account has no access to {SITE}. Sites it can see: {sites}\n"
                 "Add the service account email in Search Console > Settings > "
                 "Users and permissions (Restricted).")

    end = dt.date.today() - dt.timedelta(days=LAG_DAYS)
    start = end - dt.timedelta(days=6)
    prev_end = start - dt.timedelta(days=1)

    # Daily totals, last 16 months (GSC maximum)
    daily = flat(query(svc, end - dt.timedelta(days=486), end, ["date"]), ["date"])
    write_csv(OUT / "daily.csv", daily, ["date", "clicks", "impressions", "ctr", "position"])

    q_rows = flat(query(svc, start, end, ["query"]), ["query"])
    p_rows = flat(query(svc, start, end, ["page"]), ["page"])
    q_hist = append_history(OUT / "queries-history.csv", end, q_rows, "query")
    p_hist = append_history(OUT / "pages-history.csv", end, p_rows, "page")

    # Week-over-week (totals from the daily series include anonymized queries)
    def week_totals(a, b):
        rows = [r for r in daily if str(a) <= r["date"] <= str(b)]
        return totals(rows)

    cur_c, cur_i, cur_p = week_totals(start, end)
    prv_c, prv_i, prv_p = week_totals(prev_end - dt.timedelta(days=6), prev_end)

    prev_all = [r for r in q_hist if r["week_end"] == str(prev_end)]
    noise = [r for r in q_rows if is_aspen_noise(r["query"])]
    clean = [r for r in q_rows if not is_aspen_noise(r["query"])]
    prev_clean = [r for r in prev_all if not is_aspen_noise(r["query"])]
    _, cln_i, cln_p = totals(clean)
    _, pcl_i, pcl_p = totals(prev_clean)

    prev_q = {r["query"]: r for r in prev_clean}
    cur_q = {r["query"]: r for r in clean}

    lines = [f"# Search Console — week {start} to {end}", "",
             "| | This week | Last week |", "|---|---|---|",
             f"| Clicks | {cur_c} | {prv_c} |",
             f"| Impressions | {cur_i} | {prv_i} |",
             f"| Avg position | {cur_p or '–'} | {prv_p or '–'} |",
             f"| Queries | {len(q_rows)} | {len(prev_all)} |",
             f"| Avg position, without Aspen-town queries | {cln_p or '–'} | {pcl_p or '–'} |",
             f"| Impressions, without Aspen-town queries | {cln_i} | {pcl_i} |",
             "", "_Avg position and impressions in the top rows include everything Google "
             "showed, also searches about Aspen, CO (the ski town). The \"without Aspen-town\" "
             "rows count only real queries, and all lists below exclude the Aspen-town ones._",
             ""]

    def qline(q, r, old=None):
        s = f"- **{q}** — pos {r['position']}, {r['impressions']} impr, {r['clicks']} clicks"
        if old:
            s += f" (was pos {old['position']})"
        return s

    moved = []
    for q, r in cur_q.items():
        if q in prev_q:
            d = float(prev_q[q]["position"]) - float(r["position"])
            moved.append((d, q, r, prev_q[q]))
    up = sorted([m for m in moved if m[0] >= 1], reverse=True)[:10]
    down = sorted([m for m in moved if m[0] <= -1])[:10]
    new = sorted([q for q in cur_q if q not in prev_q],
                 key=lambda q: -cur_q[q]["impressions"])[:15]
    lost = sorted([q for q in prev_q if q not in cur_q],
                  key=lambda q: -int(prev_q[q]["impressions"]))[:10]
    watched = sorted([q for q in cur_q if any(w in q.lower() for w in WATCH)],
                     key=lambda q: -cur_q[q]["impressions"])[:25]

    for title, items in [("Moved up", [qline(q, r, o) for _, q, r, o in up]),
                         ("Moved down", [qline(q, r, o) for _, q, r, o in down]),
                         ("New queries", [qline(q, cur_q[q]) for q in new]),
                         ("Dropped out", [f"- {q} (was pos {prev_q[q]['position']})" for q in lost]),
                         ("Key searches", [qline(q, cur_q[q], prev_q.get(q)) for q in watched])]:
        lines += [f"## {title}", *(items or ["- none"]), ""]

    pages = [
        f"- {r['page'].replace('https://www.denver-real-estates.com', '') or '/'} — "
        f"{r['clicks']} clicks, {r['impressions']} impr, pos {r['position']}"
        for r in sorted(p_rows, key=lambda r: -r["impressions"])[:15]]
    lines += ["## Top pages", *(pages or ["- none"]), ""]

    n_impr = sum(int(r["impressions"]) for r in noise)
    lines += ["## Noise: Aspen, CO (ski town) — ignored",
              f"{len(noise)} queries, {n_impr} impressions. Not Tamila's market; "
              "kept in queries-history.csv for reference only.", ""]
    lines += [f"- {r['query']} — pos {r['position']}, {r['impressions']} impr"
              for r in sorted(noise, key=lambda r: -int(r["impressions"]))[:10]] or ["- none"]
    lines.append("")

    (OUT / "report.md").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
