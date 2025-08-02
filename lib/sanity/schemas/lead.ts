// Sanity schema for leads captured by AI chat
export const leadSchema = {
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule: any) => rule.required().email()
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string'
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string'
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text'
    },
    {
      name: 'source',
      title: 'Lead Source',
      type: 'string',
      options: {
        list: [
          { title: 'AI Chat', value: 'ai-chat' },
          { title: 'Contact Form', value: 'contact-form' },
          { title: 'Vacancy Alert', value: 'vacancy-alert' },
          { title: 'Newsletter', value: 'newsletter' }
        ]
      }
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Qualified', value: 'qualified' },
          { title: 'Converted', value: 'converted' },
          { title: 'Closed', value: 'closed' }
        ]
      },
      initialValue: 'new'
    },
    {
      name: 'chatContext',
      title: 'Chat Context',
      type: 'text',
      description: 'Context from AI chat conversation'
    },
    {
      name: 'interest',
      title: 'Area of Interest',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Mining Consulting', value: 'consulting' },
          { title: 'Safety Training', value: 'safety' },
          { title: 'Equipment', value: 'equipment' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'Careers', value: 'careers' }
        ]
      }
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'followUpDate',
      title: 'Follow Up Date',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      description: 'source'
    },
    prepare(selection: any) {
      const { title, subtitle, description } = selection
      return {
        title,
        subtitle,
        description: `Source: ${description}`
      }
    }
  }
}
