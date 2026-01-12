import { List, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import { ScrollArea } from './ui/scroll-area';

type Step = LearningRoadmapOutput['roadmap'][0];

interface RoadmapSidebarProps {
  steps: Step[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
}

export default function RoadmapSidebar({ steps, selectedStepId, onSelectStep }: RoadmapSidebarProps) {
  return (
    <ScrollArea className="h-full max-h-[600px] md:max-h-full border-b md:border-b-0 md:border-r">
      <div className="p-4">
        <h3 className="text-lg font-semibold font-headline flex items-center gap-2">
          <List className="w-5 h-5" />
          Roadmap Steps
        </h3>
      </div>
      <nav className="flex flex-col">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onSelectStep(step.id)}
            className={cn(
              'flex items-start gap-4 p-4 text-left transition-colors w-full border-t',
              selectedStepId === step.id
                ? 'bg-primary/10'
                : 'hover:bg-primary/5'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-lg transition-colors',
                selectedStepId === step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </div>
            <div className="flex-grow">
              <p
                className={cn(
                  'font-semibold transition-colors',
                  selectedStepId === step.id ? 'text-primary' : 'text-foreground'
                )}
              >
                {step.title}
              </p>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{step.estimatedTime}</span>
              </div>
            </div>
          </button>
        ))}
      </nav>
    </ScrollArea>
  );
}
