import { getPosts, getPostLength } from  "./theme/serverUtils";

async function config() {
  return {
    // base:'/docs',
    lang: "en-US",
    title: "四月清晨",
    description: "Home of April",
    head: [
      [
        "link",
        {
          rel: "icon",
          // type: 'image/png',
          type: "image/jpeg",
          href: "/avator.jpg",
        },
      ],
      [
        "meta",
        {
          name: "author",
          content: "April",
        },
      ],
      [
        "meta",
        {
          property: "og:title",
          content: "Home",
        },
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "Home of Clark Cui",
        },
      ],
    ],
    // 暗黑模式
    appearance: true,
    
    lastUpdated: '上次更新',

    themeConfig: {
      // repo: "clark-cui/homeSite",
      docsDir: "/docs",
      docsBranch: "master",
      posts: await getPosts(),
      pageSize: 5, //几个为一页
      postLength: await getPostLength(), //博客有几篇

      //       algolia: {
      //         apiKey: "90a0bae6ff7307fb76896cbe2f975b0c",
      //         indexName: "clark-cui-docs",
      //       },

      nav: [
        {
          text: "🏡首页",
          link: "/",
        },
        {
          text: "🔖Tags",
          link: "/tags",
        },
        {
          text: "📃Archives",
          link: "/archives",
        },
      ],

      // sidebar: {
      //   "./posts/": false,
      //   "/": false,
      // },
      sidebar: false,
    
      // 自定义icon

      // socialLinks: [
      //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      // ],

      docFooter: {
        prev: 'Pagina prior',
        next: 'Proxima pagina'
      }
    },
    markdown: {
      headers: {
        level: [1, 2]
      }
    },
    sidebar: [
      {
        text: 'Section Title A',
        collapsible: true,
        items: []
      },
      {
        text: 'Section Title B',
        collapsible: true,
        items: []
      }
    ]
  };
}
export default config();
