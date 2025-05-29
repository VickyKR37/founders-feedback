
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
  createdAt: Date; // Or Firebase Timestamp
  commentCount?: number; // Denormalized or calculated
}

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date; // Or Firebase Timestamp
}

export interface BetaTestOffer {
  id: string;
  founderId: string;
  founderName: string;
  ideaId?: string; // Optional link to an existing idea
  title: string;
  mvpProblem: string;
  mvpSolution: string;
  price: string; // e.g., "Free", "$10/month", "One-time $50"
  createdAt: Date; // Or Firebase Timestamp
  applicantCount?: number; // Denormalized or calculated
}

export interface BetaTestApplicant {
  id: string;
  betaTestOfferId: string;
  testerId: string;
  testerName: string;
  testerEmail?: string; // For founder to contact
  appliedAt: Date; // Or Firebase Timestamp
  status: 'applied' | 'accepted' | 'rejected'; // Optional for more advanced flows
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: { [uid: string]: { displayName: string; photoURL?: string } };
  lastMessage?: Message;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date; // Or Firebase Timestamp
}
