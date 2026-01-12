'use server';

import {
  generateLearningRoadmap,
  LearningRoadmapInput,
  LearningRoadmapOutput,
} from '@/ai/flows/generate-learning-roadmap';
import {
    regenerateStepDetails,
} from '@/ai/flows/regenerate-step-details';
import type { RegenerateStepInput, RegenerateStepOutput } from '@/ai/schemas/regenerate-step-schema';
import { saveRoadmapToFirestore, deleteRoadmapFromFirestore, setRoadmapPublicStatus } from '@/lib/firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function generateRoadmapAction(
  input: LearningRoadmapInput
): Promise<LearningRoadmapOutput | null> {
  try {
    const roadmap = await generateLearningRoadmap(input);
    return roadmap;
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    // Check for specific API key/quota error messages from the AI service
    if (error.message && (error.message.includes('API key') || error.message.includes('quota'))) {
        throw new Error('API key limit reached. Please try again later.');
    }
    return null;
  }
}

export async function saveRoadmapAction(roadmap: LearningRoadmapOutput, userId: string): Promise<{ success: boolean; docId?: string, error?: string }> {
  if (!userId) {
    return { success: false, error: "User not authenticated." };
  }
  try {
    const docId = await saveRoadmapToFirestore(userId, roadmap);
    revalidatePath('/my-roadmaps');
    return { success: true, docId };
  } catch(error) {
    console.error('Error saving roadmap:', error);
    const message = error instanceof Error ? error.message : "Failed to save roadmap.";
    return { success: false, error: message };
  }
}

export async function deleteRoadmapAction(docId: string): Promise<{ success: boolean, error?: string}> {
    try {
        await deleteRoadmapFromFirestore(docId);
        revalidatePath('/my-roadmaps');
        return { success: true };
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        const message = error instanceof Error ? error.message : "Failed to delete roadmap.";
        return { success: false, error: message };
    }
}

export async function regenerateStepAction(input: RegenerateStepInput): Promise<RegenerateStepOutput | null> {
    try {
        const result = await regenerateStepDetails(input);
        return result;
    } catch (error) {
        console.error('Error regenerating step:', error);
        return null;
    }
}

export async function shareRoadmapAction(docId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await setRoadmapPublicStatus(docId, true);
        revalidatePath(`/my-roadmaps/${docId}`);
        revalidatePath(`/share/${docId}`);
        return { success: true };
    } catch (error) {
        console.error('Error sharing roadmap:', error);
        const message = error instanceof Error ? error.message : "Failed to share roadmap.";
        return { success: false, error: message };
    }
}
