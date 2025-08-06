// Schema imports
import { vacancySchema } from './schemas/vacancy'
import { leadSchema } from './schemas/lead'
import { faqSchema } from './schemas/faq'
import { approvalSchema } from './schemas/approval'
import { regulationArticleSchema } from './schemas/regulation-article'
import { complianceTipSchema } from './schemas/compliance-tip'
import { documentAnalysisSchema } from './schemas/document-analysis'
import { regulationFAQSchema } from './schemas/regulation-faq'
import { supplierProfileSchema } from './schemas/supplier-profile'
import { eventSchema } from './schemas/event'
import { salaryInsightSchema } from './schemas/salary-insight'
import { manualContentSchema } from './schemas/manual-content'
import { blogPostSchema } from './schemas/blog-post'

export const schemaTypes = [
  // Core content types
  vacancySchema,
  leadSchema,
  faqSchema,
  blogPostSchema,
  
  // New V2 schemas
  approvalSchema,
  regulationArticleSchema,
  complianceTipSchema,
  documentAnalysisSchema,
  regulationFAQSchema,
  supplierProfileSchema,
  eventSchema,
  salaryInsightSchema,
  manualContentSchema
]

export default schemaTypes
