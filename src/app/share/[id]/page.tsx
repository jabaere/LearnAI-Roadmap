'use client';

import { useEffect, useState } from 'react';
import { getRoadmapFromFirestore, SavedRoadmap } from '@/lib/firebase/firestore';
import { useParams } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import RoadmapDisplay from '@/components/roadmap-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SharedRoadmapPage() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState<SavedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const fetchedRoadmap = await getRoadmapFromFirestore(id as string);
        if (!fetchedRoadmap) {
          setError('Roadmap not found.');
        } else if (!fetchedRoadmap.public) {
          setError('This roadmap is not public.');
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {error && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="items-center text-center">
            <ShieldAlert className="w-12 h-12 text-destructive" />
            <CardTitle className="text-destructive text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}
      {roadmap && <RoadmapDisplay roadmap={roadmap} />}
    </div>
  );
}
