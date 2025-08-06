export const documentAnalysisSchema = {
  name: 'documentAnalysis',
  title: 'Document Analysis',
  type: 'document',
  fields: [
    {
      name: 'fileName',
      title: 'File Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'originalFile',
      title: 'Original File',
      type: 'file'
    },
    {
      name: 'summary',
      title: 'AI Summary',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'checklist',
      title: 'Compliance Checklist',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'item', title: 'Item', type: 'string' },
            { name: 'compliant', title: 'Compliant', type: 'boolean' },
            { name: 'notes', title: 'Notes', type: 'text' }
          ]
        }
      ]
    },
    {
      name: 'category',
      title: 'Document Category',
      type: 'string',
      options: {
        list: [
          { title: 'Safety Manual', value: 'safety-manual' },
          { title: 'Environmental Report', value: 'environmental' },
          { title: 'Compliance Document', value: 'compliance' },
          { title: 'Training Material', value: 'training' },
          { title: 'Policy Document', value: 'policy' }
        ]
      }
    },
    {
      name: 'uploadedBy',
      title: 'Uploaded By',
      type: 'string'
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
