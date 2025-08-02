// Test the improved AI system with various questions

const testQuestions = [
  // Safety question that should be answered
  "What PPE is required for underground mining?",
  
  // Safety question that might require escalation
  "What is the specific ventilation requirement for methane levels in platinum mines at depths below 2000 meters?",
  
  // General question that should be answered
  "What services does Hublio offer?",
  
  // Complex technical question that should escalate
  "What are the exact chemical compositions required for flotation reagents in complex sulfide ore processing for maximizing platinum group metal recovery?",
  
  // Basic safety question
  "What should I do in a mining emergency?"
]

async function testAI() {
  console.log("🤖 Testing Enhanced AI System\n")
  
  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i]
    console.log(`\n📝 Question ${i + 1}: ${question}`)
    console.log("─".repeat(80))
    
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          sessionId: `test-session-${Date.now()}-${i}`,
          currentPage: '/test'
        })
      })
      
      const data = await response.json()
      
      console.log(`\n🤖 Response:`)
      console.log(data.response)
      
      if (data.metadata?.intent === 'admin_escalation') {
        console.log(`\n🚨 ESCALATED TO ADMIN`)
        console.log(`Original Question: ${data.metadata.originalQuestion}`)
        console.log(`Escalation Type: ${data.metadata.escalationType}`)
      }
      
      console.log(`\n📊 Metadata:`)
      console.log(JSON.stringify(data.metadata, null, 2))
      
    } catch (error) {
      console.error(`❌ Error testing question ${i + 1}:`, error)
    }
    
    console.log("\n" + "=".repeat(80))
  }
}

// Run the test if this file is executed directly
if (typeof process !== 'undefined') {
  testAI().catch(console.error)
}

export { testAI }
