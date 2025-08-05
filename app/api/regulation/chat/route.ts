import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

// Fallback responses for common compliance questions
const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('safety') || lowerMessage.includes('health')) {
    return `## Mining Safety Requirements

**Essential Safety Measures:**
- Personal Protective Equipment (PPE) must be worn at all times
- Regular safety training and certification required
- Hazard identification and risk assessment protocols
- Emergency response procedures and evacuation plans
- Equipment inspection and maintenance schedules

**Regulatory Compliance:**
- Comply with Mine Health and Safety Act
- Regular safety audits and inspections
- Incident reporting within 24 hours
- Safety committee establishment
- Worker health monitoring programs

*Note: AI service is temporarily unavailable. For specific safety requirements, consult your local mining authority or safety officer.*`;
  }
  
  if (lowerMessage.includes('environmental') || lowerMessage.includes('water') || lowerMessage.includes('air')) {
    return `## Environmental Compliance

**Key Requirements:**
- Environmental Impact Assessment (EIA) completion
- Water use licenses and monitoring
- Air quality monitoring and reporting
- Waste management and disposal protocols
- Rehabilitation and closure planning

**Monitoring and Reporting:**
- Quarterly environmental monitoring reports
- Water quality testing at discharge points
- Air quality measurements in operational areas
- Soil contamination assessments
- Biodiversity impact evaluations

*Note: AI service is temporarily unavailable. Consult your Environmental Management Programme for specific requirements.*`;
  }
  
  if (lowerMessage.includes('permit') || lowerMessage.includes('license') || lowerMessage.includes('application')) {
    return `## Mining Permits and Licenses

**Required Documentation:**
- Mining right application with work programme
- Environmental authorization
- Water use licenses
- Social and Labour Plan (SLP)
- Financial provision for rehabilitation

**Application Process:**
- Submit applications to DMRE
- Community consultation requirements
- Technical studies and assessments
- Financial guarantees establishment
- Compliance monitoring systems

*Note: AI service is temporarily unavailable. Contact the Department of Mineral Resources and Energy for specific permit requirements.*`;
  }
  
  if (lowerMessage.includes('compliance') || lowerMessage.includes('regulation') || lowerMessage.includes('legal')) {
    return `## Compliance and Regulatory Framework

**Key Legislation:**
- Mineral and Petroleum Resources Development Act (MPRDA)
- Mine Health and Safety Act
- National Environmental Management Act (NEMA)
- National Water Act
- Mining Charter requirements

**Compliance Monitoring:**
- Regular regulatory inspections
- Self-assessment and internal audits
- Incident and non-compliance reporting
- Corrective action implementation
- Continuous improvement processes

*Note: AI service is temporarily unavailable. Consult with legal compliance specialists for detailed guidance.*`;
  }
  
  return `## Mining Compliance Information

I understand you're looking for mining compliance guidance. While our AI service is temporarily unavailable due to high demand, here are some general resources:

**Immediate Assistance:**
- Contact your mining authority representative
- Consult your company's compliance officer
- Review your operational permits and conditions
- Check recent regulatory updates and notices

**Key Compliance Areas:**
- Safety and health requirements
- Environmental impact management
- Permit and license maintenance
- Community engagement obligations
- Financial provisions and guarantees

**Emergency Contacts:**
- Mine Health and Safety Inspectorate
- Department of Mineral Resources and Energy
- Environmental compliance officers
- Emergency response services

*The AI assistant will be back online shortly. Please try again in a few minutes, or contact your compliance team for immediate assistance.*`;
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    try {
      const response = await geminiService.generateComplianceResponse(message);
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString()
      });
    } catch (aiError: any) {
      console.error('Gemini API error:', aiError);
      
      // Check if it's a service overload error
      if (aiError.status === 503 || aiError.message?.includes('overloaded')) {
        const fallbackResponse = getFallbackResponse(message);
        return NextResponse.json({
          response: fallbackResponse,
          timestamp: new Date().toISOString(),
          fallback: true,
          reason: 'AI service temporarily overloaded'
        });
      }
      
      // For other AI errors, still provide fallback
      const fallbackResponse = getFallbackResponse(message);
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        fallback: true,
        reason: 'AI service temporarily unavailable'
      });
    }

  } catch (error: any) {
    console.error('Compliance chat error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
