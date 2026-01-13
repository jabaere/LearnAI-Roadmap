'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { getSavedRoadmapsFromFirestore, SavedRoadmap, deleteRoadmapFromFirestore } from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, PlusCircle, Clock, Layers, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useToast } from '@/hooks/use-toast';


export default function MyRoadmapsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/my-roadmaps');
      } else {
        const fetchRoadmaps = async () => {
          setLoading(true);
          try {
            const userRoadmaps = await getSavedRoadmapsFromFirestore(user.uid);
            setRoadmaps(userRoadmaps);
          } catch (error) {
            console.error("Failed to fetch roadmaps", error);
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to load your roadmaps. Please try again later.'
            })
          } finally {
            setLoading(false);
          }
        };
        fetchRoadmaps();
      }
    }
  }, [user, authLoading, router, toast]);

  const handleDelete = async (docId: string) => {
    setIsDeleting(docId);
    try {
      await deleteRoadmapFromFirestore(docId);
      setRoadmaps(prev => prev.filter(r => r.docId !== docId));
      toast({
        title: 'Success',
        description: 'Roadmap deleted successfully.'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : "Failed to delete roadmap."
      })
    }
    setIsDeleting(null);
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">My Roadmaps</h1>
        <Button asChild>
          <Link href="/">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      {roadmaps.length === 0 ? (
        <Card className="text-center py-20 border-dashed">
          <CardContent>
            <h3 className="text-xl font-semibold">No roadmaps yet!</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Create your first learning roadmap to see it here.
            </p>
            <Button asChild>
              <Link href="/">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.docId} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-headline text-xl leading-tight">{roadmap.goal}</CardTitle>
                <CardDescription className="flex items-center gap-4 pt-2 text-sm">
                  <span className='flex items-center gap-1.5'><Layers className="w-4 h-4" />{roadmap.roadmap.length} steps</span>
                  <span className='flex items-center gap-1.5'><Clock className="w-4 h-4" />{roadmap.totalEstimatedTime}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/my-roadmaps/${roadmap.docId}`}>View Roadmap</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isDeleting === roadmap.docId}>
                      {isDeleting === roadmap.docId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your roadmap
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(roadmap.docId)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}