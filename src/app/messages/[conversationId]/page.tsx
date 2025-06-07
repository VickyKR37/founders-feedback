
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import type { Conversation, Message as MessageType, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Mock data for a single conversation and its messages
const mockConversationDetail: Conversation = {
  id: 'convo1',
  participantIds: ['mockUserId', 'testerUser1'],
  participants: {
    'mockUserId': { displayName: 'Test User', photoURL: 'https://placehold.co/40x40.png?text=TU' },
    'testerUser1': { displayName: 'Charlie Tester', photoURL: 'https://placehold.co/40x40.png?text=CT' },
  },
  updatedAt: new Date(),
};

const mockMessages: MessageType[] = [
  { id: 'msg1', conversationId: 'convo1', senderId: 'testerUser1', text: 'Hey, I am interested in testing your AI Story Generator!', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'msg2', conversationId: 'convo1', senderId: 'mockUserId', text: 'Great! Thanks for reaching out, Charlie. What specifically interests you?', createdAt: new Date(Date.now() - 1000 * 60 * 28) },
  { id: 'msg3', conversationId: 'convo1', senderId: 'testerUser1', text: 'The personalization aspect and the potential for educational content.', createdAt: new Date(Date.now() - 1000 * 60 * 25) },
  { id: 'msg4', conversationId: 'convo1', senderId: 'mockUserId', text: 'Awesome. The beta access costs $5. It includes 3 months of Pro access once we launch fully. Are you still interested?', createdAt: new Date(Date.now() - 1000 * 60 * 20) },
];

async function sendMessageAction(conversationId: string, senderId: string, text: string): Promise<{ success: boolean; message?: MessageType; error?: string }> {
  console.log("Sending message:", { conversationId, senderId, text });
  await new Promise(resolve => setTimeout(resolve, 300));
  const newMessage: MessageType = {
    id: `mockMsg${Date.now()}`,
    conversationId,
    senderId,
    text,
    createdAt: new Date(),
  };
  return { success: true, message: newMessage };
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push(`/auth/signin?redirect=/messages/${conversationId}`);
      return;
    }

    if (conversationId) {
      setIsLoading(true);
      // Simulate fetching conversation details and messages
      setTimeout(() => {
        if (conversationId === mockConversationDetail.id) { // Check if mock data matches
            setConversation(mockConversationDetail);
            setMessages(mockMessages.filter(m => m.conversationId === conversationId));
        } else {
            setConversation(null); // Or handle "conversation not found"
            toast({ title: "Conversation not found", variant: "destructive"});
        }
        setIsLoading(false);
      }, 500);
    }
  }, [conversationId, user, userLoading, router, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversation) return;

    setIsSending(true);
    try {
        const result = await sendMessageAction(conversation.id, user.uid, newMessage);
        if (result.success && result.message) {
            setMessages(prev => [...prev, result.message!]);
            setNewMessage('');
        } else {
            throw new Error(result.error || "Failed to send message.");
        }
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive"});
    } finally {
        setIsSending(false);
    }
  };

  if (isLoading || userLoading) {
    return <div className="flex justify-center items-center h-full"><p>Loading conversation...</p></div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-full"><p>Redirecting to sign in...</p></div>;
  }

  if (!conversation) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Conversation not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/messages"><ArrowLeft className="mr-2 h-4 w-4" />Back to messages</Link>
        </Button>
      </div>
    );
  }
  
  const otherParticipantId = conversation.participantIds.find(id => id !== user.uid);
  const otherParticipant = otherParticipantId ? conversation.participants[otherParticipantId] : { displayName: 'Unknown User' };


  return (
    <div className="flex flex-col h-[calc(100vh-4rem-4rem)] max-w-3xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden border"> {/* Adjust height as needed */}
      {/* Header */}
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push('/messages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 border mr-3">
          <AvatarImage src={otherParticipant.photoURL || `https://placehold.co/40x40.png?text=${otherParticipant.displayName.charAt(0)}`} alt={otherParticipant.displayName} data-ai-hint="profile avatar" />
          <AvatarFallback>{otherParticipant.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{otherParticipant.displayName}</h2>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end space-x-2 max-w-[75%]",
              msg.senderId === user.uid ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
            )}
          >
            <Avatar className={cn("h-8 w-8 border", msg.senderId === user.uid ? "ml-2" : "mr-2")}>
               <AvatarImage src={conversation.participants[msg.senderId]?.photoURL || `https://placehold.co/32x32.png?text=${conversation.participants[msg.senderId]?.displayName.charAt(0)}`} alt={conversation.participants[msg.senderId]?.displayName} data-ai-hint="profile avatar small" />
              <AvatarFallback>{conversation.participants[msg.senderId]?.displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "p-3 rounded-lg shadow",
                msg.senderId === user.uid
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className={cn(
                  "text-xs mt-1",
                   msg.senderId === user.uid ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                )}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button" disabled> {/* Placeholder */}
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            autoComplete="off"
          />
           <Button variant="ghost" size="icon" type="button" disabled> {/* Placeholder */}
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
