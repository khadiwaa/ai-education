// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI Education',
  tagline: 'Building AI fluency across engineering teams',
  favicon: 'img/favicon.ico',

  url: 'https://your-org.github.io',
  baseUrl: '/', // Change to '/ai-education-hl/' when deploying to GitHub Pages

  organizationName: 'your-org',
  projectName: 'ai-education-hl',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/your-org/ai-education-hl/tree/main/docs/',
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchResultContextMaxLength: 60,
        searchBarShortcutHint: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'AI Education',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'curriculum',
            position: 'left',
            label: 'Curriculum',
          },
          {
            href: 'https://github.com/your-org/ai-education-hl',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Phase 1 — AI Essentials',
            items: [
              { label: 'How AI Actually Works', to: '/docs/phase-1/how-ai-works' },
              { label: 'Using AI Effectively', to: '/docs/phase-1/using-ai-effectively' },
              { label: 'AI in Your Workflow', to: '/docs/phase-1/ai-in-your-workflow' },
            ],
          },
          {
            title: 'Phase 2 — Copilot in Practice',
            items: [
              { label: 'Copilot CLI Essentials', to: '/docs/phase-2/copilot-cli-essentials' },
              { label: 'Copilot in VS Code', to: '/docs/phase-2/copilot-in-vscode' },
              { label: 'Skills & Customization', to: '/docs/phase-2/skills-and-customization' },
              { label: 'MCP & Integrations', to: '/docs/phase-2/mcp-and-integrations' },
              { label: 'Real-World Workflows', to: '/docs/phase-2/real-world-workflows' },
            ],
          },
          {
            title: 'Phase 3 — Deep Dives',
            items: [
              { label: 'Overview & Learning Paths', to: '/docs/phase-3/overview' },
              { label: 'Technical Track', to: '/docs/phase-3/t1-transformer-architecture' },
              { label: 'Strategic Track', to: '/docs/phase-3/s1-platform-strategy' },
            ],
          },
          {
            title: 'Contribute',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-org/ai-education-hl',
              },
              {
                label: 'Contributing Guide',
                href: 'https://github.com/your-org/ai-education-hl/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
        copyright: `Built by engineers, for engineers.`,
      },
      prism: {
        additionalLanguages: ['bash', 'typescript', 'python'],
      },
    }),
};

module.exports = config;
