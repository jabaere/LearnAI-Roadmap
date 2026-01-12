'use client';

import { useEffect, useState } from 'react';
import { getRoadmapFromFirestore, SavedRoadmap } from '@/lib/firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import RoadmapDisplay from '@/components/roadmap-display';
import { useAuth } from '@/context/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { LearningRoadmapInput } from '@/ai/flows/generate-learning-roadmap';

export default function SavedRoadmapPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [roadmap, setRoadmap] = useState<SavedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push(`/login?redirect=/my-roadmaps/${id}`);
      return;
    }

    const fetchRoadmap = async () => {
      try {
        const fetchedRoadmap = await getRoadmapFromFirestore(id as string);
        if (!fetchedRoadmap) {
          setError('Roadmap not found.');
        } else if (fetchedRoadmap.userId !== user.uid) {
            setError('You are not authorized to view this roadmap.');
        } else {
          setRoadmap(fetchedRoadmap);
        }
      } catch (err) {
        setError('Failed to load roadmap. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoadmap();
    }
  }, [id, user, authLoading, router]);

  const formValues: LearningRoadmapInput | null = roadmap ? {
      userGoal: roadmap.goal,
      skillLevel: roadmap.assumptions.skillLevel as any,
      timeCommitment: roadmap.assumptions.dailyTimeCommitment,
  } : null;

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Button variant="ghost" asChild className='mb-4'>
            <Link href="/my-roadmaps">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Roadmaps
            </Link>
        </Button>
      {error && (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className='text-destructive'>Error</CardTitle>
            </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
      {roadmap && <RoadmapDisplay roadmap={roadmap} formValues={formValues} />}
    </div>
  );
}
