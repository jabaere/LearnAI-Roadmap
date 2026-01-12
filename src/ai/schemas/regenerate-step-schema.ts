/**
 * @fileOverview Schemas and types for the regenerate-step-details AI flow.
 */

import {z} from 'genkit';

const StepDetailsSchema = z.object({
    whatYouWillLearn: z.array(z.string()),
    firstSteps: z.array(z.string()),
    howToPractice: z.array(z.string()),
    masteryTime: z.string(),
    completionCriteria: z.array(z.string()),
});

export const RegenerateStepInputSchema = z.object({
  originalGoal: z.string().describe('The original high-level learning goal of the user.'),
  skillLevel: z.string().describe('The skill level of the user.'),
  timeCommitment: z.string().describe('The daily time commitment of the user.'),
  stepTitle: z.string().describe('The title of the roadmap step to be regenerated.'),
  currentStepDetails: StepDetailsSchema.describe('The original details of the step to be expanded upon.'),
});

export type RegenerateStepInput = z.infer<typeof RegenerateStepInputSchema>;

export const RegenerateStepOutputSchema = StepDetailsSchema;

export type RegenerateStepOutput = z.infer<typeof RegenerateStepOutputSchema>;
