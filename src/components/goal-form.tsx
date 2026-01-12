'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { useEffect } from 'react';
import type { LearningRoadmapInput } from '@/ai/flows/generate-learning-roadmap';

const formSchema = z.object({
  userGoal: z.string().min(10, { message: 'Please describe your goal in at least 10 characters.' }),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: "Please select your skill level."
  }),
  timeCommitment: z.string().min(1, { message: 'Please select your time commitment.' }),
});

type GoalFormValues = z.infer<typeof formSchema>;

interface GoalFormProps {
  onSubmit: (data: GoalFormValues) => Promise<void>;
  isLoading: boolean;
  initialValues?: LearningRoadmapInput | null;
}

export function GoalForm({ onSubmit, isLoading, initialValues }: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userGoal: initialValues?.userGoal || '',
      skillLevel: initialValues?.skillLevel,
      timeCommitment: initialValues?.timeCommitment,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        userGoal: initialValues.userGoal,
        skillLevel: initialValues.skillLevel,
        timeCommitment: initialValues.timeCommitment
      });
    }
  }, [initialValues, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Wand2 className="w-8 h-8 text-primary" />
            Create Your Learning Roadmap
        </CardTitle>
        <CardDescription>Tell us what you want to learn, and our AI will chart the course.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your learning goal?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Become a professional web developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Skill Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your skill level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeCommitment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Time Commitment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your time commitment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1 hour/day">1 hour/day</SelectItem>
                        <SelectItem value="2-3 hours/day">2-3 hours/day</SelectItem>
                        <SelectItem value="4+ hours/day (Full-time)">4+ hours/day (Full-time)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
