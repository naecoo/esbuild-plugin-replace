import { defineConfig } from "vitepress";

export default defineConfig({
  title: "esbuild-plugin-replace",
  description: "Replace strings in files while bundling with esbuild",
  base: "/esbuild-plugin-replace/",

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Demo", link: "/demo/" },
      {
        text: "GitHub",
        link: "https://github.com/naecoo/esbuild-plugin-replace",
      },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Options", link: "/guide/options" },
          { text: "Examples", link: "/guide/examples" },
        ],
      },
      {
        text: "Demo",
        items: [{ text: "Online Demo", link: "/demo/" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/naecoo/esbuild-plugin-replace" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright 2024 naecoo",
    },
  },
});
