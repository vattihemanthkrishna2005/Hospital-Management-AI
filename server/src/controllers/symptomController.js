const { allQuery } = require('../config/db');
const Groq = require('groq-sdk');

// Initialize Groq client conditionally if API key exists
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_GROQ_API_KEY')) {
    return new Groq({ apiKey });
  }
  return null;
};

// Fallback rule taxonomy for local offline evaluation
const symptomRules = [
  {
    department: 'Cardiology',
    keywords: ['chest pain', 'heart', 'palpitations', 'blood pressure', 'hypertension', 'shortness of breath', 'angina', 'cardiac', 'pulse'],
    advice: 'Cardiology consultation recommended for cardiovascular evaluation.'
  },
  {
    department: 'Neurology',
    keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'tingling', 'brain', 'memory loss', 'paralysis', 'vertigo'],
    advice: 'Neurological evaluation suggested for brain, spinal, and nerve-related symptoms.'
  },
  {
    department: 'Pediatrics',
    keywords: ['child', 'infant', 'baby', 'toddler', 'pediatric', 'vaccination', 'growth', 'childhood fever'],
    advice: 'Pediatric care recommended for children & adolescent health needs.'
  },
  {
    department: 'Orthopedics',
    keywords: ['bone', 'joint', 'fracture', 'knee pain', 'back pain', 'spine', 'shoulder', 'muscle', 'sprain', 'arthritis'],
    advice: 'Orthopedic consultation suggested for bone, joint, or musculoskeletal issues.'
  },
  {
    department: 'Dermatology',
    keywords: ['skin', 'rash', 'acne', 'itching', 'eczema', 'hair loss', 'psoriasis', 'mole', 'allergy', 'hives'],
    advice: 'Dermatological assessment recommended for skin, hair, and cosmetic concerns.'
  },
  {
    department: 'General Medicine',
    keywords: ['fever', 'cough', 'cold', 'fatigue', 'stomach ache', 'vomiting', 'flu', 'weakness', 'diarrhea', 'infection', 'body ache'],
    advice: 'General Physician consultation advised for primary medical checkup and diagnosis.'
  }
];

exports.matchSymptoms = async (req, res) => {
  try {
    const { text, lowPowerMode } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Symptom description is required.' });
    }

    const lowerText = text.toLowerCase();
    
    // Check emergency red flags (0ms local safety filter)
    const emergencyKeywords = ['severe chest pain', 'unconscious', 'stroke', 'heavy bleeding', 'unable to breathe', 'heart attack', 'cardiac arrest'];
    const isEmergency = emergencyKeywords.some(keyword => lowerText.includes(keyword));

    const groq = getGroqClient();
    
    // Force Low Power Mode (llama-3.1-8b-instant) to save tokens & avoid deep reasoning burn
    const selectedModel = 'llama-3.1-8b-instant';

    let resultData = null;
    let engineUsed = 'Local Rule Engine';

    if (groq) {
      try {
        const systemPrompt = `You are a fast medical triage classifier.
DO NOT engage in long reasoning or step-by-step thinking.
Classify symptoms directly into ONE department:
[Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine]

Return ONLY valid JSON matching this format:
{
  "matchedDepartment": "Department Name",
  "confidenceScore": integer 70-95,
  "matchedKeywords": ["keyword1", "keyword2"],
  "advice": "1 short sentence of advice"
}`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Symptoms: "${text}"` }
          ],
          model: selectedModel,
          temperature: 0.0,
          max_tokens: 120,
          response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
          resultData = JSON.parse(content);
          engineUsed = `Groq AI (llama-3.1-8b-instant - ⚡ Low Power Mode)`;
        }
      } catch (aiErr) {
        console.warn('⚠️ Groq AI request failed, falling back to local taxonomy:', aiErr.message);
      }
    }

    // Fallback engine if Groq AI not available or failed
    if (!resultData) {
      const matches = [];
      for (const rule of symptomRules) {
        const foundKeywords = rule.keywords.filter(keyword => lowerText.includes(keyword));
        if (foundKeywords.length > 0) {
          matches.push({
            department: rule.department,
            score: foundKeywords.length * 25,
            matchedKeywords: foundKeywords,
            advice: rule.advice
          });
        }
      }
      matches.sort((a, b) => b.score - a.score);

      const primaryDepartment = matches.length > 0 ? matches[0].department : 'General Medicine';
      const primaryAdvice = matches.length > 0 ? matches[0].advice : 'Consult a General Physician for comprehensive health assessment.';

      resultData = {
        matchedDepartment: primaryDepartment,
        confidenceScore: matches.length > 0 ? Math.min(100, matches[0].score + 40) : 70,
        matchedKeywords: matches.length > 0 ? matches[0].matchedKeywords : [],
        advice: primaryAdvice
      };
    }

    // Fetch recommended doctors matching the target department
    const recommendedDoctors = await allQuery(
      'SELECT * FROM doctors WHERE specialization_name = ? ORDER BY rating DESC',
      [resultData.matchedDepartment]
    );

    res.json({
      matchedDepartment: resultData.matchedDepartment,
      confidenceScore: resultData.confidenceScore || 85,
      matchedKeywords: resultData.matchedKeywords || [],
      advice: resultData.advice,
      isEmergency,
      emergencyWarning: isEmergency ? '🚨 Red Flag Detected: If this is an emergency, please visit the nearest ER or dial 911 immediately!' : null,
      engineUsed,
      modelUsed: selectedModel,
      isLowPowerMode: isLowPower,
      recommendedDoctors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

