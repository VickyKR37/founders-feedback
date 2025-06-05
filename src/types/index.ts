
// Removed: import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface Idea {
  id: string;
  founderId: string;
  founderName: string;
  title: string;
  problem: string;
  solution: string;
  createdAt: Date; // Changed from Timestamp
  commentCount: number; 
}

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date; // Changed from Timestamp
}

export interface BetaTestOffer {
  id: string;
  founderId: string;
  founderName: string;
  ideaId?: string; 
  title: string;
  mvpProblem: string;
  mvpSolution: string;
  price: string; 
  createdAt: Date; // Changed from Timestamp
  applicantCount?: number; 
}

export interface BetaTestApplicant {
  id: string;
  betaTestOfferId: string;
  testerId: string;
  testerName: string;
  testerEmail?: string; 
  appliedAt: Date; // Changed from Timestamp
  status: 'applied' | 'accepted' | 'rejected'; 
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: { [uid: string]: { displayName: string; photoURL?: string } };
  lastMessage?: Message;
  updatedAt: Date; // Changed from Timestamp
}

export interface Message {
  id:string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date; // Changed from Timestamp
}
