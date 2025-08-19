'use server';

import { provideInsightInChat } from '@/ai/flows/provide-insight-in-chat';
import type { BirthData } from './types';
import { z } from 'zod';
import { format } from 'date-fns';

const ChatSchema = z.object({
  prompt: z.string().min(1, { message: 'Message cannot be empty.' }),
});

export async function getAiInsight(
  birthData: BirthData,
  prompt: string,
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  
  const validatedFields = ChatSchema.safeParse({ prompt });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0] || "Invalid input."
    };
  }

  try {
    const response = await provideInsightInChat({
      dateOfBirth: format(birthData.dateOfBirth, 'yyyy-MM-dd'),
      timeOfBirth: birthData.timeOfBirth,
      placeOfBirth: birthData.placeOfBirth,
      prompt: validatedFields.data.prompt,
    });
    return { success: true, message: response.insight };
  } catch (error) {
    console.error('Error getting AI insight:', error);
    return { success: false, error: 'I seem to have lost my cosmic connection. Please try again shortly.' };
  }
}
