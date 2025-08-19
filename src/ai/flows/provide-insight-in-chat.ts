'use server';
/**
 * @fileOverview An AI agent that provides personalized astrological insights through a chat interface.
 *
 * - provideInsightInChat - A function that initiates the chat with a personalized insight based on the user's birth chart.
 * - ProvideInsightInChatInput - The input type for the provideInsightInChat function.
 * - ProvideInsightInChatOutput - The return type for the provideInsightInChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideInsightInChatInputSchema = z.object({
  dateOfBirth: z.string().describe('The date of birth of the user.'),
  timeOfBirth: z.string().describe('The time of birth of the user.'),
  placeOfBirth: z.string().describe('The place of birth of the user.'),
  prompt: z.string().describe('The prompt to initiate the chat with the AI.'),
});
export type ProvideInsightInChatInput = z.infer<typeof ProvideInsightInChatInputSchema>;

const ProvideInsightInChatOutputSchema = z.object({
  insight: z.string().describe('The personalized astrological insight.'),
});
export type ProvideInsightInChatOutput = z.infer<typeof ProvideInsightInChatOutputSchema>;

export async function provideInsightInChat(input: ProvideInsightInChatInput): Promise<ProvideInsightInChatOutput> {
  return provideInsightInChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideInsightInChatPrompt',
  input: {schema: ProvideInsightInChatInputSchema},
  output: {schema: ProvideInsightInChatOutputSchema},
  prompt: `You are an AI Astrologer that provides personalized astrological insights based on the user's birth chart.

  Date of Birth: {{{dateOfBirth}}}
  Time of Birth: {{{timeOfBirth}}}
  Place of Birth: {{{placeOfBirth}}}

  Based on this information, provide a personalized astrological insight that addresses the following prompt: {{{prompt}}}.`,
});

const provideInsightInChatFlow = ai.defineFlow(
  {
    name: 'provideInsightInChatFlow',
    inputSchema: ProvideInsightInChatInputSchema,
    outputSchema: ProvideInsightInChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
