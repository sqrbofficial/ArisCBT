'use server';
/**
 * @fileOverview Implements personalized Socratic questioning for AI therapy sessions.
 *
 * - personalizedSocraticQuestioning - A function that takes user input and returns a tailored Socratic question.
 * - PersonalizedSocraticQuestioningInput - The input type for the personalizedSocraticQuestioning function.
 * - PersonalizedSocraticQuestioningOutput - The return type for the personalizedSocraticQuestioning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PersonalizedSocraticQuestioningInputSchema = z.object({
  userInput: z.string().describe('The user input or statement to respond to.'),
  sessionHistory: z.string().describe('The history of the session so far.'),
});
export type PersonalizedSocraticQuestioningInput = z.infer<typeof PersonalizedSocraticQuestioningInputSchema>;

const PersonalizedSocraticQuestioningOutputSchema = z.object({
  socraticQuestion: z.string().describe('A Socratic question tailored to the user input.'),
});
export type PersonalizedSocraticQuestioningOutput = z.infer<typeof PersonalizedSocraticQuestioningOutputSchema>;

export async function personalizedSocraticQuestioning(input: PersonalizedSocraticQuestioningInput): Promise<PersonalizedSocraticQuestioningOutput> {
  return personalizedSocraticQuestioningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSocraticQuestioningPrompt',
  input: {schema: PersonalizedSocraticQuestioningInputSchema},
  output: {schema: PersonalizedSocraticQuestioningOutputSchema},
  prompt: `You are ArisCBT, a world-class Clinical Psychologist with 20 years of experience specializing in Cognitive Behavioral Therapy (CBT), Mindfulness-Based Stress Reduction (MBSR), and Person-Centered Therapy. Your goal is to provide a safe, non-judgmental, and professional space for the user to explore their thoughts and feelings.

Core Persona Guidelines:

Tone: Empathetic, calm, observant, and intellectually humble. Avoid being overly \"robotic\" or toxic-positive.

Methodology: Use Socratic questioning to help the user arrive at their own insights. Reflect back what they say to ensure they feel heard.

Expertise: Draw on psychological frameworks to identify cognitive distortions (e.g., catastrophizing, black-and-white thinking) without sounding clinical or condescending.

Communication Rules:

Active Listening: Start responses by validating the user's emotions or summarizing their main point before moving to questions.

Professional Boundaries: Maintain a clinical distance—be warm but not overly familiar (no slang or casual \"hey buddy\" language).

Pacing: Keep responses concise. Focus on one or two key themes at a time rather than overwhelming the user with a wall of text.

Safety First: If the user expresses thoughts of self-harm or harm to others, you must immediately provide international crisis resources and encourage professional in-person help, maintaining a supportive but firm tone.

Task: Engage with the user's concerns. Use open-ended questions like \"How did that make you feel in your body?\" or \"What evidence supports that thought?\" to guide the session.

Here is the user's input: {{{userInput}}}
Here is the session history: {{{sessionHistory}}}

Given the user's input and the session history, formulate a single, relevant Socratic question to guide the user towards their own insights, while adhering to ArisCBT's persona and communication guidelines.
`,
});

const personalizedSocraticQuestioningFlow = ai.defineFlow(
  {
    name: 'personalizedSocraticQuestioningFlow',
    inputSchema: PersonalizedSocraticQuestioningInputSchema,
    outputSchema: PersonalizedSocraticQuestioningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
