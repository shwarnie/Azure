import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const questionsPath = resolve(scriptDir, "../data/questions.json");
const validTopics = [
  "Describe Cloud Concepts",
  "Describe Azure Architecture and Services",
  "Describe Azure Management and Governance",
];
const prefixForTopic = new Map([
  [validTopics[0], "cc-"],
  [validTopics[1], "arch-"],
  [validTopics[2], "gov-"],
]);
const validDifficulties = new Set(["easy", "medium", "hard"]);

let questions;
try {
  questions = JSON.parse(readFileSync(questionsPath, "utf8"));
} catch (error) {
  console.error(`Cannot read valid JSON from ${questionsPath}: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(questions)) {
  console.error("The question bank must be a JSON array.");
  process.exit(1);
}

const errors = [];
const ids = new Set();
const counts = new Map(validTopics.map((topic) => [topic, 0]));

questions.forEach((question, index) => {
  const label = `Question ${index + 1}`;
  if (!question || typeof question !== "object" || Array.isArray(question)) {
    errors.push(`${label} must be an object.`);
    return;
  }

  if (typeof question.id !== "string" || question.id.length === 0) {
    errors.push(`${label} must have a non-empty string id.`);
  } else {
    if (ids.has(question.id)) errors.push(`${label} has duplicate id "${question.id}".`);
    ids.add(question.id);
  }

  if (!counts.has(question.topic)) {
    errors.push(`${label} has invalid topic "${question.topic}".`);
  } else {
    counts.set(question.topic, counts.get(question.topic) + 1);
    if (typeof question.id === "string" && !question.id.startsWith(prefixForTopic.get(question.topic))) {
      errors.push(`${label} id "${question.id}" has the wrong prefix for its topic.`);
    }
  }

  if (!validDifficulties.has(question.difficulty)) {
    errors.push(`${label} has invalid difficulty "${question.difficulty}".`);
  }

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push(`${label} must have exactly 4 options.`);
  } else {
    const normalizedOptions = question.options.map((option) =>
      typeof option === "string" ? option.trim().toLocaleLowerCase() : "",
    );
    if (normalizedOptions.some((option) => option.length === 0)) {
      errors.push(`${label} options must all be non-empty strings.`);
    }
    if (new Set(normalizedOptions).size !== 4) {
      errors.push(`${label} options must be unique.`);
    }
  }

  const correctIndexIsValid =
    Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3;
  if (!correctIndexIsValid) {
    errors.push(`${label} correctIndex must be an integer from 0 to 3.`);
  }

  if (!Array.isArray(question.whyOthersWrong) || question.whyOthersWrong.length !== 4) {
    errors.push(`${label} must have exactly 4 whyOthersWrong entries.`);
  } else if (correctIndexIsValid) {
    question.whyOthersWrong.forEach((reason, optionIndex) => {
      if (optionIndex === question.correctIndex) {
        if (reason !== null) errors.push(`${label} must have null at the correct option position.`);
      } else if (typeof reason !== "string" || reason.trim().length === 0) {
        errors.push(`${label} needs a non-empty reason for wrong option ${optionIndex}.`);
      }
    });
  }
});

console.log("Counts by topic:");
for (const [topic, count] of counts) console.log(`- ${topic}: ${count}`);

if (errors.length) {
  console.error("\nValidation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`\nValidation passed for ${questions.length} questions.`);
