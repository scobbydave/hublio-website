export const salaryInsightSchema = {
  name: 'salaryInsight',
  title: 'Salary Insight',
  type: 'document',
  fields: [
    {
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'jobTitle',
        maxLength: 96
      }
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'South Africa', value: 'south-africa' },
          { title: 'Gauteng', value: 'gauteng' },
          { title: 'Western Cape', value: 'western-cape' },
          { title: 'KwaZulu-Natal', value: 'kwazulu-natal' },
          { title: 'Limpopo', value: 'limpopo' },
          { title: 'Mpumalanga', value: 'mpumalanga' },
          { title: 'North West', value: 'north-west' }
        ]
      }
    },
    {
      name: 'aiEstimate',
      title: 'AI Salary Estimate',
      type: 'object',
      fields: [
        { name: 'min', title: 'Minimum (ZAR)', type: 'number' },
        { name: 'max', title: 'Maximum (ZAR)', type: 'number' },
        { name: 'average', title: 'Average (ZAR)', type: 'number' },
        { name: 'currency', title: 'Currency', type: 'string', initialValue: 'ZAR' }
      ]
    },
    {
      name: 'adminOverride',
      title: 'Admin Override',
      type: 'object',
      fields: [
        { name: 'min', title: 'Minimum (ZAR)', type: 'number' },
        { name: 'max', title: 'Maximum (ZAR)', type: 'number' },
        { name: 'average', title: 'Average (ZAR)', type: 'number' },
        { name: 'notes', title: 'Notes', type: 'text' }
      ]
    },
    {
      name: 'experienceLevel',
      title: 'Experience Level',
      type: 'string',
      options: {
        list: [
          { title: 'Entry Level (0-2 years)', value: 'entry' },
          { title: 'Mid Level (3-5 years)', value: 'mid' },
          { title: 'Senior Level (6-10 years)', value: 'senior' },
          { title: 'Executive Level (10+ years)', value: 'executive' }
        ]
      }
    },
    {
      name: 'tips',
      title: 'Career Tips',
      type: 'array',
      of: [{ type: 'text' }]
    },
    {
      name: 'requiredSkills',
      title: 'Required Skills',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'industry',
      title: 'Mining Industry',
      type: 'string',
      options: {
        list: [
          { title: 'Gold Mining', value: 'gold' },
          { title: 'Diamond Mining', value: 'diamond' },
          { title: 'Coal Mining', value: 'coal' },
          { title: 'Platinum Mining', value: 'platinum' },
          { title: 'Iron Ore', value: 'iron-ore' },
          { title: 'General Mining', value: 'general' }
        ]
      }
    },
    {
      name: 'searchCount',
      title: 'Search Count',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'aiGenerated',
      title: 'AI Generated',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime'
    }
  ]
}
