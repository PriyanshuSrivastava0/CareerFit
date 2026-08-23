import {
  UserProfile,
  LearningResource,
  RecommendedProject,
  CareerRecommendation,
  SkillGapItem,
  CareerRoadmap,
  ExtractedResumeData,
  ATSAnalysisResult,
  JobReadinessReport
} from '../types';

export const INITIAL_CAREER_DOMAINS = [
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'Software Development',
  'Data Science & AI',
  'Data Analytics',
  'AI / Machine Learning',
  'Cybersecurity',
  'Cloud Computing & DevOps',
  'UI/UX Design',
  'Product Management',
  'Mobile App Development (iOS/Android)',
  'Blockchain & Web3',
  'Embedded Systems & IoT',
  'Finance & FinTech'
];

export const INITIAL_SKILLS_TAXONOMY = [
  { id: 'sk-1', name: 'JavaScript (ES6+)', category: 'Languages', difficulty: 'Intermediate', relatedCareers: ['Full Stack Development', 'Frontend Development', 'Backend Development'] },
  { id: 'sk-2', name: 'TypeScript', category: 'Languages', difficulty: 'Intermediate', relatedCareers: ['Full Stack Development', 'Frontend Development', 'Backend Development'] },
  { id: 'sk-3', name: 'React.js', category: 'Frameworks', difficulty: 'Intermediate', relatedCareers: ['Full Stack Development', 'Frontend Development'] },
  { id: 'sk-4', name: 'Node.js & Express', category: 'Frameworks', difficulty: 'Intermediate', relatedCareers: ['Full Stack Development', 'Backend Development'] },
  { id: 'sk-5', name: 'PostgreSQL & SQL', category: 'Databases', difficulty: 'Intermediate', relatedCareers: ['Backend Development', 'Data Analytics', 'Full Stack Development'] },
  { id: 'sk-6', name: 'Python & Pandas', category: 'Languages', difficulty: 'Beginner', relatedCareers: ['Data Science & AI', 'Data Analytics', 'AI / Machine Learning'] },
  { id: 'sk-7', name: 'Machine Learning (Scikit-Learn/TensorFlow)', category: 'Frameworks', difficulty: 'Advanced', relatedCareers: ['Data Science & AI', 'AI / Machine Learning'] },
  { id: 'sk-8', name: 'Docker & Kubernetes', category: 'Tools', difficulty: 'Advanced', relatedCareers: ['Cloud Computing & DevOps', 'Backend Development'] },
  { id: 'sk-9', name: 'AWS Cloud Services', category: 'Tools', difficulty: 'Intermediate', relatedCareers: ['Cloud Computing & DevOps', 'Full Stack Development'] },
  { id: 'sk-10', name: 'Git & GitHub CI/CD', category: 'Tools', difficulty: 'Beginner', relatedCareers: ['All Software Roles'] },
  { id: 'sk-11', name: 'Data Structures & Algorithms', category: 'Core Concepts', difficulty: 'Advanced', relatedCareers: ['Software Development'] },
  { id: 'sk-12', name: 'System Design & REST APIs', category: 'Core Concepts', difficulty: 'Advanced', relatedCareers: ['Backend Development', 'Full Stack Development'] },
  { id: 'sk-13', name: 'Cybersecurity Fundamentals & OWASP', category: 'Core Concepts', difficulty: 'Intermediate', relatedCareers: ['Cybersecurity'] },
  { id: 'sk-14', name: 'Figma & Design Systems', category: 'Tools', difficulty: 'Intermediate', relatedCareers: ['UI/UX Design'] }
];

export const INITIAL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'res-1',
    title: 'React.js Full Course for Beginners (2025/2026)',
    url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    platform: 'YouTube',
    channelOrAuthor: 'freeCodeCamp.org',
    skill: 'React.js',
    careerDomain: 'Full Stack Development',
    difficulty: 'Beginner',
    duration: '11 hours 55 mins',
    description: 'Master modern React from components, JSX, state, props, hooks (useEffect, useMemo, custom hooks), to full API integration.',
    tags: ['React', 'Frontend', 'JavaScript', 'Hooks'],
    rating: 4.9
  },
  {
    id: 'res-2',
    title: 'React Hooks Simplified in 20 Minutes',
    url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
    platform: 'YouTube',
    channelOrAuthor: 'Web Dev Simplified',
    skill: 'React.js',
    careerDomain: 'Frontend Development',
    difficulty: 'Intermediate',
    duration: '22 mins',
    description: 'Learn useState, useEffect, useContext, useRef, and useReducer with visual mental models and practical examples.',
    tags: ['React', 'Hooks', 'WebDevSimplified'],
    rating: 4.8
  },
  {
    id: 'res-3',
    title: 'Node.js and Express.js - Full Course',
    url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
    platform: 'YouTube',
    channelOrAuthor: 'freeCodeCamp.org',
    skill: 'Node.js & Express',
    careerDomain: 'Backend Development',
    difficulty: 'Beginner',
    duration: '8 hours 15 mins',
    description: 'Learn Node.js runtime, event loop, Express middleware, routing, REST API design, and database integration.',
    tags: ['Node.js', 'Express', 'Backend', 'REST'],
    rating: 4.9
  },
  {
    id: 'res-4',
    title: 'SQL Tutorial - Full Database Course for Beginners',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    platform: 'YouTube',
    channelOrAuthor: 'freeCodeCamp.org (Mike Dane)',
    skill: 'PostgreSQL & SQL',
    careerDomain: 'Full Stack Development',
    difficulty: 'Beginner',
    duration: '4 hours 20 mins',
    description: 'Comprehensive SQL course covering schema design, CRUD, joins, subqueries, indexing, constraints, and aggregations.',
    tags: ['SQL', 'Database', 'PostgreSQL', 'Relational'],
    rating: 4.9
  },
  {
    id: 'res-5',
    title: 'TypeScript Full Course for Beginners',
    url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    platform: 'YouTube',
    channelOrAuthor: 'Programming with Mosh',
    skill: 'TypeScript',
    careerDomain: 'Full Stack Development',
    difficulty: 'Intermediate',
    duration: '1 hour 15 mins',
    description: 'Learn static typing, interfaces, generics, union types, type narrowing, and modern TS best practices.',
    tags: ['TypeScript', 'JavaScript', 'Mosh'],
    rating: 4.9
  },
  {
    id: 'res-6',
    title: 'Docker in 100 Seconds & Full Beginner Crash Course',
    url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE',
    platform: 'YouTube',
    channelOrAuthor: 'Fireship',
    skill: 'Docker & Kubernetes',
    careerDomain: 'Cloud Computing & DevOps',
    difficulty: 'Intermediate',
    duration: '15 mins',
    description: 'Containers vs VMs, Dockerfile anatomy, image layers, port binding, volumes, and multi-stage container builds.',
    tags: ['Docker', 'DevOps', 'Containers', 'Fireship'],
    rating: 4.9
  },
  {
    id: 'res-7',
    title: 'Python for Beginners - Full Course [Programming Tutorial]',
    url: 'https://www.youtube.com/watch?v=eWRfhZUzrAc',
    platform: 'YouTube',
    channelOrAuthor: 'Programming with Mosh',
    skill: 'Python & Pandas',
    careerDomain: 'Data Science & AI',
    difficulty: 'Beginner',
    duration: '6 hours 14 mins',
    description: 'Learn Python programming language fundamentals, data structures, loops, functions, OOP, and data analysis packages.',
    tags: ['Python', 'DataScience', 'Beginner'],
    rating: 4.8
  },
  {
    id: 'res-8',
    title: 'System Design for Beginners Course',
    url: 'https://www.youtube.com/watch?v=m8Icp_Cid5o',
    platform: 'YouTube',
    channelOrAuthor: 'freeCodeCamp.org',
    skill: 'System Design & REST APIs',
    careerDomain: 'Backend Development',
    difficulty: 'Advanced',
    duration: '1 hour 45 mins',
    description: 'Understand horizontal vs vertical scaling, load balancers, caching strategies (Redis), CDN, database sharding, and CAP theorem.',
    tags: ['System Design', 'Architecture', 'Scaling'],
    rating: 4.9
  }
];

export const INITIAL_PROJECT_RECOMMENDATIONS: RecommendedProject[] = [
  {
    id: 'proj-1',
    title: 'AI Resume & Career Fit Analyzer (Full Stack SaaS)',
    description: 'Build an end-to-end web platform that extracts text from resumes, scores ATS metrics, computes vector skill matches, and generates personalized roadmap plans.',
    difficulty: 'Intermediate',
    techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Gemini API', 'PostgreSQL'],
    skillsGained: ['Full-stack integration', 'RESTful API creation', 'LLM prompt engineering', 'JWT Auth', 'State Management'],
    estimatedHours: 25,
    architectureSteps: [
      'Set up Express REST backend with auth middleware and file upload handler',
      'Integrate AI model to parse JSON resume schema and score ATS metrics',
      'Build React frontend with responsive dashboard, radar charts, and interactive task checklist',
      'Implement PostgreSQL / in-memory store for user progress tracking and notes'
    ],
    portfolioHighlights: [
      'Demonstrates real-world AI pipeline integration with production UI',
      'Full CRUD with role-based access control and responsive UX',
      'Live demo deployed with interactive analytics'
    ]
  },
  {
    id: 'proj-2',
    title: 'Collaborative E-Commerce Store with Real-time Cart',
    description: 'Create an online storefront with product catalogs, faceted search/filtering, shopping cart persistence, payment checkout simulation, and order status tracking.',
    difficulty: 'Intermediate',
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API / Mock', 'Tailwind'],
    skillsGained: ['Database schema design', 'Transaction handling', 'Component modularity', 'Form validation', 'Secure API proxies'],
    estimatedHours: 30,
    architectureSteps: [
      'Design relational schema for Users, Products, Categories, Orders, OrderItems',
      'Implement backend pagination, sorting, and full-text search',
      'Create responsive cart context with localStorage synchronization',
      'Build admin panel for managing inventory and order fulfillment'
    ],
    portfolioHighlights: [
      'Proves ability to architect transactional business logic',
      'Clean state management without extraneous re-renders'
    ]
  },
  {
    id: 'proj-3',
    title: 'DevOps Automated CI/CD Pipeline & Cloud Monitoring Hub',
    description: 'Deploy a microservices stack using Docker containers, GitHub Actions automated test/lint pipeline, and Grafana/Prometheus health metrics monitoring.',
    difficulty: 'Advanced',
    techStack: ['Docker', 'GitHub Actions', 'AWS / Cloud Run', 'Nginx', 'TypeScript'],
    skillsGained: ['Containerization', 'CI/CD pipeline automation', 'Cloud deployment', 'Infrastructure monitoring'],
    estimatedHours: 20,
    architectureSteps: [
      'Write multi-stage Dockerfiles for frontend SPA and backend service',
      'Configure GitHub Actions workflow for automated testing and container build',
      'Set up reverse proxy with Nginx and SSL termination',
      'Deploy to cloud container service with environment secret injection'
    ],
    portfolioHighlights: [
      'Demonstrates modern engineering deployment discipline',
      'Automated testing integration with green status badges'
    ]
  }
];

export const SAMPLE_RESUMES = [
  {
    id: 'sample-fullstack',
    label: 'Priyanshu Kumar — Full Stack Developer (College Grad / Fresher)',
    fileName: 'Priyanshu_Kumar_FullStack_Resume.pdf',
    domain: 'Full Stack Development',
    rawText: `PRIYANSHU KUMAR
Email: priyanshukumar09430056@gmail.com | Phone: +91 98765 43210
Location: Bengaluru, India | LinkedIn: linkedin.com/in/priyanshu-dev | GitHub: github.com/priyanshu-code
Portfolio: priyanshu-portfolio.dev

PROFESSIONAL SUMMARY
Motivated and detail-oriented Computer Science graduate with hands-on experience building full-stack web applications using React.js, JavaScript (ES6+), Node.js, Express, and PostgreSQL. Passionate about creating responsive, accessible user interfaces and scalable RESTful backends.

EDUCATION
Bachelor of Technology (B.Tech) in Computer Science & Engineering
National Institute of Technology (NIT) | Graduation: 2025 | CGPA: 8.6/10
Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Web Technologies, Operating Systems, Computer Networks.

TECHNICAL SKILLS
- Programming Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python, C++
- Frameworks & Libraries: React.js, Node.js, Express.js, Tailwind CSS, Bootstrap
- Databases: PostgreSQL, MongoDB, MySQL
- Tools & Platforms: Git, GitHub, VS Code, Postman, Vercel, Vite, Docker (Basics)
- Core Concepts: REST APIs, State Management, Responsive Web Design, Agile Development

PROJECTS
1. CareerFit AI - Resume & Career Readiness Platform (React, Node.js, Express, Tailwind, AI)
- Designed and engineered a full-stack career platform analyzing user resumes against ATS criteria.
- Implemented real-time score breakdown across 9 dimensions, achieving 90%+ parsing accuracy.
- Built interactive learning roadmap allowing users to track skill progression and practice tasks.

2. ShopFlow - Full Stack E-Commerce Web Application (React, Node.js, PostgreSQL, Stripe)
- Created responsive e-commerce web application with product search, filtering, and persistent cart.
- Integrated secure JWT authentication and simulated Stripe checkout pipeline.
- Reduced initial page load time by 35% through code splitting and asset optimization.

3. DevCommunity - Developer Knowledge Sharing Hub (JavaScript, Express, MongoDB)
- Developed discussion forum enabling markdown code snippet sharing, upvoting, and commenting.
- Implemented RESTful APIs with input sanitization and rate limiting.

EXPERIENCE & INTERNSHIPS
Software Engineering Intern | TechNova Solutions (Bengaluru, India) | June 2024 – August 2024
- Built reusable UI components in React and Tailwind CSS, reducing team development cycle by 20%.
- Collaborated with senior engineers to optimize backend database queries, improving API latency by 18%.
- Wrote comprehensive unit tests and participated in daily Agile standups and code reviews.

ACHIEVEMENTS & CERTIFICATIONS
- 1st Place Winner - Inter-College Hackathon 2024 (Team of 4)
- HackerRank 5-Star Gold Badge in Problem Solving (Data Structures & Algorithms)
- Meta Frontend Developer Professional Certificate (Coursera)`
  },
  {
    id: 'sample-datascience',
    label: 'Ananya Sharma — Data Science & ML Aspirant',
    fileName: 'Ananya_Sharma_DataScience_Resume.pdf',
    domain: 'Data Science & AI',
    rawText: `ANANYA SHARMA
Email: ananya.sharma@example.com | Phone: +91 91234 56789
Location: New Delhi, India | LinkedIn: linkedin.com/in/ananya-ds | GitHub: github.com/ananya-data

SUMMARY
Enthusiastic Data Science graduate with strong analytical foundations in Python, Pandas, Scikit-Learn, SQL, and Data Visualization (Matplotlib, Seaborn, Tableau). Experienced in developing predictive machine learning models and conducting Exploratory Data Analysis.

EDUCATION
B.Sc in Statistics and Data Science | Delhi University (2024) | 8.8 CGPA

SKILLS
- Languages: Python, SQL, R, Bash
- Libraries: Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn, TensorFlow (Basics)
- Tools: Jupyter Notebooks, Tableau, Git, PowerBI
- Concepts: Statistical Modeling, Regression, Classification, Clustering, Feature Engineering

PROJECTS
1. Customer Churn Prediction Model (Python, Scikit-Learn, Pandas)
- Built XGBoost classification model predicting customer churn with 87% ROC-AUC accuracy.
2. Market Basket & Sales Analytics Dashboard (Tableau, SQL, Python)
- Analyzed 50,000+ retail transactions to extract high-frequency product association rules.`
  },
  {
    id: 'sample-cybersecurity',
    label: 'Rohan Mehta — Cybersecurity & Network Analyst',
    fileName: 'Rohan_Mehta_Cybersecurity_Resume.pdf',
    domain: 'Cybersecurity',
    rawText: `ROHAN MEHTA
Email: rohan.mehta@example.com | Phone: +91 99887 76655
Location: Hyderabad, India | LinkedIn: linkedin.com/in/rohan-security | GitHub: github.com/rohan-infosec

SUMMARY
Cybersecurity student with hands-on practice in network packet analysis, vulnerability assessment, Linux administration, and OWASP Top 10 security auditing.

EDUCATION
B.Tech in Information Technology | IIIT Hyderabad (2025) | 8.2 CGPA

SKILLS
- Security: Wireshark, Nmap, Burp Suite, Metasploit, OWASP ZAP
- Systems: Linux (Ubuntu, Kali Linux), Windows Server, Bash scripting, Python
- Concepts: Network Protocols (TCP/IP, DNS, HTTPS), Firewalls, Threat Modeling, Cryptography

PROJECTS
1. Automated Vulnerability Scanner Tool (Python, Nmap API)
- Engineered automated network port and SSL certificate vulnerability scanner with PDF report output.
2. Web Application Penetration Testing Lab (Burp Suite, OWASP)
- Identified and documented SQL Injection and CSRF vulnerabilities in test microservices.`
  }
];
