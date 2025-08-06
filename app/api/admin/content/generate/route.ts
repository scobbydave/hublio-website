import { NextRequest, NextResponse } from 'next/server'
import { generateWithGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { type, title, category, region, useTemplate = false } = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 })
    }

    // If using template, return template content instead of AI generation
    if (useTemplate) {
      const templateContent = generateTemplateContent(type, title, category, region)
      return NextResponse.json(templateContent)
    }

    // Generate AI content based on type
    let prompt = ''
    let systemPrompt = 'You are an expert content creator for the South African mining industry. Create professional, accurate, and engaging content.'

    switch (type) {
      case 'blog':
        prompt = `Write a comprehensive blog post titled "${title}" for the South African mining industry. 
        ${category ? `Focus on the ${category} category. ` : ''}
        ${region ? `Tailor the content for the ${region} region. ` : ''}
        
        Structure the content with:
        - An engaging introduction
        - 3-4 main sections with clear headings
        - Practical insights and examples
        - A conclusion with key takeaways
        
        Keep the tone professional but accessible. Include relevant industry context and statistics where appropriate.`
        break

      case 'regulation':
        prompt = `Create a detailed regulation article titled "${title}" for South African mining operations.
        ${category ? `Focus on ${category} regulations. ` : ''}
        ${region ? `Include specific requirements for the ${region} region. ` : ''}
        
        Structure the content with:
        - Overview of the regulation
        - Key requirements and compliance steps
        - Penalties for non-compliance
        - Practical implementation tips
        - Recent updates or changes
        
        Ensure accuracy and include references to relevant legislation where appropriate.`
        break

      case 'tip':
        prompt = `Create a concise compliance tip titled "${title}" for mining operations.
        ${category ? `Focus on ${category} compliance. ` : ''}
        
        Provide:
        - A brief but comprehensive explanation (2-3 paragraphs)
        - Practical steps mining companies can take
        - Common mistakes to avoid
        - Key benefits of compliance
        
        Keep it actionable and easy to implement.`
        break

      case 'faq':
        prompt = `Create a comprehensive FAQ answer for the question: "${title}"
        ${category ? `Context: ${category} ` : ''}
        
        Provide:
        - A clear, detailed answer (2-4 paragraphs)
        - Step-by-step guidance if applicable
        - Common related questions or considerations
        - Relevant regulations or standards
        
        Make the answer helpful and complete while remaining concise.`
        break

      case 'salary':
        prompt = `Create salary insights and career advice for the position: "${title}" in South African mining.
        ${region ? `Focus on the ${region} market. ` : ''}
        
        Provide:
        - Market overview for this position
        - Factors affecting salary ranges
        - Career progression opportunities
        - Skills that can increase earning potential
        - Industry trends affecting compensation
        
        Keep the advice practical and current.`
        break

      default:
        prompt = `Create professional content titled "${title}" for the South African mining industry.
        ${category ? `Category: ${category}. ` : ''}
        ${region ? `Region: ${region}. ` : ''}
        
        Provide comprehensive, well-structured content that is informative and engaging.`
    }

    const generatedContent = await generateWithGemini(prompt, systemPrompt)
    
    // Generate an excerpt for blog posts
    let excerpt = ''
    if (type === 'blog') {
      const excerptPrompt = `Create a compelling 1-2 sentence excerpt for this blog post titled "${title}". The excerpt should summarize the key value and encourage reading. Keep it under 150 characters.`
      excerpt = await generateWithGemini(excerptPrompt, systemPrompt)
    }

    return NextResponse.json({
      content: generatedContent,
      excerpt: excerpt || generatedContent.substring(0, 150) + '...',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json({ 
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generateTemplateContent(type: string, title: string, category?: string, region?: string) {
  const templates = {
    blog: {
      example: `# ${title}

## Introduction
The mining industry continues to evolve with new technologies, regulations, and best practices. Understanding ${title.toLowerCase()} is crucial for mining professionals who want to stay ahead of industry trends and maintain operational excellence.

## Current Industry Landscape
Mining operations across ${region || 'South Africa'} are experiencing significant changes in ${category?.toLowerCase() || 'operational practices'}. Key developments include:

- Enhanced safety protocols and compliance requirements
- Integration of digital technologies and automation
- Environmental sustainability initiatives
- Workforce development and skills enhancement

## Best Practices and Implementation
### Strategic Planning
Successful implementation requires careful planning and stakeholder engagement. Consider these essential elements:

1. **Assessment Phase**: Evaluate current capabilities and identify improvement areas
2. **Resource Allocation**: Ensure adequate funding and personnel are available
3. **Timeline Development**: Create realistic milestones and delivery schedules
4. **Risk Management**: Identify potential challenges and mitigation strategies

### Operational Excellence
Focus on continuous improvement through:
- Regular performance monitoring and measurement
- Employee training and development programs
- Technology adoption and optimization
- Compliance with industry standards and regulations

## Regulatory Considerations
${region === 'South Africa' ? 'In South Africa, mining operations must comply with the Mine Health and Safety Act (MHSA) and other relevant legislation. Key compliance areas include:' : 'Regulatory compliance varies by region but typically includes:'}

- Safety management systems and protocols
- Environmental impact assessments and monitoring
- Worker health and safety requirements
- Reporting and documentation standards

## Future Outlook and Recommendations
The mining industry is moving towards more sustainable and efficient operations. Organizations should consider:

- Investing in digital transformation initiatives
- Developing comprehensive sustainability strategies
- Enhancing worker training and safety programs
- Building stronger community relationships

## Conclusion
${title} represents a critical aspect of modern mining operations. By implementing best practices, maintaining regulatory compliance, and embracing innovation, mining companies can achieve sustainable success while contributing positively to their communities and environments.

Success in this area requires commitment from leadership, engagement from all stakeholders, and a focus on continuous improvement. Regular review and adaptation of strategies will ensure long-term effectiveness and competitive advantage.

---
*This content is for informational purposes. Always consult with qualified professionals for specific mining operations and regulatory compliance.*`,
      excerpt: `Professional insights on ${title.toLowerCase()} for the mining industry. Essential information for ${category?.toLowerCase() || 'mining'} professionals in ${region || 'the region'}.`
    },

    regulation: {
      example: `# ${title}

## Regulation Overview
This regulation addresses critical compliance requirements for ${category?.toLowerCase() || 'mining operations'} within the ${region || 'applicable'} jurisdiction. Understanding and implementing these requirements is essential for legal operation and worker safety.

## Scope and Applicability
This regulation applies to:
- All mining operations regardless of size or commodity
- Contractors and service providers working on mine sites
- Equipment suppliers and technology providers
- Regulatory bodies and inspection personnel

## Key Requirements
### Mandatory Compliance Items
- **Documentation**: Maintain current records of all ${category?.toLowerCase() || 'operational'} activities
- **Certification**: Ensure all personnel hold appropriate qualifications
- **Reporting**: Submit regular compliance reports to relevant authorities
- **Auditing**: Conduct periodic internal and external compliance audits

### Implementation Timeline
- **Phase 1 (Months 1-3)**: Assessment and planning
- **Phase 2 (Months 4-6)**: System implementation and training
- **Phase 3 (Months 7-12)**: Full compliance and monitoring

## Compliance Steps
### Initial Assessment
1. Review current practices against new requirements
2. Identify gaps and non-compliance areas
3. Develop implementation plan and timeline
4. Allocate necessary resources and personnel

### System Implementation
1. Update policies and procedures
2. Train personnel on new requirements
3. Install required systems and equipment
4. Establish monitoring and reporting processes

### Ongoing Compliance
1. Regular monitoring and measurement
2. Periodic compliance audits and reviews
3. Continuous improvement initiatives
4. Stakeholder communication and engagement

## Documentation Requirements
Required documents include:
- **Compliance Management Plan**: Overall strategy and approach
- **Risk Assessment**: Identification and mitigation of compliance risks
- **Training Records**: Evidence of personnel competency
- **Audit Reports**: Regular compliance verification activities
- **Incident Reports**: Documentation of non-compliance events

## Penalties and Enforcement
Non-compliance may result in:
- Financial penalties and fines
- Operational restrictions or shutdowns
- Legal action and prosecution
- Reputational damage and stakeholder concerns

## Support and Resources
Organizations can access support through:
- Industry associations and professional bodies
- Regulatory guidance documents and workshops
- Compliance consulting services
- Training providers and educational institutions

## Implementation Checklist
- [ ] Regulatory requirement assessment completed
- [ ] Compliance team established and trained
- [ ] Policies and procedures updated
- [ ] Required systems and equipment installed
- [ ] Training program developed and delivered
- [ ] Monitoring and reporting systems operational
- [ ] First compliance report submitted

## References and Additional Information
- Mine Health and Safety Act (MHSA)
- Department of Mineral Resources regulations
- Industry best practice guidelines
- International mining standards and frameworks

For specific guidance on implementation, consult with qualified compliance professionals and regulatory authorities.`
    },

    tip: {
      example: `# ${title}

## Quick Tip Summary
${title} - A simple yet effective practice that can significantly improve ${category?.toLowerCase() || 'operational'} performance while reducing costs and risks.

## Why This Matters
Many mining operations overlook this important practice, leading to unnecessary costs, safety risks, and operational inefficiencies. Implementing this tip can result in:

- **Cost Reduction**: Save 10-30% on related operational expenses
- **Safety Improvement**: Reduce incident rates and improve worker protection
- **Compliance**: Meet regulatory requirements more effectively
- **Efficiency**: Streamline operations and improve productivity

## Step-by-Step Implementation
### Immediate Actions (This Week)
1. **Assess Current State**: Review existing practices and identify improvement opportunities
2. **Gather Resources**: Ensure you have necessary tools, equipment, and personnel
3. **Initial Training**: Brief key personnel on the new approach

### Short-term Implementation (This Month)
1. **Pilot Program**: Start with a small-scale trial to test effectiveness
2. **Monitor Results**: Track key performance indicators and safety metrics
3. **Adjust Approach**: Make necessary modifications based on initial results

### Long-term Sustainability (Ongoing)
1. **Full Rollout**: Implement across all relevant operations
2. **Regular Review**: Schedule periodic assessments and improvements
3. **Knowledge Sharing**: Share learnings with other teams and sites

## Expected Benefits
Based on industry experience, organizations implementing this practice typically see:

- **Immediate Impact** (First Month): Initial safety and efficiency improvements
- **Short-term Gains** (3-6 Months): Measurable cost reductions and performance gains
- **Long-term Value** (6+ Months): Sustained improvements and cultural change

## Common Challenges and Solutions
### Challenge: Resistance to Change
**Solution**: Involve workers in planning, provide clear communication about benefits, and recognize early adopters

### Challenge: Resource Constraints  
**Solution**: Start with low-cost pilot programs, demonstrate ROI, and scale gradually

### Challenge: Measurement Difficulties
**Solution**: Establish baseline metrics before implementation, use simple tracking methods

## Success Metrics
Monitor these key indicators to measure success:
- Safety incident reduction (target: 20-50% improvement)
- Cost savings (target: varies by implementation scope)
- Employee engagement and feedback scores
- Regulatory compliance improvements

## Real-World Application
This practice has been successfully implemented at mining operations across ${region || 'various regions'}, with documented improvements in safety, cost-effectiveness, and operational efficiency.

## Next Steps
1. **Immediate**: Share this tip with your team and discuss implementation
2. **This Week**: Conduct initial assessment of current practices  
3. **This Month**: Begin pilot implementation in selected area
4. **Ongoing**: Monitor, measure, and continuously improve

## Additional Resources
- Industry best practice guidelines for ${category?.toLowerCase() || 'mining operations'}
- Training programs and certification courses
- Professional consultation services
- Regulatory guidance and compliance resources

Remember: Small changes can lead to significant improvements. Start simple, measure results, and build on success.`,
      excerpt: `Quick, actionable tip: ${title}. Improve your ${category?.toLowerCase() || 'mining operations'} with this practical advice.`
    },

    faq: {
      example: `# ${title}

## Comprehensive Answer
${title.replace('What are ', '').replace('How do ', '').replace('?', '')} involves several key aspects that mining professionals must understand for effective implementation and compliance.

### Primary Requirements
The main requirements include:

1. **Regulatory Compliance**: All operations must meet current ${region || 'regional'} mining regulations and standards
2. **Safety Standards**: Implementation must prioritize worker safety and environmental protection
3. **Documentation**: Proper record-keeping and reporting are essential for regulatory compliance
4. **Training**: Personnel must receive appropriate training and certification

### Detailed Implementation Guide
#### Planning Phase
- Conduct thorough assessment of current practices
- Identify compliance gaps and improvement opportunities
- Develop comprehensive implementation strategy
- Allocate necessary resources and personnel

#### Execution Phase  
- Implement required systems and procedures
- Provide necessary training to all personnel
- Establish monitoring and measurement systems
- Begin regular reporting and documentation

#### Monitoring Phase
- Conduct regular compliance audits and assessments
- Monitor key performance indicators and safety metrics
- Implement continuous improvement initiatives
- Maintain stakeholder communication and engagement

### Regulatory Framework
${region === 'South Africa' ? 'In South Africa, this is governed by:' : 'This is typically governed by:'}

- **Mine Health and Safety Act (MHSA)**: Primary mining safety legislation
- **Department of Mineral Resources**: Regulatory oversight and enforcement
- **Industry Standards**: Relevant SANS and international standards
- **Best Practice Guidelines**: Industry association recommendations

### Industry Standards and Best Practices
Key standards include:
- ISO 45001: Occupational health and safety management systems
- ISO 14001: Environmental management systems
- SANS 10228: Guidelines for mining operations
- International mining and safety standards

### Common Implementation Challenges
#### Resource Limitations
- **Challenge**: Limited budget or personnel for implementation
- **Solution**: Phased approach, prioritize high-risk areas, seek industry partnerships

#### Technical Complexity
- **Challenge**: Complex technical requirements or systems integration
- **Solution**: Engage qualified consultants, provide comprehensive training

#### Regulatory Changes
- **Challenge**: Keeping up with evolving regulations and standards
- **Solution**: Regular monitoring, industry participation, professional development

### Cost Considerations
Typical implementation costs include:
- **Initial Assessment**: R50,000 - R200,000 depending on scope
- **System Implementation**: R100,000 - R500,000 for comprehensive systems
- **Training and Development**: R20,000 - R100,000 per year
- **Ongoing Compliance**: R30,000 - R150,000 annually for monitoring and reporting

### Timeline for Implementation
- **Immediate (0-30 days)**: Assessment and initial planning
- **Short-term (1-6 months)**: System implementation and training
- **Medium-term (6-12 months)**: Full compliance and optimization
- **Long-term (12+ months)**: Continuous improvement and maintenance

### Success Factors
Critical elements for successful implementation:
1. **Leadership Commitment**: Strong support from management and supervisors
2. **Employee Engagement**: Active participation from all levels of personnel
3. **Adequate Resources**: Sufficient funding, equipment, and time allocation
4. **Professional Expertise**: Access to qualified consultants and specialists
5. **Continuous Improvement**: Regular review and enhancement of practices

### Frequently Related Questions
- How often should compliance audits be conducted?
- What are the penalties for non-compliance?
- Which training programs are most effective?
- How can small operations afford comprehensive compliance?

### Additional Resources and Support
#### Professional Organizations
- Mine Health and Safety Council (MHSC)
- South African Institute of Mining and Metallurgy (SAIMM)
- Association of Mine Managers of South Africa (AMMSA)

#### Training and Certification
- Accredited mining training providers
- Professional development programs
- Industry conferences and workshops
- Online learning platforms and resources

#### Regulatory Resources
- Department of Mineral Resources guidance documents
- Industry-specific compliance guidelines
- Regular regulatory updates and communications
- Professional compliance consulting services

## Conclusion
Proper implementation requires careful planning, adequate resources, and ongoing commitment to continuous improvement. Organizations should seek professional guidance for complex implementations and maintain regular communication with regulatory bodies and industry peers.

For specific guidance related to your operation, consult with qualified professionals who understand the unique requirements of your mining environment and regulatory context.`,
      excerpt: `Comprehensive answer to: ${title}. Essential information for mining professionals.`
    },

    event: {
      example: `# ${title}

## Event Overview
Join industry professionals for this comprehensive ${category?.toLowerCase() || 'conference'} focused on advancing mining practices and professional development in ${region || 'the region'}.

## Event Details
- **Date**: [To be announced - typically scheduled for optimal industry participation]
- **Duration**: Multi-day program with comprehensive coverage
- **Location**: Premier venue with modern facilities and accessibility
- **Format**: Hybrid event with in-person and virtual participation options
- **Registration**: Professional rates with early bird discounts available

### Venue Information
- **Accessibility**: Full accessibility for all participants
- **Parking**: Complimentary parking available
- **Technology**: State-of-the-art audio/visual equipment
- **Networking Areas**: Dedicated spaces for professional networking

## Target Audience
This event is designed for:
- **Mining Engineers**: Technical professionals seeking latest industry insights
- **Safety Managers**: Professionals responsible for mine safety and compliance
- **Operations Managers**: Leaders managing mining operations and teams
- **Regulatory Personnel**: Government and compliance professionals
- **Students and Academics**: Those studying or researching mining practices
- **Technology Providers**: Companies offering mining solutions and services

## Program Highlights
### Day 1: Industry Overview and Trends
- Opening keynote: Future of mining in ${region || 'the region'}
- Panel discussion: Regulatory updates and compliance requirements
- Technical sessions: Latest innovations and technology advances
- Networking lunch with industry leaders

### Day 2: Technical Deep Dives
- Specialized workshops on ${category?.toLowerCase() || 'key topics'}
- Case study presentations from successful operations
- Equipment demonstrations and technology showcases
- Professional development sessions

### Day 3: Implementation and Action Planning
- Best practice sharing sessions
- Implementation planning workshops
- Resource development and networking
- Closing ceremony and next steps

## Registration Information
### Registration Categories
- **Professional**: Full access to all sessions and materials
- **Student**: Discounted rate for students and academics  
- **Group**: Special rates for multiple registrations from same organization
- **Virtual**: Online participation option with recorded sessions

### What's Included
- All conference sessions and workshops
- Welcome materials and conference resources
- Refreshments and networking lunches
- Digital access to presentations and recordings
- Professional development certificates
- One year access to online resource library

## Contact Information
### Event Organization
- **Email**: events@hublio.com
- **Phone**: +27 (0)11 XXX-XXXX
- **Website**: www.hublio.com/events
- **Social Media**: @HublioEvents

Register now to secure your place at this essential industry event and invest in your professional development and network expansion.`
    },

    salary: {
      example: `# ${title} - Comprehensive Salary Insights

## Position Overview and Responsibilities
${title} represents a crucial role in modern mining operations, combining technical expertise with leadership responsibilities.

## Comprehensive Salary Analysis

### Entry Level (0-3 years experience)
- **Base Salary Range**: R400,000 - R600,000 annually
- **Additional Benefits**: Standard benefits package
- **Total Compensation**: R480,000 - R720,000 including benefits

### Mid-Level (4-8 years experience)  
- **Base Salary Range**: R600,000 - R900,000 annually
- **Performance Bonuses**: 10-20% of base salary
- **Total Compensation**: R720,000 - R1,080,000 including all benefits

### Senior Level (9-15 years experience)
- **Base Salary Range**: R900,000 - R1,400,000 annually
- **Performance Bonuses**: 15-25% of base salary  
- **Equity Participation**: Potential share options or profit sharing
- **Total Compensation**: R1,080,000 - R1,750,000 including full package

### Executive Level (15+ years experience)
- **Base Salary Range**: R1,400,000 - R2,200,000 annually
- **Executive Bonuses**: 20-40% of base salary
- **Comprehensive Benefits**: Full executive package
- **Total Compensation**: R1,800,000 - R3,000,000+ including all components

## Factors Significantly Affecting Compensation

### Geographic Location Impact
- **Gauteng (Johannesburg/Pretoria)**: +15-25% premium for head office roles
- **Remote Mine Sites**: +20-35% premium plus accommodation allowances
- **International Assignments**: +50-100% premium with expatriate packages

### Industry Sector Variations
- **Platinum Mining**: Premium rates due to technical complexity
- **Gold Mining**: Established sector with competitive traditional packages
- **Coal Mining**: Variable based on market conditions
- **Iron Ore/Bulk Commodities**: Large-scale operations with substantial packages

## Comprehensive Benefits Package Analysis

### Standard Benefits (All Levels)
- **Medical Aid**: 100% employer contribution for employee and family
- **Pension/Provident Fund**: 15-18% of annual salary contribution
- **Group Life Insurance**: 3-4 times annual salary coverage
- **Annual Leave**: 21-30 days plus public holidays

### Executive Level Comprehensive Package
- **Company Vehicle**: Full maintenance and fuel allowance
- **Share Options**: Equity participation in company performance
- **International Experience**: Funded overseas assignments and development

## Market Trends and Future Outlook
- **Expected Annual Increases**: 6-10% above inflation for skilled professionals
- **Skills Premium**: Increasing demand for digital and sustainability expertise
- **Leadership Shortage**: Premium for experienced managers and executives

This comprehensive salary guide reflects current market conditions and should be used as a reference for career planning and compensation discussions.

*Data compiled from industry surveys, recruitment firms, and market analysis.*`,
      excerpt: `Comprehensive salary insights for ${title} positions in the mining industry. Market data and career guidance for professionals.`
    }
  }

  const template = templates[type] || templates.blog
  
  return {
    content: template.example,
    excerpt: template.excerpt || `Professional content about ${title.toLowerCase()}.`,
    suggestions: [
      'Review content for accuracy and relevance to your specific context',
      'Consider adding company-specific examples or case studies',
      'Include relevant statistics, references, or regulatory citations',
      'Customize language and tone for your target audience',
      'Add internal links to related content where appropriate',
      'Consider visual elements like charts, images, or infographics'
    ]
  }
}
