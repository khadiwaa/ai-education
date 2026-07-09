// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI Education',
  tagline: 'Practical AI skills for professionals — no coding required',
  favicon: 'img/favicon.svg',

  // Production domain (Vercel). If it changes, re-run `npm run build:skill`.
  url: 'https://ai-education.alexkhadiwala.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    mermaid: true,
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
    '@docusaurus/theme-mermaid',
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
            to: '/assessments',
            label: 'Assessments',
            position: 'left',
          },
          {
            to: '/question-bank',
            label: 'Question Bank',
            position: 'left',
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
              { label: 'AI in Your Workday', to: '/docs/phase-1/ai-in-your-workflow' },
            ],
          },
          {
            title: 'Phase 2 — Claude in Practice',
            items: [
              { label: 'Getting Started with Claude', to: '/docs/phase-2/claude-essentials' },
              { label: 'Projects & Instructions', to: '/docs/phase-2/projects-and-instructions' },
              { label: 'Creating with Artifacts', to: '/docs/phase-2/creating-with-artifacts' },
              { label: 'Connectors & Skills', to: '/docs/phase-2/connectors-and-skills' },
              { label: 'Everyday Workflows', to: '/docs/phase-2/everyday-workflows' },
            ],
          },
          {
            title: 'Phase 3 — Working Confidently with AI',
            items: [
              { label: 'Overview', to: '/docs/phase-3/overview' },
              { label: 'Confidentiality & Privacy', to: '/docs/phase-3/confidentiality-and-privacy' },
              { label: 'Verifying AI Output', to: '/docs/phase-3/verifying-ai-output' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Assessments', to: '/assessments' },
              { label: 'Question Bank', to: '/question-bank' },
              { label: 'Under the Hood (Appendix)', to: '/docs/appendix/overview' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} AI Education. Open source — free to use and adapt for your team.`,
      },
      prism: {
        additionalLanguages: ['bash', 'typescript', 'python'],
      },
    }),
};

module.exports = config;
