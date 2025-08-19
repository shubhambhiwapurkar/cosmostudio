export type BirthData = {
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
