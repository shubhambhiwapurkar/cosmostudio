'use server';

import { ChatAPI } from './chat-api';
import type { BirthData } from './types';
import { z } from 'zod';

// TODO: Implement a proper way to get the auth token
const getToken = async () => 'dummy-token';

const ChatSchema = z.object({
  prompt: z.string().min(1, { message: 'Message cannot be empty.' }),
});

export async function createSession(birthData: BirthData) {
  const token = await getToken();
  const api = new ChatAPI(token);
  return api.createSession('Chat with AI Astrologer', { birthData });
}

export async function sendMessage(sessionId: string, prompt: string) {
  const validatedFields = ChatSchema.safeParse({ prompt });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors.prompt || "Invalid input."
    };
  }

  try {
    const token = await getToken();
    const api = new ChatAPI(token);
    const response = await api.sendMessage(sessionId, validatedFields.data.prompt);
    return { success: true, message: response.content };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'I seem to have lost my cosmic connection. Please try again shortly.' };
  }
}

export async function getMessages(sessionId: string) {
  const token = await getToken();
  const api = new ChatAPI(token);
  return api.getMessages(sessionId);
}
