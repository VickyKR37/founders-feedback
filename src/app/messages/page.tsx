
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import type { Conversation } from '@/types';
import { MessageSquarePlus, Inbox } from 'lucide-react';

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 'convo1',
    participantIds: ['mockUserId', 'testerUser1'],
    participants: {
      'mockUserId': { displayName: 'Test User', photoURL: 'https://placehold.co/40x40.png?text=TU' },
      'testerUser1': { displayName: 'Charlie Tester', photoURL: 'https://placehold.co/40x40.png?text=CT' },
    },
    lastMessage: { id: 'msg1', conversationId: 'convo1', senderId: 'testerUser1', text: 'Hey, I am interested in testing your AI Story Generator!', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'convo2',
    participantIds: ['mockUserId', 'testerUser2'],
    participants: {
      'mockUserId': { displayName: 'Test User' },
      'testerUser2': { displayName: 'Dana Developer', photoURL: 'https://placehold.co/40x40.png?text=DD' },
    },
    lastMessage: { id: 'msg2', conversationId: 'convo2', senderId: 'mockUserId', text: 'Thanks for applying! Let\'s chat.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];


export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/auth/signin?redirect=/messages');
      return;
    }
    
    setIsLoading(true);
    // Simulate fetching conversations for the current user
    setTimeout(() => {
      // Filter conversations where the current user is a participant
      const userConversations = mockConversations.filter(convo => convo.participantIds.includes(user.uid));
      setConversations(userConversations);
      setIsLoading(false);
    }, 500);

  }, [user, userLoading, router]);

  if (userLoading || isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Loading messages...</p></div>;
  }
  
  if (!user) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Redirecting to sign in...</p></div>;
  }

  const getOtherParticipant = (convo: Conversation) => {
    const otherId = convo.participantIds.find(id => id !== user.uid);
    return otherId ? convo.participants[otherId] : { displayName: 'Unknown User', photoURL: undefined };
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl">Messages</CardTitle>
                <CardDescription>Your conversations with other users.</CardDescription>
            </div>
            <Button variant="outline" disabled> {/* New message functionality complex for now */}
                <MessageSquarePlus className="mr-2 h-4 w-4"/> New Message
            </Button>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <div className="text-center py-10">
              <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no messages yet.</p>
              <p className="text-sm text-muted-foreground">Start a conversation by messaging a beta test applicant.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {conversations.map((convo) => {
                const otherParticipant = getOtherParticipant(convo);
                return (
                  <li key={convo.id}>
                    <Link href={`/messages/${convo.id}`} className="block hover:bg-muted/50 p-4 border rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={otherParticipant.photoURL || `https://placehold.co/48x48.png?text=${otherParticipant.displayName.charAt(0)}`} alt={otherParticipant.displayName} data-ai-hint="profile avatar" />
                          <AvatarFallback>{otherParticipant.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-foreground truncate">{otherParticipant.displayName}</p>
                            {convo.lastMessage && <p className="text-xs text-muted-foreground">{new Date(convo.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
                          </div>
                          {convo.lastMessage && <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>}
                           {!convo.lastMessage && <p className="text-sm text-muted-foreground italic">No messages yet</p>}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
