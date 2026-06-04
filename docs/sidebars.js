/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  curriculum: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Phase 1 — AI Essentials',
      collapsed: false,
      items: [
        'phase-1/how-ai-works',
        'phase-1/using-ai-effectively',
        'phase-1/ai-in-your-workflow',
      ],
    },
    {
      type: 'category',
      label: 'Phase 2 — GitHub Copilot in Practice',
      collapsed: false,
      items: [
        'phase-2/copilot-cli-essentials',
        'phase-2/copilot-in-vscode',
        'phase-2/skills-and-customization',
        'phase-2/mcp-and-integrations',
        'phase-2/real-world-workflows',
      ],
    },
    {
      type: 'category',
      label: 'Phase 3 — Deep Dives',
      collapsed: true,
      items: [
        'phase-3/overview',
        {
          type: 'category',
          label: 'Technical Track',
          items: [
            'phase-3/t1-transformer-architecture',
            'phase-3/t2-advanced-prompting',
            'phase-3/t3-embeddings-rag',
            'phase-3/t4-agents-multi-agent',
            'phase-3/t5-fine-tuning',
          ],
        },
        {
          type: 'category',
          label: 'Strategic Track',
          items: [
            'phase-3/s1-platform-strategy',
            'phase-3/s2-cost-modeling',
            'phase-3/s3-ai-product-strategy',
            'phase-3/s4-team-education',
            'phase-3/s5-staying-current',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
