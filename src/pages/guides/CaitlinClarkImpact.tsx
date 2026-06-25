import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Star, Target, Award } from 'lucide-react';

const CaitlinClarkImpact = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: "Caitlin Clark's Impact on Indiana Fever — A Statistical Analysis",
        description: 'Comprehensive statistical breakdown of Caitlin Clark\'s impact on the Indiana Fever, including scoring, assists, attendance, viewership, and cultural influence on women\'s basketball.',
        author: {
          '@type': 'Organization',
          name: 'Fever Game Today',
          url: 'https://fevergame.space'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Fever Game Today',
          url: 'https://fevergame.space'
        },
        datePublished: '2026-05-10',
        dateModified: '2026-06-25',
        mainEntityOfPage: 'https://fevergame.space/guides/caitlin-clark-impact',
        image: 'https://fevergame.space/og-caitlin-clark-impact.jpg'
      },
      {
        '@type': 'Person',
        name: 'Caitlin Clark',
        givenName: 'Caitlin',
        familyName: 'Clark',
        birthDate: '2002-01-22',
        birthPlace: {
          '@type': 'Place',
          name: 'Des Moines, Iowa, United States'
        },
        nationality: 'American',
        height: '6 ft 0 in',
        weight: '152 lb',
        jobTitle: 'Professional Basketball Player',
        affiliation: {
          '@type': 'SportsTeam',
          name: 'Indiana Fever',
          sport: 'Basketball',
          memberOf: {
            '@type': 'SportsOrganization',
            name: 'WNBA'
          }
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'University of Iowa'
        },
        description: 'Caitlin Clark is an American professional basketball player for the Indiana Fever of the WNBA. She was the No. 1 overall pick in the 2024 WNBA Draft after a record-breaking college career at the University of Iowa.'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fevergame.space/' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://fevergame.space/guides' },
          { '@type': 'ListItem', position: 3, name: "Caitlin Clark's Impact", item: 'https://fevergame.space/guides/caitlin-clark-impact' }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Caitlin Clark's Impact on Indiana Fever — A Statistical Analysis | Fever Game Today</title>
        <meta name="description" content="In-depth statistical analysis of Caitlin Clark's impact on the Indiana Fever. Scoring, assists, 3-point shooting, attendance records, viewership numbers, and cultural influence." />
        <link rel="canonical" href="https://fevergame.space/guides/caitlin-clark-impact" />
        <meta property="og:title" content="Caitlin Clark's Impact on Indiana Fever — Statistical Analysis" />
        <meta property="og:description" content="How Caitlin Clark transformed the Indiana Fever and women's basketball. A data-driven breakdown." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fevergame.space/guides/caitlin-clark-impact" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-500 via-red-600 to-red-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-6 text-red-100">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span>Guides</span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Caitlin Clark Impact</span>
          </nav>
          <div className="flex items-center mb-6">
            <BarChart3 className="h-10 w-10 mr-4" />
            <span className="bg-white/20 text-sm font-semibold px-3 py-1 rounded-full">Statistical Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Caitlin Clark's Impact on Indiana Fever — A Statistical Analysis
          </h1>
          <p className="text-xl text-red-100 max-w-3xl">
            From record-setting Iowa career to franchise-altering WNBA debut, a data-driven look at how one player reshaped an organization and an entire league.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">

          {/* Introduction */}
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            When the Indiana Fever selected Caitlin Clark with the No. 1 overall pick in the 2024 WNBA Draft, the franchise was acquiring more than a basketball player. Clark arrived as a cultural phenomenon, the most decorated scorer in NCAA Division I history, and a player whose gravitational pull would transform every metric the WNBA uses to measure success — on the court, in the stands, and on television screens around the world.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Now entering her third professional season, Clark's impact can be measured in hard numbers. This analysis examines her statistical contributions, her effect on team performance, and the broader economic and cultural ripple effects she has created across women's basketball.
          </p>

          {/* Section 1: Career Overview */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900">Career Overview: Iowa to Indiana</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Caitlin Clark's college career at the University of Iowa set records that may stand for decades. She graduated as the all-time leading scorer in NCAA Division I basketball history — men's or women's — with 3,951 points across four seasons. She led Iowa to back-to-back NCAA Championship game appearances in 2023 and 2024, becoming the face of women's college basketball in the process.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Her senior season drew television audiences that rivaled or exceeded many men's college basketball broadcasts. The 2024 NCAA Women's Championship game featuring Iowa drew over 18.9 million viewers, making it the most-watched basketball game — college or professional, men's or women's — in ESPN's history.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Indiana Fever, who had finished with the league's worst record in 2023, won the draft lottery and selected Clark on April 15, 2024. From her very first preseason game, the impact was immediate and measurable. Her debut regular-season game against the Connecticut Sun drew 2.12 million viewers on ESPN, the most-watched WNBA game in over two decades.
            </p>
          </section>

          {/* Section 2: Key Statistics */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900">Key Statistical Contributions</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Clark's statistical profile reveals a player who contributes across every offensive category. The following table summarizes her key season averages since entering the WNBA.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-50 text-left">
                    <th className="px-4 py-3 font-bold text-gray-900">Season</th>
                    <th className="px-4 py-3 font-bold text-gray-900">PPG</th>
                    <th className="px-4 py-3 font-bold text-gray-900">APG</th>
                    <th className="px-4 py-3 font-bold text-gray-900">RPG</th>
                    <th className="px-4 py-3 font-bold text-gray-900">3P%</th>
                    <th className="px-4 py-3 font-bold text-gray-900">FG%</th>
                    <th className="px-4 py-3 font-bold text-gray-900">3PM/G</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">2024 (Rookie)</td>
                    <td className="px-4 py-3 text-gray-700">19.2</td>
                    <td className="px-4 py-3 text-gray-700">8.4</td>
                    <td className="px-4 py-3 text-gray-700">5.7</td>
                    <td className="px-4 py-3 text-gray-700">34.4%</td>
                    <td className="px-4 py-3 text-gray-700">41.7%</td>
                    <td className="px-4 py-3 text-gray-700">2.4</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">2025</td>
                    <td className="px-4 py-3 text-gray-700">22.6</td>
                    <td className="px-4 py-3 text-gray-700">9.1</td>
                    <td className="px-4 py-3 text-gray-700">5.4</td>
                    <td className="px-4 py-3 text-gray-700">37.8%</td>
                    <td className="px-4 py-3 text-gray-700">44.2%</td>
                    <td className="px-4 py-3 text-gray-700">3.1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">2026 (Current)</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">24.1*</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">9.8*</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">5.9*</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">39.2%*</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">45.5%*</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">3.4*</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-sm italic mb-6">* 2026 statistics are projections based on early-season performance and may change as the season progresses.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Scoring</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark's scoring average has increased each season, rising from 19.2 points per game as a rookie to a projected 24.1 in 2026. What makes her scoring particularly valuable is its efficiency and volume. She maintains a high usage rate while steadily improving her field goal percentage, suggesting genuine skill development rather than simply taking more shots.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Assists and Playmaking</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark's assist numbers are historically elite. Her 8.4 assists per game as a rookie set the WNBA single-season record, and she has continued to build on that. Her court vision — the ability to see and execute passes that most players cannot — is the foundation of Indiana's offensive system. She leads the league in potential assists, hockey assists, and points created for teammates.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Three-Point Shooting</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark's deep three-point range stretches defenses in ways that create advantages for every Fever player. She regularly attempts and makes shots from 28 to 30 feet, well beyond the WNBA three-point line. Her three-point percentage has improved from 34.4% as a rookie to a projected 39.2% in 2026, reflecting both improved shot selection and physical conditioning.
            </p>
          </section>

          {/* Section 3: Attendance and Viewership */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900">Impact on Attendance and Viewership</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              The attendance numbers tell a story as dramatic as any fourth-quarter comeback. Before Clark's arrival, the Indiana Fever averaged approximately 4,067 fans per home game in 2023. In her rookie season of 2024, that figure more than tripled. The Fever led the WNBA in average home attendance and consistently sold out Gainbridge Fieldhouse, which seats over 17,000 for basketball.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                <p className="text-3xl font-black text-red-700">317%</p>
                <p className="text-sm text-gray-600 mt-1">Home attendance increase (2023 to 2024)</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                <p className="text-3xl font-black text-red-700">2.12M</p>
                <p className="text-sm text-gray-600 mt-1">Viewers for Clark's regular-season debut</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                <p className="text-3xl font-black text-red-700">No. 1</p>
                <p className="text-sm text-gray-600 mt-1">Top-selling WNBA jersey since 2024</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              The road attendance effect is equally striking. Opposing teams report significant increases in ticket sales when the Fever are the visiting team. Several franchises have moved Fever games to larger arenas to accommodate demand. The so-called "Caitlin Clark Effect" has become a measurable economic phenomenon across the entire league.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Television viewership has followed the same trajectory. WNBA ratings increased by over 170% during Clark's rookie season compared to the 2023 average. Games featuring the Fever consistently rank as the most-watched WNBA broadcasts of each week, and the league's new media rights deal — reportedly worth over $2.2 billion — was negotiated with Clark's audience-drawing power as a central factor.
            </p>
          </section>

          {/* Section 4: Comparison with Other WNBA Stars */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900">Comparison with Other Top WNBA Players</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Placing Clark's production in context requires comparing her output to the league's other premier players. The following table shows 2025 season averages for Clark alongside other All-Star caliber guards and forwards.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-50 text-left">
                    <th className="px-4 py-3 font-bold text-gray-900">Player</th>
                    <th className="px-4 py-3 font-bold text-gray-900">Team</th>
                    <th className="px-4 py-3 font-bold text-gray-900">PPG</th>
                    <th className="px-4 py-3 font-bold text-gray-900">APG</th>
                    <th className="px-4 py-3 font-bold text-gray-900">RPG</th>
                    <th className="px-4 py-3 font-bold text-gray-900">FG%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-red-50/50">
                    <td className="px-4 py-3 font-bold text-red-700">Caitlin Clark</td>
                    <td className="px-4 py-3 text-gray-700">IND</td>
                    <td className="px-4 py-3 text-gray-700">22.6</td>
                    <td className="px-4 py-3 text-gray-700">9.1</td>
                    <td className="px-4 py-3 text-gray-700">5.4</td>
                    <td className="px-4 py-3 text-gray-700">44.2%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">A'ja Wilson</td>
                    <td className="px-4 py-3 text-gray-700">LV</td>
                    <td className="px-4 py-3 text-gray-700">26.9</td>
                    <td className="px-4 py-3 text-gray-700">2.3</td>
                    <td className="px-4 py-3 text-gray-700">11.9</td>
                    <td className="px-4 py-3 text-gray-700">52.4%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">Breanna Stewart</td>
                    <td className="px-4 py-3 text-gray-700">NY</td>
                    <td className="px-4 py-3 text-gray-700">20.1</td>
                    <td className="px-4 py-3 text-gray-700">3.8</td>
                    <td className="px-4 py-3 text-gray-700">8.7</td>
                    <td className="px-4 py-3 text-gray-700">45.6%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">Sabrina Ionescu</td>
                    <td className="px-4 py-3 text-gray-700">NY</td>
                    <td className="px-4 py-3 text-gray-700">18.2</td>
                    <td className="px-4 py-3 text-gray-700">6.4</td>
                    <td className="px-4 py-3 text-gray-700">5.1</td>
                    <td className="px-4 py-3 text-gray-700">43.1%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">Arike Ogunbowale</td>
                    <td className="px-4 py-3 text-gray-700">DAL</td>
                    <td className="px-4 py-3 text-gray-700">21.3</td>
                    <td className="px-4 py-3 text-gray-700">5.2</td>
                    <td className="px-4 py-3 text-gray-700">3.4</td>
                    <td className="px-4 py-3 text-gray-700">41.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              What stands out immediately is Clark's assist average. Her 9.1 assists per game in 2025 exceeded the next-closest guard by a significant margin, reflecting her unique role as a primary playmaker who also functions as a lead scorer. While A'ja Wilson remains the league's most dominant overall player, Clark's dual-threat scoring and passing ability is unmatched among perimeter players.
            </p>
          </section>

          {/* Section 5: Style of Play */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900">Style of Play Analysis</h2>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Court Vision and Passing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark's most distinguishing skill is her court vision. She consistently delivers passes that arrive before defenders can react — skip passes across the court to open shooters, bounce passes through traffic to cutters, and lob entries over the top of zone defenses. Her ability to read defensive rotations in real time creates open shots for teammates that would not exist with a conventional point guard.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Deep Three-Point Range</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark's willingness and accuracy from well beyond the three-point arc creates a spacing problem that most WNBA defenses have never had to solve. When a point guard can hit pull-up threes from 28 feet, defenders must extend their coverage further from the basket, which opens driving lanes and creates space for the Fever's interior players like Aliyah Boston to operate in the post.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Pick-and-Roll Mastery</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Clark-Boston pick-and-roll has become one of the most efficient offensive actions in the WNBA. Clark's ability to shoot from deep forces the screener's defender to hedge aggressively, which opens Boston for rolls to the basket. When defenses switch, Clark attacks the mismatch. When they go under the screen, she pulls up for the three. The multiple layers of this decision tree make the action extraordinarily difficult to defend consistently.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Transition Game</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark ranks among the league leaders in transition scoring and assists. Her ability to push the pace after defensive rebounds and turnovers gives the Fever easy scoring opportunities before opposing defenses can set up. She has the ball-handling and speed to lead fast breaks, and her passing accuracy on the move creates high-percentage layups and dunks for trailing teammates.
            </p>
          </section>

          {/* Section 6: Team Performance */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900">Impact on Team Performance</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Fever's win-loss trajectory since drafting Clark tells a clear story of sustained improvement. In 2023, the season before Clark arrived, Indiana finished 13-27, the worst record in the league. In Clark's rookie season of 2024, the Fever improved to 20-20 and earned a playoff berth — the franchise's first postseason appearance in several years.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The 2025 season saw further improvement as the roster around Clark matured. The team's offensive rating jumped significantly, and they finished with a winning record. Clark's on-off court differentials are among the most dramatic in the league — when she sits, the Fever's offensive efficiency drops measurably, underscoring how dependent the system is on her playmaking.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Entering 2026, Indiana is widely considered a legitimate championship contender. The front office has built a complementary roster around Clark's skill set, adding shooting, defensive versatility, and depth. The team's net rating with Clark on the floor ranks among the best in the league.
            </p>
          </section>

          {/* Section 7: Cultural Impact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cultural Impact on Women's Basketball</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clark's influence extends far beyond statistics and wins. She has fundamentally altered the visibility and economic model of women's basketball. Young girls across the country wear her jersey and mimic her logo three-pointer celebration. Her social media following exceeds that of many NBA players, and her endorsement portfolio — which includes Nike, Gatorade, and State Farm — is among the most lucrative in women's sports history.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The WNBA's new media rights deal, reportedly valued at over $2.2 billion over 11 years, was negotiated during Clark's rookie season. While no single player is solely responsible for a league-wide media deal, industry analysts consistently cite Clark's audience-generating ability as a central factor in the deal's unprecedented value.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Perhaps most importantly, Clark has expanded the demographic reach of women's basketball. Viewership data shows significant increases among younger audiences, male viewers, and fans who had not previously followed the WNBA. Her playing style — flashy, confident, and relentlessly competitive — has proven to be broadly appealing in ways that attract casual sports fans.
            </p>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">The Caitlin Clark Effect by the Numbers</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>WNBA viewership up 170%+ since her rookie season</li>
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>League-wide average attendance increased by over 40%</li>
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Multiple expansion teams announced during the Clark era</li>
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>WNBA minimum salary has increased significantly since 2024</li>
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>Women's basketball youth participation rates at all-time highs</li>
              </ul>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Exploring</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/player/caitlin-clark" className="block bg-red-50 hover:bg-red-100 rounded-xl p-4 transition-colors border border-red-100">
                <span className="font-semibold text-red-700">Live Caitlin Clark Stats</span>
                <p className="text-sm text-gray-600 mt-1">Real-time stats, game logs, and season averages updated after every game.</p>
              </Link>
              <Link to="/schedule" className="block bg-red-50 hover:bg-red-100 rounded-xl p-4 transition-colors border border-red-100">
                <span className="font-semibold text-red-700">Fever Game Schedule</span>
                <p className="text-sm text-gray-600 mt-1">Full 2026 schedule with dates, opponents, and broadcast information.</p>
              </Link>
              <Link to="/news" className="block bg-red-50 hover:bg-red-100 rounded-xl p-4 transition-colors border border-red-100">
                <span className="font-semibold text-red-700">Latest Fever News</span>
                <p className="text-sm text-gray-600 mt-1">Breaking news, game previews, and post-game analysis.</p>
              </Link>
              <Link to="/videos" className="block bg-red-50 hover:bg-red-100 rounded-xl p-4 transition-colors border border-red-100">
                <span className="font-semibold text-red-700">Highlight Videos</span>
                <p className="text-sm text-gray-600 mt-1">Top plays, full game highlights, and press conferences.</p>
              </Link>
            </div>
          </section>

        </div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Statistics are sourced from publicly available WNBA data. 2026 figures are projections based on early-season trends. Fever Game Today is an independent fan site and is not officially affiliated with the Indiana Fever or the WNBA.</p>
        </div>
      </article>
    </div>
  );
};

export default CaitlinClarkImpact;
