'use server';

/**
 * @fileOverview Provides personalized astrological insights based on a birth chart.
 *
 * - analyzeBirthChart - A function that analyzes a birth chart and returns personalized insights.
 * - AnalyzeBirthChartInput - The input type for the analyzeBirthChart function.
 * - AnalyzeBirthChartOutput - The return type for the analyzeBirthChart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBirthChartInputSchema = z.object({
  dateOfBirth: z.string().describe('The date of birth in ISO format (YYYY-MM-DD).'),
  timeOfBirth: z.string().describe('The time of birth in HH:mm format (24-hour clock).'),
  placeOfBirth: z.string().describe('The place of birth (e.g., city, state, country).'),
});
export type AnalyzeBirthChartInput = z.infer<typeof AnalyzeBirthChartInputSchema>;

const AnalyzeBirthChartOutputSchema = z.object({
  insights: z.string().describe('Personalized astrological insights based on the birth chart.'),
});
export type AnalyzeBirthChartOutput = z.infer<typeof AnalyzeBirthChartOutputSchema>;

export async function analyzeBirthChart(input: AnalyzeBirthChartInput): Promise<AnalyzeBirthChartOutput> {
  return analyzeBirthChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBirthChartPrompt',
  input: {schema: AnalyzeBirthChartInputSchema},
  output: {schema: AnalyzeBirthChartOutputSchema},
  prompt: `You are an expert astrologer. Analyze the following birth chart information and provide personalized insights. Focus on major planetary placements and aspects to offer guidance and understanding.  Consider the user's date, time and location of birth to create the birth chart.

Date of Birth: {{{dateOfBirth}}}
Time of Birth: {{{timeOfBirth}}}
Place of Birth: {{{placeOfBirth}}}

Provide insights that resonate with the user, helping them understand themselves better. Structure the response in short paragraphs.
`,
});

const analyzeBirthChartFlow = ai.defineFlow(
  {
    name: 'analyzeBirthChartFlow',
    inputSchema: AnalyzeBirthChartInputSchema,
    outputSchema: AnalyzeBirthChartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
