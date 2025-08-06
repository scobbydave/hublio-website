export const approvalSchema = {
  name: 'approval',
  title: 'Approval Queue',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'AI Tip', value: 'tip' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Blog Draft', value: 'blog' },
          { title: 'Regulation Checklist', value: 'regulation' },
          { title: 'Salary Insight', value: 'salary' },
          { title: 'Compliance Tip', value: 'compliance' },
          { title: 'Document Analysis', value: 'document' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'aiGenerated',
      title: 'AI Generated',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string'
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        { name: 'jobTitle', title: 'Job Title', type: 'string' },
        { name: 'salaryRange', title: 'Salary Range', type: 'string' },
        { name: 'fileName', title: 'File Name', type: 'string' },
        { name: 'originalQuestion', title: 'Original Question', type: 'text' }
      ]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'approvedAt',
      title: 'Approved At',
      type: 'datetime'
    },
    {
      name: 'approvedBy',
      title: 'Approved By',
      type: 'string'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'aiGenerated'
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection
      return {
        title: title,
        subtitle: `${subtitle.toUpperCase()} - ${media ? 'AI Generated' : 'Manual'}`,
        media: undefined
      }
    }
  }
}
