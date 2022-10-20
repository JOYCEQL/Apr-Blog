import { defineConfig } from 'vitepress'

export default defineConfig({
  head:[
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["meta", { name: "keywords", content: "四月清晨" }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // 引入 Gitalk
    [
      "link",
      { rel: "stylesheet", href: "https://lib.baomitu.com/gitalk/1.7.0/gitalk.min.css" },
    ],
    ["script", { src: "https://lib.baomitu.com/gitalk/1.7.0/gitalk.min.js" }],
    ["script", { src: "https://lib.baomitu.com/axios/0.21.1/axios.js" }]
  ],
  title:'四月清晨',
  themeConfig: {
    displayAllHeaders:true,
    logo: '/favicon.ico',
    author: "悲伤日记",
    search: true,
    socialLinks: [
        { icon: 'github', link: 'https://github.com/JOYCEQL' }
    ],
  },
})