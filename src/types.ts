export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export interface Memory {
  id: string;
  authorId: string;
  authorName: string;
  reflection: string;
  imageUrl?: string;
  date: number; // timestamp
  x: number; // For star placement (0-100)
  y: number; // For star placement (0-100)
}
