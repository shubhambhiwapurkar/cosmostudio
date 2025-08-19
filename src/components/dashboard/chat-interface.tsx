
"use client";

import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Bot, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { getAiInsight } from '@/lib/actions';
import type { BirthData, ChatMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';

const initialMessages: ChatMessage[] = [
    {
      id: 'init1',
      role: 'assistant',
      content: "Welcome, stargazer! I've analyzed your cosmic blueprint. What secrets of the universe shall we uncover first? You can start by asking about your life's purpose.",
    }
];

const initialPrompt = "What do my Sun and Moon signs mean together?";

export default function ChatInterface({ birthData }: { birthData: BirthData }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add a bit of delay for the animation to be noticeable
    setTimeout(async () => {
        const result = await getAiInsight(birthData, input);
        
        if (result.success) {
          const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: result.message };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: result.error,
          });
          // Restore user input if submission fails
          const lastMessage = messages[messages.length -1];
          if(lastMessage.id === userMessage.id) {
            setMessages(prev => prev.slice(0, prev.length -1));
          }
          setInput(userMessage.content);
        }
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500", message.role === 'user' && 'justify-end')}>
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 border border-primary/50">
                    <div className="flex h-full w-full items-center justify-center bg-primary/20 text-primary">
                        <Logo className='h-5 w-5' />
                    </div>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                  "max-w-md xl:max-w-lg rounded-lg p-3 text-sm whitespace-pre-wrap shadow",
                  message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'
              )}>
                {message.content}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 border">
                    <div className="flex h-full w-full items-center justify-center bg-background">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 animate-in fade-in-0 duration-500">
               <Avatar className="h-8 w-8 border border-primary/50">
                    <div className="flex h-full w-full items-center justify-center bg-primary/20 text-primary">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              <div className="max-w-lg rounded-lg p-3 bg-muted flex items-center space-x-2">
                <span className="text-sm">Consulting the cosmos...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="px-2 pb-20 lg:pb-0">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your life's purpose..."
            className="pr-16 min-h-[52px] resize-none"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                }
            }}
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2" disabled={isLoading || !input.trim()}>
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
