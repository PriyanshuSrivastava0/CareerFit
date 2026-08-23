import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY environment variable is not defined. Fallback intelligent heuristic engine will be active.');
    return null;
  }
  try {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiInstance;
  } catch (err) {
    console.error('[Gemini] Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export async function analyzeResumeWithGemini(resumeText: string, preferredDomain?: string) {
  const ai = getGeminiAI();
  if (!ai) {
    return null;
  }

  const prompt = `You are the lead ATS Algorithm Architect and Executive Tech Career Coach at CareerFit AI.
Analyze the following resume text thoroughly.

Resume text:
"""
${resumeText}
"""

${preferredDomain ? `User's target career domain: ${preferredDomain}` : 'User wants top career recommendations based on their background.'}

Provide a comprehensive, highly accurate JSON response conforming strictly to this structure:
{
  "extractedData": {
    "personalInfo": {
      "fullName": string,
      "email": string,
      "phone": string,
      "location": string,
      "linkedin": string,
      "github": string,
      "portfolio": string
    },
    "education": [
      {
        "degree": string,
        "institution": string,
        "graduationYear": string,
        "cgpaOrPercentage": string,
        "relevantCoursework": string[]
      }
    ],
    "skills": {
      "technical": string[],
      "soft": string[],
      "tools": string[],
      "languages": string[],
      "frameworks": string[],
      "databases": string[]
    },
    "experience": [
      {
        "id": string,
        "company": string,
        "role": string,
        "duration": string,
        "responsibilities": string[],
        "achievements": string[]
      }
    ],
    "projects": [
      {
        "id": string,
        "name": string,
        "technologies": string[],
        "description": string,
        "impact": string
      }
    ],
    "summary": string
  },
  "atsAnalysis": {
    "overallScore": number (0-100),
    "rating": "Needs Work" | "Fair" | "Good" | "Strong" | "Exceptional",
    "categoryBreakdown": {
      "keywordOptimization": { "name": "Keyword Optimization", "score": number, "maxScore": 100, "weight": 15, "feedback": string },
      "skillsRelevance": { "name": "Skills Relevance", "score": number, "maxScore": 100, "weight": 15, "feedback": string },
      "resumeStructure": { "name": "Resume Structure", "score": number, "maxScore": 100, "weight": 10, "feedback": string },
      "experienceImpact": { "name": "Experience & Impact", "score": number, "maxScore": 100, "weight": 15, "feedback": string },
      "educationClarity": { "name": "Education Clarity", "score": number, "maxScore": 100, "weight": 10, "feedback": string },
      "projectsEvaluation": { "name": "Projects Depth", "score": number, "maxScore": 100, "weight": 15, "feedback": string },
      "formattingAndLayout": { "name": "ATS Formatting", "score": number, "maxScore": 100, "weight": 10, "feedback": string },
      "measurableAchievements": { "name": "Measurable Metrics", "score": number, "maxScore": 100, "weight": 5, "feedback": string },
      "contactCompleteness": { "name": "Contact & Links", "score": number, "maxScore": 100, "weight": 5, "feedback": string }
    },
    "strengths": string[],
    "improvements": string[],
    "actionableTips": string[],
    "missingCrucialKeywords": string[]
  },
  "careerRecommendations": [
    {
      "id": string,
      "roleName": string,
      "matchPercentage": number (0-100),
      "readinessLevel": "High" | "Medium" | "Foundational",
      "shortDescription": string,
      "whyMatches": string[],
      "requiredSkills": string[],
      "existingSkills": string[],
      "missingSkills": string[],
      "estimatedLearningWeeks": number,
      "averageSalaryRange": string,
      "topCompaniesHiring": string[]
    }
  ]
}

Return ONLY raw JSON with no Markdown wrappers or explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    return JSON.parse(text);
  } catch (err) {
    console.error('[Gemini] Error during resume analysis:', err);
    return null;
  }
}

export async function generateChatResponseWithGemini(
  userQuery: string,
  resumeContext: any,
  chatHistory: { sender: 'user' | 'copilot'; text: string }[]
) {
  const ai = getGeminiAI();
  if (!ai) {
    return null;
  }

  const systemInstruction = `You are CareerFit Copilot 🤖, an expert AI Career Mentor, Resume Strategist, and Tech Interview Coach.
You have access to the user's analyzed resume profile, current ATS score, career matches, skill gaps, and learning roadmap:
${resumeContext ? JSON.stringify(resumeContext, null, 2) : 'No resume uploaded yet.'}

Guidelines:
1. Speak with encouraging, precise, and actionable career guidance.
2. Refer directly to the user's specific skills, projects, and target domain when answering.
3. Keep responses structured with bullet points, code snippets, or clear phase steps when applicable.
4. When asked for interview questions, roadmaps, or resume improvements, give exact, high-impact phrasing with measurable metrics.`;

  try {
    const prompt = `Conversation history:
${chatHistory.map((m) => `${m.sender === 'user' ? 'User' : 'Copilot'}: ${m.text}`).join('\n')}

User message: ${userQuery}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text?.trim() || '';
  } catch (err) {
    console.error('[Gemini] Error during copilot chat generation:', err);
    return null;
  }
}
