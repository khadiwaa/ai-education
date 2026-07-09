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
      label: 'Phase 2 — Claude in Practice',
      collapsed: false,
      items: [
        'phase-2/claude-essentials',
        'phase-2/projects-and-instructions',
        'phase-2/creating-with-artifacts',
        'phase-2/connectors-and-skills',
        'phase-2/everyday-workflows',
      ],
    },
    {
      type: 'category',
      label: 'Phase 3 — Working Confidently with AI',
      collapsed: false,
      items: [
        'phase-3/overview',
        'phase-3/confidentiality-and-privacy',
        'phase-3/verifying-ai-output',
        'phase-3/choosing-tools-and-plans',
        'phase-3/bringing-ai-to-your-team',
        'phase-3/staying-current',
      ],
    },
    {
      type: 'category',
      label: 'Appendix — Under the Hood (Technical)',
      collapsed: true,
      items: [
        'appendix/overview',
        {
          type: 'category',
          label: 'Technical Deep Dives',
          items: [
            'appendix/t1-transformer-architecture',
            'appendix/t2-advanced-prompting',
            'appendix/t3-embeddings-rag',
            'appendix/t4-agents-multi-agent',
            'appendix/t5-fine-tuning',
            'appendix/t6-local-open-source-models',
          ],
        },
        {
          type: 'category',
          label: 'Strategy Deep Dives',
          items: [
            'appendix/s1-platform-strategy',
            'appendix/s2-cost-modeling',
            'appendix/s3-ai-product-strategy',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
