// Sanity schema for mining vacancies
export const vacancySchema = {
  name: 'vacancy',
  title: 'Mining Vacancy',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'salary',
      title: 'Salary',
      type: 'object',
      fields: [
        {
          name: 'min',
          title: 'Minimum Salary',
          type: 'number'
        },
        {
          name: 'max',
          title: 'Maximum Salary',
          type: 'number'
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'ZAR'
        }
      ]
    },
    {
      name: 'description',
      title: 'Job Description',
      type: 'text',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      description: 'AI-generated summary of the job'
    },
    {
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'jobType',
      title: 'Job Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Temporary', value: 'temporary' }
        ]
      }
    },
    {
      name: 'experienceLevel',
      title: 'Experience Level',
      type: 'string',
      options: {
        list: [
          { title: 'Entry Level', value: 'entry' },
          { title: 'Mid Level', value: 'mid' },
          { title: 'Senior Level', value: 'senior' },
          { title: 'Executive', value: 'executive' }
        ]
      }
    },
    {
      name: 'category',
      title: 'Mining Category',
      type: 'string',
      options: {
        list: [
          { title: 'Underground Mining', value: 'underground' },
          { title: 'Surface Mining', value: 'surface' },
          { title: 'Processing', value: 'processing' },
          { title: 'Safety', value: 'safety' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'Management', value: 'management' },
          { title: 'Operations', value: 'operations' }
        ]
      }
    },
    {
      name: 'externalId',
      title: 'External Job ID',
      type: 'string',
      description: 'ID from external job API'
    },
    {
      name: 'externalUrl',
      title: 'External Application URL',
      type: 'url'
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'postedDate',
      title: 'Posted Date',
      type: 'datetime'
    },
    {
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
      description: 'location'
    },
    prepare(selection: any) {
      const { title, subtitle, description } = selection
      return {
        title,
        subtitle: `${subtitle} - ${description}`,
      }
    }
  }
}
