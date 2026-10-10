// Blog posts. Newest first. Each post is written from verified sources listed in `sources`.
// `compare` is the shareable comparison card (also used in the embed code).
// Text blocks: { h: 'Heading' } or { p: 'Paragraph' } or { list: ['...', '...'] }.

export const posts = [
  {
    slug: 'aurora-vs-centennial',
    title: 'Aurora vs Centennial: Where Should You Buy a Home?',
    description: 'Aurora or Centennial? Counties, school districts, taxes, transit and housing compared side by side by a local agent who works in both.',
    date: '2026-10-10',
    cities: ['aurora', 'centennial'],
    lead: 'They share a border and a lot of buyers ask about both. But Aurora and Centennial are very different places to own a home. Here is an honest side-by-side comparison from an agent whose office is in Centennial and whose clients buy all over Aurora.',
    compare: {
      a: 'Aurora',
      b: 'Centennial',
      rows: [
        ['Population (2020 census)', '386,261, third-largest city in Colorado', '108,418'],
        ['Counties', 'Arapahoe, Adams and Douglas', 'Arapahoe only'],
        ['Main school districts', 'Cherry Creek, Aurora Public Schools, plus parts of 27J, Douglas County and Bennett', 'Cherry Creek; Littleton Public Schools in the west'],
        ['Rail', 'RTD R Line light rail, connects to the A Line to Denver and DIA', 'No station inside most neighborhoods; light rail along I-25 near the Tech Center'],
        ['Housing', 'Everything from 1950s ranches to brand-new subdivisions', 'Mostly established neighborhoods'],
        ['Watch for', 'Metro district taxes in many newer areas; which county the address is in', 'Age of the home: sewer line, roof, furnace'],
        ['Good fit for', 'Buyers who want more home for the money, new construction, military at Buckley', 'Buyers who want an established neighborhood close to the Tech Center'],
      ],
    },
    body: [
      { h: 'The short answer' },
      { p: 'Choose Aurora if you want more choice: more neighborhoods, more price points and many new homes. Choose Centennial if you want an established neighborhood, one county, and a short drive to the Denver Tech Center. Either way, the exact address matters more than the city name.' },
      { h: 'Size and character' },
      { p: 'Aurora is the third-largest city in Colorado, with 386,261 residents in the 2020 census. It stretches from older neighborhoods near Colfax to new subdivisions far to the east and southeast. Centennial is much smaller, with 108,418 residents, and much younger as a city: it was incorporated in 2001. Interstate 25 divides Centennial roughly in half.' },
      { h: 'Schools: check the district by address, not by city' },
      { p: 'This is where buyers most often get surprised. Several school districts serve Aurora, mainly Cherry Creek Schools and Aurora Public Schools, with parts in 27J, Douglas County and Bennett. Most of Centennial is in Cherry Creek Schools, and the western part is in Littleton Public Schools.' },
      { p: 'Two homes with the same city name can be in different districts. Tamila checks the district for every address before you tour it.' },
      { h: 'Property taxes and metro districts' },
      { p: 'Aurora sits in three counties, Arapahoe, Adams and Douglas, so the tax bill depends on which county the home is in. Many newer Aurora neighborhoods also have a metro district: an extra tax on the property tax bill that repays the roads and utilities built for the subdivision. It can change the monthly payment noticeably.' },
      { p: 'Centennial is entirely in Arapahoe County, which makes taxes simpler to compare between homes. Whatever you buy, ask for the full tax bill, not just the price.' },
      { p: 'You can test the difference yourself in our Colorado mortgage calculator, which has a separate field for metro district tax.' },
      { h: 'Getting around' },
      { p: 'Aurora has the RTD R Line light rail, which connects to the A Line train to downtown Denver and Denver International Airport. Buckley Space Force Base and the Anschutz Medical Campus are both in Aurora, which makes it a natural choice for military families and medical staff.' },
      { p: 'Centennial is built around I-25, C-470 and E-470, with the Denver Tech Center next door. Centennial Airport, a general aviation airport, borders the city.' },
      { h: 'What to watch for when you buy' },
      { list: [
        'Aurora: confirm the county, the school district and whether there is a metro district tax and an HOA.',
        'Centennial: many homes are several decades old. Budget for the inspection items buyers ask about most: sewer line, furnace and air conditioning, foundation and roof.',
        'Both: compare homes by the full monthly payment, not by price alone.',
      ] },
      { h: 'Selling one and buying the other?' },
      { p: 'Many of Tamila\'s clients move between these two cities. When you sell your home and buy the next one with Tamila, her listing fee is 1% instead of the usual up to 3%. She is also a mortgage loan officer, so the sale, the purchase and the loan are handled by one person.' },
    ],
    sources: [
      ['Aurora, Colorado (Wikipedia, 2020 census and school districts)', 'https://en.wikipedia.org/wiki/Aurora,_Colorado'],
      ['Centennial, Colorado (Wikipedia, incorporation, 2020 census and school districts)', 'https://en.wikipedia.org/wiki/Centennial,_Colorado'],
    ],
    links: [['Aurora area guide', '/areas/aurora'], ['Centennial area guide', '/areas/centennial'], ['Colorado mortgage calculator', '/mortgage-calculator'], ['How the 1% listing works', '/sell-for-1-percent']],
  },
];
