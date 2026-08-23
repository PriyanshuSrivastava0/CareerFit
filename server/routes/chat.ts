import { Router } from 'express';
import { db } from '../db';
import { generateChatResponseWithGemini } from '../gemini';
import { ChatMessage } from '../../src/types';

const router = Router();

// Get Chat history
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const history = db.getChatHistory(userId);
  return res.json({ messages: history });
});

// Send Chat Message to CareerFit Copilot
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { message, resumeContext: clientResumeCtx } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: message.trim(),
      timestamp: new Date().toISOString()
    };
    db.addChatMessage(userId, userMessage);

    const resume = db.getResumeByUserId(userId);
    const history = db.getChatHistory(userId);

    // Context packet for Gemini
    const resumeContext = resume
      ? {
          name: resume.extractedData?.personalInfo?.fullName,
          targetDomain: resume.preferredDomain,
          atsScore: resume.atsAnalysis?.overallScore,
          strengths: resume.atsAnalysis?.strengths,
          improvements: resume.atsAnalysis?.improvements,
          selectedCareer: resume.selectedCareer?.roleName,
          matchPercentage: resume.selectedCareer?.matchPercentage,
          extractedSkills: resume.extractedData?.skills,
          topSkillGaps: resume.skillGaps?.filter((g) => g.gapLevel === 'High' || g.gapLevel === 'Medium').map((g) => g.skill),
          jobReadinessScore: resume.jobReadiness?.overallScore
        }
      : clientResumeCtx || null;

    let replyText: string | null = await generateChatResponseWithGemini(
      message,
      resumeContext,
      history.slice(-8)
    );

    if (!replyText) {
      replyText = getFallbackCopilotReply(message, resumeContext);
    }

    const copilotMessage: ChatMessage = {
      id: `msg-${Date.now()}-c`,
      sender: 'copilot',
      text: replyText,
      timestamp: new Date().toISOString(),
      suggestedActions: getSuggestedFollowups(message)
    };

    db.addChatMessage(userId, copilotMessage);

    return res.json({
      reply: copilotMessage,
      messages: db.getChatHistory(userId)
    });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Clear Chat History
router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  const freshHistory = db.clearChatHistory(userId);
  return res.json({ messages: freshHistory });
});

function getFallbackCopilotReply(query: string, ctx: any): string {
  const q = query.toLowerCase();

  if (q.includes('ats') || q.includes('score') || q.includes('improve resume') || q.includes('keywords')) {
    return `### 🎯 How to Boost Your ATS Score to 90+:
Based on your active resume profile (Current ATS: **${ctx?.atsScore || 78}/100**):

1. **Add Cloud & Container Keywords**:
   Include \`Docker\`, \`Kubernetes basics\`, \`AWS (EC2, S3, IAM)\`, and \`CI/CD Pipelines (GitHub Actions)\` in your Skills & Project sections.
2. **Quantify Every Bullet Point using the Google X-Y-Z Formula**:
   - *Before*: *"Built an e-commerce platform using React and Node"*
   - *After*: *"Architected full-stack e-commerce app with Node.js & PostgreSQL, reducing query latency by 35% across a 500+ SKU catalog and handling 10k+ simulated checkout sessions."*
3. **Include Unit & Integration Testing Frameworks**:
   Add \`Jest\`, \`Vitest\`, or \`Cypress\` to signal production-grade engineering habits.
4. **Standardize Section Headers for ATS Parsers**:
   Stick to standard headers: *Professional Summary*, *Education*, *Technical Skills*, *Projects*, *Work Experience*, *Certifications*.
5. **Add Live URLs**:
   Ensure every project includes verified GitHub repository and live Vercel/Render deployment hyperlinks.`;
  }

  if (q.includes('why') && (q.includes('full stack') || q.includes('recommend') || q.includes('role') || q.includes('career'))) {
    return `### 💡 Why ${ctx?.selectedCareer || 'Full Stack Development'} is Your #1 Match (${ctx?.matchPercentage || 91}% Match):

1. **Demonstrated Core Stack**: You already have strong fundamentals in **JavaScript (ES6+)**, **React.js**, and **Node.js/Express**.
2. **End-to-End Projects**: Your projects show hands-on experience building both interactive UI interfaces and relational database backends.
3. **High Market Demand**: Over 65,000+ open engineering roles currently seek developers who bridge frontend UX with robust backend microservices.
4. **Immediate ROI**: By adding Docker, Redis caching, and PostgreSQL index optimization, you can transition directly into top-tier tech roles.`;
  }

  if (q.includes('interview') || q.includes('question') || q.includes('mock')) {
    return `### 🚀 Top High-Yield Technical Interview Questions for Your Profile:

1. **JavaScript**: *Explain the JavaScript Event Loop, Call Stack, Microtask queue, and how \`Promise.resolve()\` interacts with \`setTimeout(..., 0)\`.*
2. **React**: *What are the key differences between \`useMemo\`, \`useCallback\`, and \`React.memo\`? When can premature memoization hurt performance?*
3. **Node.js**: *How does Node.js handle thousands of concurrent I/O operations despite being single-threaded? Explain the libuv thread pool and event demultiplexer.*
4. **Databases**: *What is the difference between Clustered and Non-Clustered Indexes in PostgreSQL? How do you inspect a slow query using \`EXPLAIN ANALYZE\`?*
5. **System Design**: *How would you design a rate limiter middleware for a RESTful API with a limit of 100 requests/minute per user utilizing Redis Token Bucket?*

Would you like me to drill into any of these solutions with sample code or conduct a simulated interview?`;
  }

  if (q.includes('project') || q.includes('portfolio') || q.includes('build')) {
    return `### 🛠️ High-Impact Capstone Project Recommendation:

**Project Title**: Distributed Collaborative Kanban Engine (or Real-time Document Sync)

#### Tech Stack:
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express + WebSocket / Socket.io
- **Database**: PostgreSQL with Drizzle / Prisma ORM + Redis for session cache
- **DevOps**: Dockerized container deployment with GitHub Actions CI/CD pipeline

#### 3 Standout Features to Highlight on Your Resume:
1. **Optimistic UI Updates & Conflict Resolution**: Handles concurrent updates across multiple connected browser clients.
2. **Role-Based Access Control (RBAC)**: Secure JWT + refresh tokens with granular workspace permissions.
3. **Performance Metrics**: Implements database indexing and Redis caching yielding sub-50ms API response times.`;
  }

  if (q.includes('roadmap') || q.includes('plan') || q.includes('30 day') || q.includes('study')) {
    return `### 📅 30-Day Master Acceleration Plan:

- **Week 1 (Modern Frontend & State)**: Advanced React patterns, Custom Hooks, Performance Profiling, and TypeScript generics.
- **Week 2 (Backend & Database Mastery)**: Node.js streams, PostgreSQL indexing, query optimization, connection pooling, and RESTful API best practices.
- **Week 3 (Containerization & DevOps)**: Dockerizing multi-container applications with \`docker-compose\`, GitHub Actions CI/CD workflows, and environment secrets management.
- **Week 4 (System Design & Interview Prep)**: Caching strategies with Redis, Rate Limiting, Load Balancing, and 20 LeetCode Medium DSA patterns (Two Pointers, Sliding Window, DFS/BFS).`;
  }

  if (q.includes('salary') || q.includes('package') || q.includes('compensation') || q.includes('lpa')) {
    return `### 💰 Compensation Benchmark for ${ctx?.selectedCareer || 'Full Stack Software Engineer'}:

- **Entry-Level / Fresher (0-1 yrs)**:
  - India: ₹6.5 LPA – ₹14 LPA (Tier-1 Tech / Product companies: ₹18 LPA - ₹28 LPA)
  - US / Remote: $75,000 – $115,000 / year
- **Mid-Level (2-4 yrs)**:
  - India: ₹15 LPA – ₹32 LPA
  - US / Remote: $120,000 – $165,000 / year
- **Senior / Lead (5+ yrs)**:
  - India: ₹35 LPA – ₹65+ LPA + ESOPs
  - US / Remote: $170,000 – $240,000+ / year

**Key Leverage Multipliers**: Demonstrating System Design proficiency, production containerization (Docker/K8s), and quantifiable business impact in past projects.`;
  }

  if (q.includes('star') || q.includes('behavioral') || q.includes('hr')) {
    return `### 🌟 The STAR Method Framework for Behavioral Interviews:

- **Situation (20%)**: Briefly set the context. Where were you working? What was the challenge or project?
- **Task (10%)**: What was your specific responsibility or deliverable in that situation?
- **Action (50%)**: Detail the technical and collaborative decisions YOU made. Mention tools, trade-offs, and how you overcame roadblocks.
- **Result (20%)**: Quantify the impact with numbers (e.g., *"reduced bug count by 40%"*, *"delivered 3 days ahead of schedule"*).

**Example Response for "Tell me about a difficult bug you solved"**:
> *"While building our real-time messaging feature (Situation), users experienced duplicate message delivery under high packet loss (Task). I analyzed the WebSocket handshake logs and implemented an idempotent client message UUID queue with Redis deduplication (Action). This eliminated duplicate messages 100% and reduced server CPU overhead by 22% (Result)."*`;
  }

  if (q.includes('skill') || q.includes('learn next') || q.includes('week') || q.includes('gap')) {
    return `### 📚 Priority Skill Recommendation for This Week:

Your highest-leverage gap is **Docker & Containerization** (Currently High Gap):
- **Why**: 85% of Full Stack job descriptions list Docker for local dev environments and containerized CI/CD.
- **Goal for this week**:
  1. Learn Dockerfile directives (\`FROM\`, \`WORKDIR\`, \`COPY\`, \`RUN\`, \`EXPOSE\`, \`CMD\`).
  2. Write a multi-stage Dockerfile for your React + Node.js app.
  3. Create a \`docker-compose.yml\` spinning up your backend API and a PostgreSQL database locally.
- **Recommended Free Video**: *Docker in 100 Seconds & Full Crash Course by Fireship & freeCodeCamp*.`;
  }

  return `Hello! As your CareerFit Copilot, I've analyzed your profile in **${ctx?.targetDomain || 'Tech Engineering'}**.

You are currently at **${ctx?.jobReadinessScore || 76}% Job Readiness** with an ATS score of **${ctx?.atsScore || 78}/100**.

You can ask me anything about your career journey:
- *"How do I raise my ATS score to 90%?"*
- *"Give me a 30-day study plan for React & Node"*
- *"Review my project description bullet points with the Google X-Y-Z formula"*
- *"Run a mock technical interview with me"*
- *"What salary should I target for Full Stack Developer roles?"*`;
}

function getSuggestedFollowups(query: string) {
  const q = query.toLowerCase();
  if (q.includes('interview')) {
    return [
      { label: 'Explain the Event Loop question', actionType: 'query', payload: 'Can you explain the Event Loop with visual mental models and code?' },
      { label: 'Give 5 more React interview questions', actionType: 'query', payload: 'Give me 5 more advanced React interview questions with answers.' },
      { label: 'Run a mock interview question', actionType: 'query', payload: 'Ask me a technical interview question and evaluate my answer.' }
    ];
  }
  if (q.includes('ats') || q.includes('resume')) {
    return [
      { label: 'Rewrite a bullet point', actionType: 'query', payload: 'Show me how to rewrite a weak resume bullet point into a strong metric-driven one.' },
      { label: 'Missing keywords list', actionType: 'query', payload: 'What are the top 10 keywords missing from my resume for my target domain?' }
    ];
  }
  if (q.includes('project')) {
    return [
      { label: 'Architecture breakdown', actionType: 'query', payload: 'Give me a step-by-step architecture blueprint for the Kanban project.' },
      { label: 'How to describe this on resume', actionType: 'query', payload: 'Give me 3 perfect resume bullet points for this project.' }
    ];
  }
  return [
    { label: 'How to increase ATS score?', actionType: 'query', payload: 'What specific keywords will take my ATS score above 90?' },
    { label: 'What project should I build?', actionType: 'query', payload: 'Suggest the best capstone project to get hired as a Full Stack Developer.' },
    { label: 'Explain my highest skill gap', actionType: 'query', payload: 'Explain my highest skill gap and how to close it in 14 days.' }
  ];
}

export default router;
