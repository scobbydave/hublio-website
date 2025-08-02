import { NextRequest, NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

// Safety FAQ data to populate the knowledge base
const SAFETY_FAQS = [
  {
    question: "What PPE is required for underground mining operations?",
    answer: "Essential PPE for underground mining includes: hard hat/helmet (mandatory), safety boots with steel toes and puncture-resistant soles, high-visibility clothing, self-rescue breathing apparatus, eye protection (safety glasses), hearing protection in high-noise areas, and appropriate respiratory protection when dealing with dust or chemicals. All PPE must meet South African mining standards.",
    category: "safety",
    priority: 1
  },
  {
    question: "What are the emergency procedures for a mine accident?",
    answer: "Emergency procedures: 1) Ensure personal safety first, 2) Alert others in immediate area, 3) Contact mine rescue services immediately, 4) Follow established evacuation routes to assembly points, 5) Use emergency communication systems, 6) Provide first aid if trained and safe to do so, 7) Report incident to mine management within 24 hours. Never re-enter hazardous areas until cleared by safety officials.",
    category: "safety",
    priority: 1
  },
  {
    question: "What training is required under the Mine Health and Safety Act?",
    answer: "Required training includes: certificate of fitness for specific work category, induction training for new employees, ongoing competency assessments, risk assessment training, emergency procedures training, equipment-specific training, and regular safety refresher courses. Training records must be maintained and updated according to MHSA regulations.",
    category: "safety",
    priority: 1
  },
  {
    question: "How do you identify and manage atmospheric hazards in mines?",
    answer: "Atmospheric hazard management: Use continuous gas monitoring equipment, maintain proper ventilation systems, test air quality regularly, monitor for methane, carbon monoxide, and oxygen levels, ensure adequate air flow in all work areas, use portable gas detectors, establish gas testing protocols before entering areas, and have emergency evacuation procedures for gas emergencies.",
    category: "safety",
    priority: 1
  },
  {
    question: "What are the lockout/tagout procedures for mining equipment?",
    answer: "Lockout/tagout procedures: 1) Notify affected workers, 2) Shut down equipment properly, 3) Isolate energy sources (electrical, hydraulic, pneumatic), 4) Apply lockout devices, 5) Attach personal tags with worker identification, 6) Test equipment to ensure it cannot start, 7) Only the person who applied the lock can remove it, 8) Verify safe restart procedures before removing locks.",
    category: "safety",
    priority: 1
  },
  {
    question: "What are the ground stability assessment requirements?",
    answer: "Ground stability assessment requires: visual inspection by qualified personnel, geotechnical monitoring systems, regular rock mass classification, support system installation and maintenance, continuous monitoring of ground movement, immediate reporting of ground instability signs, emergency support procedures, and qualified personnel conducting assessments before any work begins in the area.",
    category: "safety",
    priority: 1
  }
]

export async function POST(request: NextRequest) {
  try {
    const client = sanityClient
    
    if (!client) {
      return NextResponse.json(
        { error: "Sanity client not available" },
        { status: 500 }
      )
    }

    console.log("Populating safety FAQs...")

    const results = []
    for (const faq of SAFETY_FAQS) {
      try {
        const result = await client.create({
          _type: 'faq',
          ...faq,
          aiGenerated: true,
          approved: true,
          createdAt: new Date().toISOString(),
        })
        results.push(result)
        console.log(`Created FAQ: ${faq.question}`)
      } catch (error) {
        console.error(`Failed to create FAQ: ${faq.question}`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${results.length} safety FAQs`,
      createdFAQs: results.length
    })

  } catch (error) {
    console.error("Error populating safety FAQs:", error)
    return NextResponse.json(
      { error: "Failed to populate safety FAQs" },
      { status: 500 }
    )
  }
}
