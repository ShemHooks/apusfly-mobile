export type Message = {
  id: string;
  conversationId: string;
  sender: "customer" | "provider";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  providerName: string;
  providerInitials: string;
  service: string;
  bookingReference?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export const mockConversations: Conversation[] = [
  {
    id: "1",
    providerName: "SkyVista Aerial",
    providerInitials: "SV",
    service: "Aerial Photography",
    bookingReference: "APF-2026-001",
    lastMessage: "We can accommodate your booking on October 18.",
    lastMessageTime: "10:42 AM",
    unreadCount: 2,
  },
  {
    id: "2",
    providerName: "AgriWing Drone Solutions",
    providerInitials: "AW",
    service: "Agricultural Survey",
    bookingReference: "APF-2026-002",
    lastMessage: "Could you share the estimated land area?",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
  },
  {
    id: "3",
    providerName: "DroneFrame Studios",
    providerInitials: "DF",
    service: "Aerial Videography",
    bookingReference: "APF-2026-003",
    lastMessage: "Thank you for choosing our services!",
    lastMessageTime: "Sep 28",
    unreadCount: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    conversationId: "1",
    sender: "customer",
    text: "Hi! I'm interested in your aerial photography service.",
    time: "10:30 AM",
  },
  {
    id: "m2",
    conversationId: "1",
    sender: "provider",
    text: "Hello! We'd be happy to help. What date are you planning?",
    time: "10:34 AM",
  },
  {
    id: "m3",
    conversationId: "1",
    sender: "customer",
    text: "October 18, around 9 AM. Is that available?",
    time: "10:38 AM",
  },
  {
    id: "m4",
    conversationId: "1",
    sender: "provider",
    text: "We can accommodate your booking on October 18.",
    time: "10:42 AM",
  },
  {
    id: "m5",
    conversationId: "2",
    sender: "customer",
    text: "Good day! I'd like to inquire about agricultural surveying.",
    time: "Yesterday",
  },
  {
    id: "m6",
    conversationId: "2",
    sender: "provider",
    text: "Could you share the estimated land area?",
    time: "Yesterday",
  },
  {
    id: "m7",
    conversationId: "3",
    sender: "provider",
    text: "Thank you for choosing our services!",
    time: "Sep 28",
  },
];
