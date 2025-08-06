export const supplierProfileSchema = {
  name: 'supplierProfile',
  title: 'Supplier Profile',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    },
    {
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'website', title: 'Website', type: 'url' },
        { name: 'address', title: 'Address', type: 'text' }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'aiSummary',
      title: 'AI Generated Summary',
      type: 'text'
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'specializations',
      title: 'Specializations',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Mining Equipment', value: 'equipment' },
              { title: 'Safety Solutions', value: 'safety' },
              { title: 'Environmental Services', value: 'environmental' },
              { title: 'Consulting', value: 'consulting' },
              { title: 'Transportation', value: 'transportation' },
              { title: 'Technology', value: 'technology' }
            ]
          }
        }
      ]
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string'
    },
    {
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'featured',
      title: 'Featured',
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
