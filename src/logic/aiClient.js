
const TIMEOUT_MS = 8000;

const FALLBACK_EXPLANATION =
  "Sorry, I couldn't simplify this explanation right now. Review the original explanation and try again, or check Microsoft Learn for more guidance.";

/**
 * Request a simpler explanation for an AZ-900 question.
 *
 * @param {Object} question The quiz question.
 * @param {number} selectedIndex The learner's selected option index.
 * @returns {Promise<string>} A simplified explanation.
 */
export async function explainSimpler(question, selectedIndex) {
  if (
    !question ||
    typeof question.question !== 'string' ||
    !Array.isArray(question.options) ||
    !Number.isInteger(selectedIndex)
  ) {
    return FALLBACK_EXPLANATION;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        selectedIndex,
        explanation: question.explanation ?? '',
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return FALLBACK_EXPLANATION;
    }

    const data = await response.json();

    if (
      !data ||
      typeof data.explanation !== 'string' ||
      !data.explanation.trim()
    ) {
      return FALLBACK_EXPLANATION;
    }

    return data.explanation.trim();
  } catch {
    return FALLBACK_EXPLANATION;
  } finally {
    clearTimeout(timeoutId);
  }
}
