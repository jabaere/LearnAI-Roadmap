import { BookOpen, CheckCircle, Clock, Disc3, Target, BrainCircuit, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

type Step = LearningRoadmapOutput['roadmap'][0];

interface RoadmapStepDetailProps {
  step: Step;
  onGoDeeper: (stepId: string) => void;
  isRegenerating: boolean;
  canRegenerate: boolean;
}

const DetailSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className }) => (
  <div className={`mb-8 ${className}`}>
    <h3 className="text-xl font-headline font-semibold flex items-center gap-2 mb-3 text-foreground/90">
      {icon}
      {title}
    </h3>
    <div className="max-w-none text-muted-foreground space-y-2">{children}</div>
  </div>
);

export default function RoadmapStepDetail({ step, onGoDeeper, isRegenerating, canRegenerate }: RoadmapStepDetailProps) {
  return (
    <ScrollArea className="h-full max-h-[600px] md:max-h-full">
      <div className="p-6 md:p-8">
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">{step.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Estimated time to master: {step.details.masteryTime}</span>
          </div>
          <p className="mt-4 text-muted-foreground">{step.summary}</p>
        </div>
        
        <DetailSection title="What You Will Learn" icon={<Target className="w-5 h-5 text-primary" />}>
          <ul className="list-disc pl-5 space-y-2">
            {step.details.whatYouWillLearn.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="First Steps" icon={<BookOpen className="w-5 h-5 text-primary" />}>
          <ul className="list-decimal pl-5 space-y-2">
            {step.details.firstSteps.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </DetailSection>
        
        <DetailSection title="How to Practice" icon={<Disc3 className="w-5 h-5 text-primary" />}>
          <ul className="list-disc pl-5 space-y-2">
            {step.details.howToPractice.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </DetailSection>
        
        <DetailSection title="Completion Criteria" icon={<CheckCircle className="w-5 h-5 text-primary" />}>
          <div className="flex flex-wrap gap-2">
            {step.details.completionCriteria.map((item, i) => (
              <Badge key={i} variant="secondary">{item}</Badge>
            ))}
          </div>
        </DetailSection>

        {canRegenerate && (
             <Card className='bg-primary/5 border-primary/20'>
                <CardHeader>
                    <CardTitle className='text-lg font-headline flex items-center gap-2'>
                        <BrainCircuit className="w-5 h-5 text-primary" />
                        Need More Detail?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>
                        Let our AI expand on this topic to provide more in-depth explanations and beginner-friendly guidance.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => onGoDeeper(step.id)} disabled={isRegenerating}>
                        {isRegenerating ? (
                            <>
                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                Going deeper...
                            </>
                        ) : "Go Deeper"}
                    </Button>
                </CardFooter>
            </Card>
        )}
      </div>
    </ScrollArea>
  );
}
