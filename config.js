const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://hbbook.netlify.app/',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '/src/components/images/favicon.png',
    logoLink: '',
    title: "",
    githubUrl:'',
    helpUrl: '',
    tweetText: '',
    // social: `<li>
		//     <a href="https://twitter.com/hasurahq" target="_blank" rel="noopener">
		//       <div class="twitterBtn">
		//         <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/twitter-brands-block.svg' alt={'Discord'}/>
		//       </div>
		//     </a>
		//   </li>
		// 	<li>
		//     <a href="https://discordapp.com/invite/hasura" target="_blank" rel="noopener">
		//       <div class="discordBtn">
		//         <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/discord-brands-block.svg' alt={'Discord'}/>
		//       </div>
		//     </a>
		//   </li>`,
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: "",
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/TIL'
    ],
    collapsedNav: [
      '/java-fundamentals',
      '/springcore',
      '/TIL',
      '/datastructure',
      '/springsecurity',
      '/MIT공개강좌'
    ],
    links: [{ text: '깃헙', link: 'https://github.com/hanbyul9/' }, {text: '스터디 블로그', link: "http://studylog.tk"}],
    frontline: true,
    ignoreIndex: true,
    title: "PERSONAL WIKI 🐕 ",
  },
  siteMetadata: {
    title: 'hbbook | personal wiki',
    description: 'Documentation built with mdx. Powering hasura.io/learn ',
    ogImage: '/src/components/images/favicon.png',
    docsLocation: '',
    favicon: '/src/components/images/favicon.png'
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      // icons: [
      //   {
      //     src: '',
      //     sizes: ``,
      //     type: ``,
      //   },
      // ],
    },
  },
};

module.exports = config;
