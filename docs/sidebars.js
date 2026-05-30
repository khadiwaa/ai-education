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
      label: 'Phase 2 — Deep Dives',
      collapsed: true,
      items: [
        'phase-2/overview',
        {
          type: 'category',
          label: 'Technical Track',
          items: [
            'phase-2/t1-transformer-architecture',
            'phase-2/t2-advanced-prompting',
            'phase-2/t3-embeddings-rag',
            'phase-2/t4-agents-multi-agent',
            'phase-2/t5-fine-tuning',
          ],
        },
        {
          type: 'category',
          label: 'Strategic Track',
          items: [
            'phase-2/s1-platform-strategy',
            'phase-2/s2-cost-modeling',
            'phase-2/s3-ai-product-strategy',
            'phase-2/s4-team-education',
            'phase-2/s5-staying-current',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
