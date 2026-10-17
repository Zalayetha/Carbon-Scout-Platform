import type { Note, CreateNoteInput } from './schema.js';

export class NoteService {
  private notes: Note[] = [
    {
      id: 1,
      title: 'My First Note',
      content: 'This is a sample note using Hono + Zod + zValidator.',
    },
    {
      id: 2,
      title: 'Monorepo Setup',
      content: 'pnpm workspace configured successfully.',
    },
  ];

  async getAllNotes(): Promise<Note[]> {
    return this.notes;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    const newNote: Note = {
      id: this.notes.length + 1,
      ...input,
    };
    this.notes.push(newNote);
    return newNote;
  }
}

export const noteService = new NoteService();

