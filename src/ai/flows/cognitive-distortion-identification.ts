'use server';

/**
 * @fileOverview Implements the cognitive distortion identification flow for the AI therapist.
 *
 * - identifyCognitiveDistortions - A function that identifies and addresses cognitive distortions in user input.
 * - IdentifyCognitiveDistortionsInput - The input type for the identifyCognitiveDistortions function.
 * - IdentifyCognitiveDistortionsOutput - The return type for the identifyCognitiveDistortions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyCognitiveDistortionsInputSchema = z.object({
  userInput: z.string().describe('The user input to analyze for cognitive distortions.'),
});
export type IdentifyCognitiveDistortionsInput = z.infer<
  typeof IdentifyCognitiveDistortionsInputSchema
>;

const IdentifyCognitiveDistortionsOutputSchema = z.object({
  hasDistortion: z
    .boolean()
    .describe('Whether or not there is a cognitive distortion in the user input.'),
  identifiedDistortion: z
    .string()
    .describe('The type of cognitive distortion identified, if any.'),
  suggestedChallenge: z
    .string()
    .describe('A suggested challenge to the identified cognitive distortion.'),
});

export type IdentifyCognitiveDistortionsOutput = z.infer<
  typeof IdentifyCognitiveDistortionsOutputSchema
>;

export async function identifyCognitiveDistortions(
  input: IdentifyCognitiveDistortionsInput
): Promise<IdentifyCognitiveDistortionsOutput> {
  return identifyCognitiveDistortionsFlow(input);
}

const identifyCognitiveDistortionsPrompt = ai.definePrompt({
  name: 'identifyCognitiveDistortionsPrompt',
  input: {schema: IdentifyCognitiveDistortionsInputSchema},
  output: {schema: IdentifyCognitiveDistortionsOutputSchema},
  prompt: `You are Dr. Aris, a world-class Clinical Psychologist. You will analyze the user input for cognitive distortions and suggest challenges to those distortions.

  Here are some common cognitive distortions:
  - Catastrophizing: Exaggerating the severity of a situation.
  - Black-and-white thinking: Seeing things in extremes with no middle ground.
  - Overgeneralization: Drawing broad conclusions from a single event.
  - Personalization: Blaming yourself for events that are not your fault.
  - Should statements: Holding rigid expectations about how things should be.

  Analyze the following user input:
  {{userInput}}

  First, determine if the user input contains a cognitive distortion. Set hasDistortion to true or false.
  If a cognitive distortion is present, identify the specific type of distortion in identifiedDistortion.
  Then, suggest a challenge to the distortion in suggestedChallenge. If there is no distortion set suggestedChallenge to empty string.

  Ensure your response follows the IdentifyCognitiveDistortionsOutputSchema schema description.`,
});

const identifyCognitiveDistortionsFlow = ai.defineFlow(
  {
    name: 'identifyCognitiveDistortionsFlow',
    inputSchema: IdentifyCognitiveDistortionsInputSchema,
    outputSchema: IdentifyCognitiveDistortionsOutputSchema,
  },
  async input => {
    const {output} = await identifyCognitiveDistortionsPrompt(input);
    return output!;
  }
);
