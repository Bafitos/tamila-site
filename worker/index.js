// Sends denver-real-estates.com (no www) to www with a permanent redirect,
// then serves the static site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'denver-real-estates.com') {
      url.hostname = 'www.denver-real-estates.com';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
