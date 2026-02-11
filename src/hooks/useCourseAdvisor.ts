import { courses, SENSITIVE_TOPICS, CLOSING_MESSAGE, Course } from "@/data/courseData";

function isSensitiveTopic(input: string): boolean {
  const lower = input.toLowerCase();
  return SENSITIVE_TOPICS.some((t) => lower.includes(t));
}

function findMatchingCourse(input: string): Course | null {
  const lower = input.toLowerCase();
  const keywords: Record<string, string[]> = {
    "Data Science with AI": ["data science", "ai course", "machine learning", "deep learning"],
    "Data Analyst": ["data analyst", "data analysis", "excel", "business intelligence", "dashboard"],
    "Python Full Stack Development": ["full stack", "fullstack", "python development", "web development", "frontend backend"],
    "DevOps Engineer": ["devops", "ci cd", "containerization", "linux", "deployment", "cloud computing"],
  };

  for (const course of courses) {
    const keys = keywords[course.name] || [];
    if (keys.some((k) => lower.includes(k)) || lower.includes(course.name.toLowerCase())) {
      return course;
    }
  }
  return null;
}

function formatCourseResponse(course: Course): string {
  return `Here are the details for ${course.name}. The duration is ${course.duration}. This course covers ${course.overview} Key modules include ${course.modules.slice(0, 4).join(", ")}, and more. After completing this course, you will be able to ${course.outcomes.slice(0, 2).join(" and ")}. ${CLOSING_MESSAGE}`;
}

function detectUserProfile(input: string): string | null {
  const lower = input.toLowerCase();
  if (lower.includes("fresher") || lower.includes("fresh graduate") || lower.includes("beginner") || lower.includes("new to")) {
    return "fresher";
  }
  if (lower.includes("working") || lower.includes("professional") || lower.includes("experience") || lower.includes("upskill")) {
    return "professional";
  }
  if (lower.includes("non-technical") || lower.includes("non technical") || lower.includes("commerce") || lower.includes("arts")) {
    return "non-technical";
  }
  return null;
}

export function getAdvisorResponse(userInput: string): string {
  if (!userInput || userInput.trim().length === 0) {
    return "I didn't catch that clearly. Could you please repeat your question? " + CLOSING_MESSAGE;
  }

  const lower = userInput.toLowerCase();

  // Sensitive topic redirect
  if (isSensitiveTopic(lower)) {
    return "That's a great question. However, details regarding fees, placements, and salary expectations are best discussed with a human counselor who can provide personalized information. " + CLOSING_MESSAGE;
  }

  // Compare courses
  if (lower.includes("compare") || lower.includes("difference between") || lower.includes("which is better")) {
    return `We offer four main courses: Data Science with AI (6 months), Data Analyst (5 months), Python Full Stack Development (6 months), and DevOps Engineer (6 months). Data Analyst is best for beginners with no coding background. Data Science with AI suits those with basic Python and math knowledge. Python Full Stack is ideal for aspiring web developers. DevOps is for those with Linux and development lifecycle experience. Each course focuses on different career paths. ${CLOSING_MESSAGE}`;
  }

  // List all courses
  if (lower.includes("all courses") || lower.includes("what courses") || lower.includes("course list") || lower.includes("courses available") || lower.includes("what do you offer")) {
    return `We currently offer four courses: Data Science with AI, Data Analyst, Python Full Stack Development, and DevOps Engineer. Each ranges from 5 to 6 months. Would you like to know more about any specific course? ${CLOSING_MESSAGE}`;
  }

  // Specific course match
  const matched = findMatchingCourse(lower);
  if (matched) {
    return formatCourseResponse(matched);
  }

  // User profile based recommendation
  const profile = detectUserProfile(lower);
  if (profile === "fresher") {
    return `As a fresher, I'd recommend starting with either the Data Analyst course, which requires no prior programming experience, or the Python Full Stack Development course if you're interested in building web applications. Both are beginner-friendly with a structured learning path. ${CLOSING_MESSAGE}`;
  }
  if (profile === "professional") {
    return `For working professionals looking to upskill, I'd suggest the Data Science with AI course if you're interested in data and AI, or the DevOps Engineer course if you want to focus on automation and cloud deployment. Both are designed for those with some technical background. ${CLOSING_MESSAGE}`;
  }
  if (profile === "non-technical") {
    return `For someone from a non-technical background, the Data Analyst course is an excellent starting point. It requires no prior programming experience and focuses on practical tools like Excel, SQL, and data visualization. ${CLOSING_MESSAGE}`;
  }

  // Greeting
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("good morning") || lower.includes("good evening")) {
    return `Hello! Welcome to our course advisory service. I can help you learn about our courses including Data Science with AI, Data Analyst, Python Full Stack Development, and DevOps Engineering. What would you like to know? ${CLOSING_MESSAGE}`;
  }

  // What should I learn / suggest
  if (lower.includes("suggest") || lower.includes("recommend") || lower.includes("which course") || lower.includes("what should i learn")) {
    return `To give you the best recommendation, could you tell me about your background? For example, are you a fresher, a working professional, or from a non-technical background? This will help me suggest the most suitable course for you. ${CLOSING_MESSAGE}`;
  }

  // Fallback
  return `Thank you for your question. I can provide information about our courses: Data Science with AI, Data Analyst, Python Full Stack Development, and DevOps Engineer. Could you please ask about a specific course or tell me about your background so I can recommend one? ${CLOSING_MESSAGE}`;
}
