'use client';

import { useState } from 'react';
import { GoalForm } from '@/components/goal-form';
import RoadmapDisplay from '@/components/roadmap-display';
import { LearningRoadmapOutput, LearningRoadmapInput } from '@/ai/flows/generate-learning-roadmap';
import { generateRoadmapAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Edit } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function Home() {
  const [roadmap, setRoadmap] = useState<LearningRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<LearningRoadmapInput | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showFormOnMobile, setShowFormOnMobile] = useState(true);

  const handleGenerateRoadmap = async (data: LearningRoadmapInput) => {
    setIsLoading(true);
    setFormValues(data);
    try {
      const result = await generateRoadmapAction({
        userGoal: data.userGoal,
        skillLevel: data.skillLevel,
        timeCommitment: data.timeCommitment,
      });
      if (result) {
        setRoadmap(result);
        if (isMobile) setShowFormOnMobile(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate roadmap.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Roadmap',
        description:
          error instanceof Error ? error.message : 'Unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 mt-20 md:px-8 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start min-h-[calc(100vh-220px)]">
        {/* FORM COLUMN */}
        <div
          className={cn(
            'md:col-span-4',
            isMobile && roadmap && !showFormOnMobile && 'hidden'
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-xl bg-card shadow-sm border"
          >
            <GoalForm
              onSubmit={handleGenerateRoadmap}
              isLoading={isLoading}
              initialValues={formValues}
            />
          </motion.div>

          {/* Mobile Overlay Form */}
          {isMobile && (roadmap || isLoading) && (
            <div
              className={cn(
                'fixed inset-x-0 bottom-0 top-[56px] z-20 bg-background',
                showFormOnMobile ? 'block' : 'hidden'
              )}
            >
              <div className="h-full overflow-y-auto p-4">
                <div className="rounded-xl border shadow-sm bg-card">
                  <GoalForm
                    onSubmit={handleGenerateRoadmap}
                    isLoading={isLoading}
                    initialValues={formValues}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT COLUMN */}
        <div
          className={cn(
            'md:col-span-8',
            isMobile && !roadmap && !isLoading && 'hidden'
          )}
        >
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] items-center justify-center"
              >
                <div className="flex flex-col items-center text-center gap-4 max-w-sm">
                  <Rocket className="h-14 w-14 text-primary animate-bounce" />
                  <p className="text-lg font-semibold">
                    Creating your roadmap
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Our AI is mapping out the best learning path for you.
                  </p>
                </div>
              </motion.div>
            )}

            {roadmap && !isLoading && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={cn(
                  'rounded-xl border bg-card shadow-sm',
                  isMobile && showFormOnMobile && 'hidden'
                )}
              >
                <RoadmapDisplay
                  roadmap={roadmap}
                  onRoadmapUpdate={setRoadmap}
                  formValues={formValues}
                />
              </motion.div>
            )}

            {!roadmap && !isLoading && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[420px] items-center justify-center"
              >
                <Card className="border-dashed bg-muted/30 w-full max-w-xl">
                  <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                    <Rocket className="h-14 w-14 text-muted-foreground" />
                    <h2 className="text-2xl font-bold">
                      Start your learning journey
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                      Define your goal and we’ll generate a clear, personalized
                      roadmap to get you there.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE FAB */}
      {isMobile && roadmap && (
        <Button
          size="icon"
          onClick={() => setShowFormOnMobile((v) => !v)}
          className="fixed bottom-5 right-5 z-30 h-14 w-14 rounded-full shadow-xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={showFormOnMobile ? 'roadmap' : 'edit'}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {showFormOnMobile ? (
                <Rocket className="h-6 w-6" />
              ) : (
                <Edit className="h-6 w-6" />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">
            {showFormOnMobile ? 'View Roadmap' : 'Edit Goal'}
          </span>
        </Button>
      )}
    </div>
  );
}
