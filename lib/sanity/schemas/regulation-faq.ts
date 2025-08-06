export const regulationFAQSchema = {
  name: 'regulationFAQ',
  title: 'Regulation FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' }
          ]
        }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Mining Safety', value: 'safety' },
          { title: 'Environmental', value: 'environmental' },
          { title: 'Labor Law', value: 'labor' },
          { title: 'Health & Safety', value: 'health' },
          { title: 'Compliance', value: 'compliance' },
          { title: 'Permits & Licenses', value: 'permits' }
        ]
      }
    },
    {
      name: 'aiGenerated',
      title: 'AI Generated',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'High', value: 'high' },
          { title: 'Medium', value: 'medium' },
          { title: 'Low', value: 'low' }
        ]
      },
      initialValue: 'medium'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
