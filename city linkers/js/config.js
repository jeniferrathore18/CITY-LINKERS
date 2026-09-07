// API Configuration
export const config = {
  GEMINI_API_KEY: 'AIzaSyBOv2TheafgHvh5O1iEyhIWDXyck-HRD2k',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
}

// Gemini API helper
export async function queryGemini(prompt) {
  try {
    const response = await fetch(`${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    })
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  } catch (error) {
    console.error('Gemini API error:', error)
    return null
  }
}
