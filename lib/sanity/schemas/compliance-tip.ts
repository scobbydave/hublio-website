export const complianceTipSchema = {
  name: 'complianceTip',
  title: 'Compliance Tip',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Safety', value: 'safety' },
          { title: 'Environmental', value: 'environmental' },
          { title: 'Legal', value: 'legal' },
          { title: 'Operational', value: 'operational' }
        ]
      }
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
