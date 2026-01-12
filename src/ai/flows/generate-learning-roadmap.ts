'use server';

/**
 * @fileOverview AI-powered learning roadmap generator.
 *
 * - generateLearningRoadmap - A function that generates a learning roadmap based on the user's learning goal, skill level, and daily time commitment.
 * - LearningRoadmapInput - The input type for the generateLearningRoadmap function.
 * - LearningRoadmapOutput - The return type for the generateLearningRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningRoadmapInputSchema = z.object({
  userGoal: z.string().describe('The learning goal of the user.'),
  skillLevel: z
    .enum(['Beginner', 'Intermediate', 'Advanced'])
    .describe('The skill level of the user.'),
  timeCommitment: z
    .string()
    .describe('The daily time commitment of the user (e.g. 1 hour/day, 2-3 hours/day, full-time).'),
});

export type LearningRoadmapInput = z.infer<typeof LearningRoadmapInputSchema>;

const LearningRoadmapOutputSchema = z.object({
  goal: z.string(),
  assumptions: z.object({
    skillLevel: z.string(),
    dailyTimeCommitment: z.string(),
  }),
  totalEstimatedTime: z.string(),
  difficulty: z.string(),
  roadmap: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      estimatedTime: z.string(),
      summary: z.string(),
      details: z.object({
        whatYouWillLearn: z.array(z.string()),
        firstSteps: z.array(z.string()),
        howToPractice: z.array(z.string()),
        masteryTime: z.string(),
        completionCriteria: z.array(z.string()),
      }),
    })
  ),
});

export type LearningRoadmapOutput = z.infer<typeof LearningRoadmapOutputSchema>;

export async function generateLearningRoadmap(
  input: LearningRoadmapInput
): Promise<LearningRoadmapOutput> {
  return generateLearningRoadmapFlow(input);
}

const generateLearningRoadmapPrompt = ai.definePrompt({
  name: 'generateLearningRoadmapPrompt',
  input: {schema: LearningRoadmapInputSchema},
  output: {schema: LearningRoadmapOutputSchema},
  config: {
    temperature: 0.4,
    topP: 0.9,
    maxOutputTokens: 8192,
  },
  system: `You are an expert learning architect and curriculum designer.

Your task is to generate clear, realistic, and structured learning roadmaps based on a user's goal.
You must think in progressive steps, starting from absolute fundamentals and moving toward mastery.

Rules:
- Always return valid JSON only (no markdown, no explanations).
- Do NOT include any text outside the JSON.
- Time estimates must be realistic and based on part-time study unless otherwise specified.
- Break goals into logical, sequential roadmap steps.
- Each roadmap step must be independently understandable.
- Content must be beginner-friendly but accurate.
- Assume the roadmap will be used in an interactive UI where each step is clickable.

Output Requirements:
- Use the exact JSON structure defined in the output schema.
- All arrays must be non-empty.
- Use short, clear language.
- Avoid buzzwords and marketing language.
- Do not include links.`,
  prompt: `Create a learning roadmap for the following goal:\n\nGoal:\n{{userGoal}}\n\nUser Skill Level:\n{{skillLevel}}\n\nDaily Time Commitment:\n{{timeCommitment}}`,
});

const generateLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'generateLearningRoadmapFlow',
    inputSchema: LearningRoadmapInputSchema,
    outputSchema: LearningRoadmapOutputSchema,
  },
  async input => {
    const {output} = await generateLearningRoadmapPrompt(input);
    return output!;
  }
);
