export const MOCK_QUESTIONS = [
  {
    id: 'cc-mock-001',
    topic: 'Describe Cloud Concepts',
    subtopic: 'Benefits of cloud computing',
    difficulty: 'easy',
    question:
      'A small team needs to increase computing capacity for a short project without buying new servers. Which cloud benefit best fits this need?',
    options: [
      'Scale resources to match demand',
      'Own and maintain more physical servers',
      'Move every application to one computer',
      'Avoid monitoring resource use',
    ],
    correctIndex: 0,
    explanation:
      'Cloud resources can be provisioned and adjusted as needs change, so the team can use additional capacity for the project without purchasing its own hardware.',
    whyOthersWrong: [
      null,
      'Buying and maintaining physical servers is the opposite of using on-demand cloud capacity.',
      'Putting all applications on one computer does not provide flexible capacity.',
      'Cloud resources still need to be monitored and managed.',
    ],
  },
  {
    id: 'cc-mock-002',
    topic: 'Describe Cloud Concepts',
    subtopic: 'Cloud service types',
    difficulty: 'medium',
    question:
      'A developer wants to deploy application code while the cloud provider manages the underlying runtime and operating system. Which service type is the best fit?',
    options: ['IaaS', 'PaaS', 'On-premises hosting', 'Local storage'],
    correctIndex: 1,
    explanation:
      'Platform as a service provides a managed platform for deploying applications, reducing the amount of underlying infrastructure the developer must manage.',
    whyOthersWrong: [
      'With infrastructure as a service, the customer manages more of the operating system and environment.',
      null,
      'On-premises hosting requires the organization to manage its own infrastructure.',
      'Local storage is not a cloud application hosting service type.',
    ],
  },
  {
    id: 'arch-mock-001',
    topic: 'Describe Azure Architecture and Services',
    subtopic: 'Azure physical infrastructure',
    difficulty: 'easy',
    question:
      'Which statement best describes availability zones in an Azure region?',
    options: [
      'They are separate physical locations with independent infrastructure.',
      'They are billing categories for virtual machines.',
      'They are user accounts shared between subscriptions.',
      'They are names for Azure management tools.',
    ],
    correctIndex: 0,
    explanation:
      'Availability zones are physically separate locations within an Azure region, designed with independent power, cooling, and networking.',
    whyOthersWrong: [
      null,
      'A zone describes physical infrastructure, not a billing category.',
      'Availability zones are not identities or user accounts.',
      'They are part of Azure’s physical architecture, not management tools.',
    ],
  },
  {
    id: 'arch-mock-002',
    topic: 'Describe Azure Architecture and Services',
    subtopic: 'Azure resource management',
    difficulty: 'medium',
    question:
      'Which Azure service provides a management layer for creating, updating, and deleting Azure resources?',
    options: [
      'Azure Resource Manager',
      'Microsoft Entra ID',
      'Azure Monitor',
      'Azure Cost Management',
    ],
    correctIndex: 0,
    explanation:
      'Azure Resource Manager is the deployment and management service for Azure, providing a consistent way to work with resources.',
    whyOthersWrong: [
      null,
      'Microsoft Entra ID manages identity and access rather than resource deployments.',
      'Azure Monitor helps collect and analyze monitoring data.',
      'Azure Cost Management helps analyze and manage cloud spending.',
    ],
  },
  {
    id: 'gov-mock-001',
    topic: 'Describe Azure Management and Governance',
    subtopic: 'Identity and access',
    difficulty: 'easy',
    question:
      'An organization needs to manage identities and control access to Azure resources. Which service is designed for identity and access management?',
    options: [
      'Microsoft Entra ID',
      'Azure Policy',
      'Azure Monitor',
      'Azure Advisor',
    ],
    correctIndex: 0,
    explanation:
      'Microsoft Entra ID is Microsoft’s cloud-based identity and access management service.',
    whyOthersWrong: [
      null,
      'Azure Policy helps create and enforce organizational standards for resources.',
      'Azure Monitor collects and analyzes monitoring data.',
      'Azure Advisor provides recommendations to help optimize Azure deployments.',
    ],
  },
  {
    id: 'gov-mock-002',
    topic: 'Describe Azure Management and Governance',
    subtopic: 'Governance and compliance',
    difficulty: 'medium',
    question:
      'A team wants to evaluate whether Azure resources follow its organizational standards. Which service should it use?',
    options: ['Azure Policy', 'Azure Virtual Network', 'Azure DNS', 'Azure Files'],
    correctIndex: 0,
    explanation:
      'Azure Policy can evaluate resources against organizational rules and report compliance status.',
    whyOthersWrong: [
      null,
      'Azure Virtual Network provides private networking for Azure resources.',
      'Azure DNS hosts DNS domains and provides name resolution.',
      'Azure Files provides managed file shares.',
    ],
  },
]

function shuffle(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ]
  }
  return shuffled
}

export function buildQuiz(questions, { topic, count, difficulty }) {
  const matchingQuestions = questions.filter(
    (question) =>
      (topic === 'All topics (mixed)' || question.topic === topic) &&
      (difficulty === 'all' || question.difficulty === difficulty),
  )

  return shuffle(matchingQuestions).slice(0, count)
}

export function checkAnswer(question, selectedIndex) {
  return {
    isCorrect: selectedIndex === question.correctIndex,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    whyWrong: question.whyOthersWrong,
  }
}

export function calculateScore(answers) {
  const bySubtopicMap = new Map()

  for (const answer of answers) {
    const { subtopic } = answer.question
    const entry = bySubtopicMap.get(subtopic) ?? { subtopic, correct: 0, total: 0 }
    entry.total += 1
    if (answer.isCorrect) entry.correct += 1
    bySubtopicMap.set(subtopic, entry)
  }

  const correct = answers.filter((answer) => answer.isCorrect).length
  const total = answers.length

  return {
    correct,
    total,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    bySubtopic: [...bySubtopicMap.values()].map((entry) => ({
      ...entry,
      percentage: Math.round((entry.correct / entry.total) * 100),
    })),
  }
}

const PROGRESS_KEY = 'cloudready-progress'
const MISSED_KEY = 'cloudready-missed'

export function saveResult(topic, correct, total, missedIds) {
  const progress = getProgress()
  const percentage = total ? Math.round((correct / total) * 100) : 0
  const previousBest = progress[topic]?.bestPercentage ?? 0

  progress[topic] = {
    bestPercentage: Math.max(previousBest, percentage),
    latestPercentage: percentage,
    correct,
    total,
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))

  const missed = getMissedQuestionIds()
  localStorage.setItem(
    MISSED_KEY,
    JSON.stringify([...new Set([...missed, ...missedIds])]),
  )
}

export function getProgress() {
  const storedProgress = localStorage.getItem(PROGRESS_KEY)
  return storedProgress ? JSON.parse(storedProgress) : {}
}

export function getMissedQuestionIds() {
  const storedMissed = localStorage.getItem(MISSED_KEY)
  return storedMissed ? JSON.parse(storedMissed) : []
}

export function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(MISSED_KEY)
}

export async function explainSimpler(question, selectedIndex) {
  const response = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      selectedIndex,
      explanation: question.explanation,
    }),
  })
  const data = await response.json()

  if (!response.ok || typeof data.explanation !== 'string') {
    throw new Error(data.error || 'Could not simplify this explanation.')
  }
  return data.explanation
}
