'use client';

import { useState, useEffect } from 'react';
import type { LearningRoadmapOutput as Roadmap, LearningRoadmapInput } from '@/ai/flows/generate-learning-roadmap';
import type { RegenerateStepInput } from '@/ai/schemas/regenerate-step-schema';
import RoadmapSidebar from '@/components/roadmap-sidebar';
import RoadmapStepDetail from '@/components/roadmap-step-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Layers, Save, Share2, Loader2, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { regenerateStepAction } from '@/app/actions';
import { saveRoadmapToFirestore, setRoadmapPublicStatus, SavedRoadmap } from '@/lib/firebase/firestore';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onRoadmapUpdate?: (updatedRoadmap: Roadmap) => void;
  formValues?: LearningRoadmapInput | null;
}

export default function RoadmapDisplay({ roadmap: initialRoadmap, onRoadmapUpdate, formValues }: RoadmapDisplayProps) {
  const [roadmap, setRoadmap] = useState<SavedRoadmap | Roadmap>(initialRoadmap);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    roadmap.roadmap.length > 0 ? roadmap.roadmap[0].id : null
  );
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    setRoadmap(initialRoadmap);
    if (initialRoadmap.roadmap.length > 0 && !initialRoadmap.roadmap.find(s => s.id === selectedStepId)) {
      setSelectedStepId(initialRoadmap.roadmap[0].id)
    }
  }, [initialRoadmap, selectedStepId]);

  const selectedStep = roadmap.roadmap.find((step) => step.id === selectedStepId);

  const handleSave = async (): Promise<string | undefined> => {
    if (!user) {
      localStorage.setItem('pendingRoadmap', JSON.stringify(roadmap));
      router.push('/login');
      return;
    }

    setIsSaving(true);
    let docId = (roadmap as SavedRoadmap).docId;
    try {
      docId = await saveRoadmapToFirestore(user.uid, roadmap);

      setRoadmap(prev => ({ ...prev, docId }));
      toast({
        title: 'Success!',
        description: 'Your roadmap has been saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error saving roadmap',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
    return docId;
  };

  const handleShare = async () => {
    let docId = (roadmap as SavedRoadmap).docId;

    if (!docId) {
      docId = (await handleSave()) as string;
    }

    if (!docId) {
      toast({
        variant: "destructive",
        title: "Could not share",
        description: "Please save the roadmap first before sharing.",
      });
      return;
    }

    setIsSharing(true);
    try {
      await setRoadmapPublicStatus(docId, true);

      // Update local state to reflect public status
      setRoadmap(prev => ({ ...prev, public: true }));

      const url = `${window.location.origin}/share/${docId}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Share Link Copied!",
        description: "Anyone with the link can now view this roadmap.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error sharing roadmap',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSharing(false);
    }
  }

  const handleGoDeeper = async (stepId: string) => {
    if (!selectedStep || !formValues) {
      toast({ variant: 'destructive', title: 'Error', description: 'Cannot regenerate step without full context.' });
      return;
    };

    setIsRegenerating(true);
    try {
      const newDetails = await regenerateStepAction({
        originalGoal: formValues.userGoal,
        skillLevel: formValues.skillLevel,
        timeCommitment: formValues.timeCommitment,
        stepTitle: selectedStep.title,
        currentStepDetails: selectedStep.details,
      });

      if (newDetails) {
        const updatedRoadmap = {
          ...roadmap,
          roadmap: roadmap.roadmap.map(step =>
            step.id === stepId ? { ...step, details: newDetails } : step
          )
        };
        setRoadmap(updatedRoadmap);
        if (onRoadmapUpdate) {
          onRoadmapUpdate(updatedRoadmap as Roadmap);
        }
        toast({ title: 'Step Updated!', description: `"${selectedStep.title}" has been enhanced with more detail.` });
      } else {
        throw new Error('The AI failed to return updated step details.');
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Go Deeper',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <Card className="w-full relative overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl pr-24">{roadmap.goal}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>{roadmap.roadmap.length} steps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{roadmap.totalEstimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${roadmap.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : roadmap.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
              {roadmap.difficulty}
            </span>
            {(roadmap as SavedRoadmap).public && (
              <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Public
              </span>
            )}
          </div>
        </div>
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={loading || isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} disabled={isSaving || isSharing}>
            {isSharing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/3 lg:w-1/4 bg-primary/5">
            <RoadmapSidebar
              steps={roadmap.roadmap}
              selectedStepId={selectedStepId}
              onSelectStep={setSelectedStepId}
            />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedStep ? (
              <RoadmapStepDetail
                key={selectedStep.id}
                step={selectedStep}
                onGoDeeper={handleGoDeeper}
                isRegenerating={isRegenerating}
                canRegenerate={!!formValues}
              />
            ) : (
              <div className="p-8 text-center text-muted-foreground h-full flex items-center justify-center">
                Select a step to see the details.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
