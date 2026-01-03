'use server';

/**
 * @fileOverview Provides crisis intervention and resources when the user expresses thoughts of self-harm or harm to others.
 *
 * - crisisInterventionAndResourceProvision - A function that handles the crisis intervention process.
 * - CrisisInterventionInput - The input type for the crisisInterventionAndResourceProvision function.
 * - CrisisInterventionOutput - The return type for the crisisInterventionAndResourceProvision function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrisisInterventionInputSchema = z.object({
  userInput: z.string().describe('The user input to analyze for crisis indicators.'),
});
export type CrisisInterventionInput = z.infer<typeof CrisisInterventionInputSchema>;

const CrisisInterventionOutputSchema = z.object({
  isCrisis: z.boolean().describe('Whether the user is in crisis based on their input.'),
  crisisMessage: z.string().describe('A message providing crisis resources and encouraging professional help if the user is in crisis.'),
});
export type CrisisInterventionOutput = z.infer<typeof CrisisInterventionOutputSchema>;

export async function crisisInterventionAndResourceProvision(input: CrisisInterventionInput): Promise<CrisisInterventionOutput> {
  return crisisInterventionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crisisInterventionPrompt',
  input: {schema: CrisisInterventionInputSchema},
  output: {schema: CrisisInterventionOutputSchema},
  prompt: `You are an AI therapist. Your primary goal is to ensure user safety.

  Analyze the following user input to determine if the user is expressing thoughts of self-harm or harm to others. If so, set isCrisis to true and provide a crisis message with resources. Otherwise, set isCrisis to false and provide an empty string for crisisMessage.

  User Input: {{{userInput}}}

  If isCrisis is true, include the following resources in crisisMessage:
  - National Suicide Prevention Lifeline: 988
  - Crisis Text Line: Text HOME to 741741

  Also, strongly encourage the user to seek professional in-person help.
  `,
});

const crisisInterventionFlow = ai.defineFlow(
  {
    name: 'crisisInterventionFlow',
    inputSchema: CrisisInterventionInputSchema,
    outputSchema: CrisisInterventionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
