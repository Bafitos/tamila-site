// City pages. Facts are chosen to stay true for years (counties, school districts, rail, bases).
// No prices or market stats here: they change every month.
// Reviews are copied word for word from Zillow / Realtor.com, with the neighborhood the platform shows.

export const cities = [
  {
    slug: 'aurora',
    desc: 'Aurora, CO real estate agent and loan officer Tamila Aspen. Counties, schools, metro district taxes and real reviews from Aurora clients.',
    name: 'Aurora',
    title: 'Aurora, CO Real Estate Agent & Lender',
    lead: 'Most of Tamila’s recent clients bought or sold in Aurora: from first townhomes in Rangeview to a hard divorce sale in Heritage Eagle Bend.',
    intro: 'Aurora is the third-largest city in Colorado and one of the most varied. Older ranch homes near Colfax, new subdivisions out east, golf communities in the southeast. The same city name can mean very different taxes, schools and HOA rules, so the exact address matters more here than almost anywhere else in the metro.',
    facts: [
      ['Counties', 'Aurora sits in three counties: Arapahoe, Adams and Douglas. Property tax depends on which one your address is in.'],
      ['Schools', 'Several districts serve Aurora, mainly Cherry Creek Schools and Aurora Public Schools, plus parts of 27J, Douglas County and Bennett. Check the district by address, not by city name.'],
      ['Getting around', 'The RTD R Line light rail runs through Aurora and connects to the A Line train to Denver and the airport.'],
      ['Nearby', 'Buckley Space Force Base and the Anschutz Medical Campus (UCHealth and Children’s Hospital Colorado) are both in Aurora.'],
    ],
    tips: [
      'Many newer neighborhoods in east and southeast Aurora have a metro district tax and an HOA on top of regular property tax. Tamila adds both to your real monthly payment before you make an offer.',
      'Stationed at Buckley? Tamila is a Military Relocation Professional and does VA loans herself. Her son serves in the U.S. Air Force.',
    ],
    neighborhoods: ['Meadow Hills', 'Rangeview', 'Tallyn’s Reach', 'Heritage Eagle Bend', 'Sky Ranch'],
    reviews: [
      { who: 'Anne Harken Mitchell', role: 'Bought a home · Meadow Hills', src: 'Zillow', text: 'I was buying from out of state and she was so helpful. She made herself available when I was in town to look at homes and she always answered my calls. She helped me with the paperwork and made the process smooth as I still lived out of state when I closed.' },
      { who: 'Shahzad Choudhry', role: 'Sold a home · Heritage Eagle Bend', src: 'Zillow', text: 'It was a difficult divorce situation with multiple problems popping up throughout. Tamila was fully engaged with all parties, managing all issues, and somehow got the home sold, which at times seemed impossible. She was our second agent, the first one gave up and quit.' },
      { who: 'Luba N', role: 'Bought and sold · Tallyn’s Reach', src: 'Zillow', text: 'She helped me buy my dream home and sell my house, handling everything smoothly and on time. She patiently explained every detail I did not understand, and during moments of doubt she was always there for me.' },
      { who: 'Z Elisa', role: 'Bought a townhome · Rangeview', src: 'Zillow', text: 'Not only is she extremely knowledgeable in the real estate domain, but she also places such importance on how her clients feel throughout their home buying journey. You can’t feel anything but gratitude on closing day.' },
    ],
    faq: [
      ['Which school district is my Aurora address in?', 'It depends on the exact address. Aurora is served mainly by Cherry Creek Schools and Aurora Public Schools, with some areas in 27J, Douglas County or Bennett. Tamila checks the district for every home before you tour it.'],
      ['What is a metro district tax?', 'Many newer Colorado neighborhoods were built with a metro district that pays for roads, water lines and parks. Homeowners repay it through an extra line on the property tax bill, for many years. It can change your monthly payment noticeably, so Tamila includes it when she calculates what a home really costs.'],
    ],
    photo: 'walking',
  },
  {
    slug: 'centennial',
    desc: 'Centennial, CO real estate agent and loan officer Tamila Aspen, office on Belleview Ave. School districts, local tips and client reviews.',
    name: 'Centennial',
    title: 'Centennial, CO Real Estate Agent & Lender',
    lead: 'Tamila’s office is in Centennial, on Belleview Avenue near the Tech Center. Clients here bought, sold, and some did both with her.',
    intro: 'Centennial became a city in 2001, which makes it one of the youngest cities in the metro. It is mostly established neighborhoods with quick access to I-25, the Denver Tech Center and E-470. Interstate 25 divides the city roughly in half.',
    facts: [
      ['County', 'All of Centennial is in Arapahoe County.'],
      ['Schools', 'Most of the city is in Cherry Creek Schools. The western part is in Littleton Public Schools.'],
      ['Getting around', 'I-25, C-470 and E-470 meet nearby. Light rail stations at the Tech Center are a short drive away.'],
      ['Nearby', 'Centennial Airport, the Denver Tech Center and the Broncos’ training facility in Dove Valley.'],
    ],
    tips: [
      'Many Centennial homes are several decades old. Before you list, think about what a buyer’s inspector will look at first: sewer line, furnace and air conditioning, foundation and roof.',
      'Selling one Centennial home and buying the next? That is exactly the case where Tamila lists for 1%.',
    ],
    neighborhoods: ['Near the Tech Center', 'East of I-25', 'West of I-25'],
    reviews: [
      { who: 'pavolberresford', role: 'Bought and sold', src: 'Zillow', text: 'I had an absolutely fantastic experience with Tamila as my real estate agent. She was incredibly knowledgeable, attentive, and dedicated throughout the entire process. She went above and beyond in every aspect, and now she is my lifetime agent.' },
      { who: 'rumakinyvgeniy', role: 'Bought a home', src: 'Zillow', text: 'A true professional and skilled negotiator. Very punctual and responsive, she handles all tasks efficiently and is available around the clock, 24/7. With extensive experience, she skillfully negotiated the transaction and secured a great discount on the property.' },
    ],
    faq: [
      ['Can I meet Tamila in person?', 'Yes. Her office is at 7887 E Belleview Ave, Suite 175, Centennial, CO 80111. Call or text first so she can set a time.'],
      ['Which school district is my Centennial home in?', 'Most of Centennial is in Cherry Creek Schools and the western part is in Littleton Public Schools. Tamila confirms the district for each address.'],
    ],
    photo: 'portrait',
  },
  {
    slug: 'denver',
    desc: 'Denver real estate agent and mortgage loan officer Tamila Aspen. Condos, older homes, sewer scopes and HOA documents explained simply.',
    name: 'Denver',
    title: 'Denver Real Estate Agent & Mortgage Lender',
    lead: 'Condos, bungalows, first homes and investment properties in the city. Tamila handles the house and the loan, in English, Russian or Ukrainian.',
    intro: 'Denver is a city and a county at the same time, with dozens of neighborhoods that each feel different: Victorian homes, 1950s ranches, new townhomes and downtown condos. Many homes are old, so inspections and HOA documents deserve extra attention.',
    facts: [
      ['County', 'Denver is a consolidated city and county. One property tax authority for the whole city.'],
      ['Schools', 'Denver Public Schools serves the city, with school choice across many neighborhoods.'],
      ['Getting around', 'RTD light rail and commuter trains, including the A Line from Union Station to Denver International Airport.'],
      ['Housing', 'A wide mix: condos and lofts, older single-family homes, and newer townhomes.'],
    ],
    tips: [
      'In an older Denver home, ask for a sewer line camera inspection. Old clay and cast iron lines are among the most common surprise repairs.',
      'Buying a condo? Read the HOA documents before the deadline in your contract: reserves, special assessments, and rules about rentals. Tamila goes through them with you.',
    ],
    neighborhoods: ['Dayton Triangle', 'Condos & townhomes', 'Older single-family homes'],
    reviews: [
      { who: 'Kevin Gailey', role: 'First home', src: 'Realtor.com', text: 'Tamila was the kindest, most knowledgeable and absolutely lovely partner in my home buying journey. She followed up when she said she would. Was always on time. She helped with any and all questions I had as a first time home owner.' },
      { who: 'April Thomas', role: 'First home', src: 'Realtor.com', text: 'She was incredibly knowledgeable, patient when explaining difficult contract terms, super responsive, and willing to work quickly to be able to get offers in before short timelines.' },
    ],
    reviewsTitle: 'First-time buyers in the Denver metro',
    faq: [
      ['Should I get a sewer scope in Denver?', 'For an older home, yes, in most cases. A camera inspection of the sewer line costs little compared with replacing a broken line, and it gives you a reason to negotiate if something is found.'],
      ['Can you help me buy a condo with an FHA or VA loan?', 'Some condo buildings are approved for FHA or VA loans and some are not. Tamila is the loan officer too, so she checks this before you fall in love with a unit.'],
    ],
    photo: 'on-phone',
  },
  {
    slug: 'thornton',
    desc: 'Thornton, CO real estate agent and loan officer Tamila Aspen. School districts, N Line stations and how a buyer got $30,000 off in Grange Creek.',
    name: 'Thornton',
    title: 'Thornton, CO Real Estate Agent & Lender',
    lead: 'In Grange Creek, Tamila negotiated for her buyer until the seller paid closing costs and dropped the price by $30,000.',
    intro: 'Thornton began in the 1950s as the first fully planned community in Adams County and has grown north ever since. Older homes are near 88th Avenue; many of the newer neighborhoods are north of 120th, close to E-470 and I-25.',
    facts: [
      ['County', 'Thornton is in Adams County, with a small part in Weld County.'],
      ['Schools', 'Several districts serve Thornton, mainly Adams 12 Five Star Schools, plus Mapleton and 27J. Check by address.'],
      ['Getting around', 'The RTD N Line commuter train stops at 88th Ave, 104th Ave (Thornton Crossroads) and 124th Ave (Eastlake) and goes to Union Station.'],
      ['Outdoors', 'More than 80 miles of trails and a large network of parks and open space.'],
    ],
    tips: [
      'Newer neighborhoods in north Thornton often have a metro district tax and an HOA. Compare homes by the total monthly payment, not by price alone.',
      'A good offer is more than a price. Seller-paid closing costs can lower the cash you need at closing, and Tamila knows how to ask for them.',
    ],
    neighborhoods: ['Grange Creek', 'North Thornton', 'Original Thornton'],
    reviews: [
      { who: 'bigfishhart28', role: 'Bought a home · Grange Creek', src: 'Zillow', text: 'She is a rockstar and made my dream of owning a home a reality. She did everything from showing homes to negotiating with the seller to pay closing costs and drop the price by $30,000. She is awesome and truly cares about her clients.' },
    ],
    faq: [
      ['Can I ask the seller to pay my closing costs?', 'Yes, you can ask, and it is common. How much depends on the market, the home and your loan program, because each program limits seller contributions. Tamila knows those limits because she is also the loan officer.'],
      ['Which school district is my Thornton address in?', 'Most of Thornton is in Adams 12 Five Star Schools, but some areas are in Mapleton or 27J. Tamila checks the district for every address.'],
    ],
    photo: 'full-length',
  },
  {
    slug: 'parker',
    desc: 'Parker, CO real estate agent and loan officer Tamila Aspen. Condos, townhomes and family homes in Douglas County, with real client reviews.',
    name: 'Parker',
    title: 'Parker, CO Real Estate Agent & Lender',
    lead: 'Condos, townhomes and family homes in Parker. Tamila sold a condo in Cottonwood for a client who calls her “one of the kindest people you will ever meet.”',
    intro: 'Parker started as a stagecoach stop called Twenty Mile House and is now a town of family neighborhoods on the southeast edge of the metro. Many residents commute to the Tech Center or Denver by Parker Road and E-470.',
    facts: [
      ['County', 'Parker is a home rule town in Douglas County.'],
      ['Schools', 'Douglas County School District serves Parker.'],
      ['Getting around', 'Parker Road (Hwy 83) and E-470. The Tech Center is a short drive north.'],
      ['Nearby', 'AdventHealth Parker hospital, Rueter-Hess Reservoir trails and the Cherry Creek Trail.'],
    ],
    tips: [
      'Selling a condo or townhome? Buyers and their lenders will ask for HOA documents early. Tamila gathers them before listing so the sale does not stall.',
      'Moving up from a condo to a house in Parker? Sell and buy with Tamila and your listing fee is 1%.',
    ],
    neighborhoods: ['Cottonwood', 'Condos & townhomes', 'Family neighborhoods'],
    reviews: [
      { who: 'akimgoetz', role: 'Sold a condo · Cottonwood', src: 'Zillow', text: 'Tamila helped me sell my condominium. I find her to be extremely knowledgeable and responsive. Her professionalism and expertise are exemplary. In addition to her outstanding skills in real estate, she is one of the kindest people you will ever meet.' },
    ],
    faq: [
      ['What HOA documents do I need to sell a condo?', 'Usually the declaration, bylaws, rules, budget, recent meeting minutes and a status letter from the HOA. Tamila requests them at listing, because the buyer has a short deadline to review them.'],
      ['Is Parker a city or a town?', 'Parker is a home rule town in Douglas County, served by Douglas County School District.'],
    ],
    photo: 'portrait',
  },
  {
    slug: 'brighton',
    desc: 'Brighton, CO real estate agent and loan officer Tamila Aspen. 27J Schools, metro district taxes and selling and buying at the same time.',
    name: 'Brighton',
    title: 'Brighton, CO Real Estate Agent & Lender',
    lead: 'In Riverdale Park, Tamila helped a client sell and buy at the same time and convinced the seller of the new house to come down on price.',
    intro: 'Brighton is the county seat of Adams County, a former farming town that keeps its small-town downtown while new neighborhoods grow around it. It is about half an hour north-east of downtown Denver.',
    facts: [
      ['County', 'Brighton is the county seat of Adams County. A small part of the city is in Weld County.'],
      ['Schools', '27J Schools serves Brighton.'],
      ['Getting around', 'I-76, E-470 and US-85. Denver International Airport is a short drive.'],
      ['Character', 'A historic downtown, farmland at the edges and many newer subdivisions.'],
    ],
    tips: [
      'Many newer Brighton subdivisions have a metro district tax. Ask for the full property tax bill, not just the price, before you compare homes.',
      'Not sure whether to sell first or buy first? A client here had an “out of the ordinary” situation, and Tamila advised her on the best way to proceed.',
    ],
    neighborhoods: ['Riverdale Park', 'Downtown Brighton', 'Newer subdivisions'],
    reviews: [
      { who: 'roxycuster', role: 'Bought and sold · Riverdale Park', src: 'Zillow', text: 'My situation was a little out of the ordinary and she gave me good advice on the best way to proceed given my circumstances. She negotiated the purchase price of my new house and convinced the seller to come down a bit. She was always responsive and quick to act if I found places I wanted to see.' },
    ],
    faq: [
      ['Should I sell first or buy first?', 'It depends on your savings, your loan and the market. Some clients sell first and rent for a short time; others buy first with a contingency or a bridge plan. Tamila is also a loan officer, so she can show you what each option means for your payment.'],
      ['Which school district serves Brighton?', '27J Schools serves Brighton and nearby parts of Adams and Weld counties.'],
    ],
    photo: 'walking',
  },
  {
    slug: 'colorado-springs',
    desc: 'Colorado Springs agent and VA loan officer for military families. PCS to Fort Carson, Peterson, Schriever or USAFA with Tamila Aspen.',
    name: 'Colorado Springs',
    title: 'Colorado Springs Agent for Military Families',
    lead: 'PCS to Fort Carson, Peterson, Schriever or the Air Force Academy? Tamila is a Military Relocation Professional and a VA loan officer, and a military mom herself.',
    intro: 'Colorado Springs is the seat of El Paso County and one of the biggest military communities in the country. Many buyers here arrive on orders with a short window to find a home, often while still living in another state.',
    facts: [
      ['County', 'Colorado Springs is the county seat of El Paso County.'],
      ['Military', 'Fort Carson, Peterson Space Force Base, Schriever Space Force Base, Cheyenne Mountain Space Force Station and the U.S. Air Force Academy.'],
      ['Schools', 'Several school districts serve the city. Families on orders should check the district by address.'],
      ['Nearby', 'Monument and Larkspur to the north, also served by Tamila.'],
    ],
    tips: [
      'Get pre-approved for a VA loan before you arrive. Tamila can do the Certificate of Eligibility and the pre-approval herself, so you tour homes knowing your real budget.',
      'Buying from out of state is normal here. Tamila has clients who toured homes on a short visit and signed the closing papers while still living in another state.',
    ],
    neighborhoods: ['Near Fort Carson', 'Near Peterson & Schriever', 'North: Monument & Larkspur'],
    reviews: [
      { who: 'Anne Harken Mitchell', role: 'Bought from out of state · Aurora', src: 'Zillow', text: 'I was buying from out of state and she was so helpful. She made herself available when I was in town to look at homes and she always answered my calls. She helped me with the paperwork and made the process smooth as I still lived out of state when I closed.' },
    ],
    reviewsTitle: 'What buying from out of state is like',
    faq: [
      ['Can I buy a home in Colorado Springs before my PCS date?', 'Yes. With a VA pre-approval you can tour homes on a short house-hunting trip, or by video, and close remotely in many cases. Tamila coordinates the inspection, appraisal and paperwork while you are away.'],
      ['Do I need a down payment with a VA loan?', 'In most cases no, if you have full entitlement and the price is within what you qualify for. A VA funding fee usually applies unless you are exempt, for example with a service-connected disability rating.'],
    ],
    photo: 'full-length',
    military: true,
  },
];
