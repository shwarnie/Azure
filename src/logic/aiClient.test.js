
import { afterEach, describe, it, expect, vi } from 'vitest';
import { explainSimpler } from './aiClient.js';

const question = {
  id: 'cc-mock-001',
  question: 'What is scalability?',
  options: ['Adjusting resources to demand', 'Buying more servers'],
  correctIndex: 0,
  explanation: 'Scalability adjusts capacity to demand.',
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('explainSimpler', () => {
  it('returns the explanation from a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          explanation: 'Scalability means adjusting capacity to demand.',
        }),
      }),
    );

    const result = await explainSimpler(question, 0);

    expect(result).toBe(
      'Scalability means adjusting capacity to demand.',
    );
    expect(fetch).toHaveBeenCalledWith(
      '/api/explain',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('sends the question and selected answer to the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ explanation: 'A simpler explanation.' }),
      }),
    );

    await explainSimpler(question, 1);

    const [, request] = fetch.mock.calls[0];
    const body = JSON.parse(request.body);

    expect(body.question).toBe(question.question);
    expect(body.options).toEqual(question.options);
    expect(body.correctIndex).toBe(0);
    expect(body.selectedIndex).toBe(1);
  });

  it('returns a fallback when the API responds with an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Unavailable' }),
      }),
    );

    const result = await explainSimpler(question, 0);

    expect(result).toContain('couldn\'t simplify');
  });

  it('returns a fallback when the response has no explanation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );

    const result = await explainSimpler(question, 0);

    expect(result).toContain('couldn\'t simplify');
  });

  it('returns a fallback when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );

    const result = await explainSimpler(question, 0);

    expect(result).toContain('couldn\'t simplify');
  });

  it('returns a fallback for missing question data', async () => {
    const result = await explainSimpler(null, 0);

    expect(result).toContain('couldn\'t simplify');
  });
});
