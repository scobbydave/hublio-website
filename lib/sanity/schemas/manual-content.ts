export const manualContentSchema = {
  name: 'manualContent',
  title: 'Manual Content',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Blog Post', value: 'blog' },
          { title: 'Regulation Article', value: 'regulation' },
          { title: 'Compliance Tip', value: 'tip' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Event', value: 'event' },
          { title: 'Supplier Profile', value: 'supplier' },
          { title: 'Salary Insight', value: 'salary' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
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
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
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
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'aiAssisted',
      title: 'AI Assisted',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'publishedAt',
      title: 'Published At',
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
      subtitle: 'type',
      media: 'featuredImage'
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection
      return {
        title: title,
        subtitle: subtitle.toUpperCase(),
        media: media
      }
    }
  }
}
