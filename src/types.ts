export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  category: string;
  annotations?: Annotation[];
  isFavorite?: boolean;
}

export interface Annotation {
  id: string;
  type: 'text' | 'handwriting';
  content: string;
  createdAt: string;
  position?: { x: number; y: number };
}

export interface AIAnswer {
  answer: string;
  sources: { noteId: string; title: string; snippet: string }[];
}
