'use server';

/**
 * @fileOverview AI-powered learning roadmap step regenerator.
 *
 * - regenerateStepDetails - A function that regenerates a single roadmap step with more detail.
 */

import {ai} from '@/ai/genkit';
import {
  RegenerateStepInputSchema,
  RegenerateStepOutputSchema,
  type RegenerateStepInput,
  type RegenerateStepOutput,
} from '@/ai/schemas/regenerate-step-schema';

export async function regenerateStepDetails(
  input: RegenerateStepInput
): Promise<RegenerateStepOutput> {
  return regenerateStepDetailsFlow(input);
}

const regenerateStepDetailsPrompt = ai.definePrompt({
  name: 'regenerateStepDetailsPrompt',
  input: {schema: RegenerateStepInputSchema},
  output: {schema: RegenerateStepOutputSchema},
  config: {
    temperature: 0.5,
  },
  system: `You are an expert learning architect. Your task is to regenerate a single step of a learning roadmap to be more detailed and beginner-friendly.
You must return ONLY the updated "details" object in valid JSON, with no other text or markdown.
All arrays in the output must be non-empty.`,
  prompt: `Regenerate the following roadmap step with more detailed beginner guidance.

Original Goal:
{{originalGoal}}

User Skill Level:
{{skillLevel}}

Daily Time Commitment:
{{timeCommitment}}

Step Title:
{{stepTitle}}
`,
});

const regenerateStepDetailsFlow = ai.defineFlow(
  {
    name: 'regenerateStepDetailsFlow',
    inputSchema: RegenerateStepInputSchema,
    outputSchema: RegenerateStepOutputSchema,
  },
  async input => {
    const {output} = await regenerateStepDetailsPrompt(input);
    return output!;
  }
);
