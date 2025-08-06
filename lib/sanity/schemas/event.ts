export const eventSchema = {
  name: 'event',
  title: 'Mining Events',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'eventImage',
      title: 'Event Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'datetime'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'venue', title: 'Venue', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'country', title: 'Country', type: 'string' },
        { name: 'isVirtual', title: 'Virtual Event', type: 'boolean' }
      ]
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Conference', value: 'conference' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Webinar', value: 'webinar' },
          { title: 'Trade Show', value: 'trade-show' },
          { title: 'Networking', value: 'networking' }
        ]
      }
    },
    {
      name: 'organizer',
      title: 'Organizer',
      type: 'string'
    },
    {
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url'
    },
    {
      name: 'featured',
      title: 'Featured',
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
