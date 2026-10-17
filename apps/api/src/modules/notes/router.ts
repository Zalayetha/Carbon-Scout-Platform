import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createLogger } from 'logger';
import { CreateNoteSchema, type Note } from './schema.js';

const logger = createLogger({ prefix: 'API:Notes' });

const notes: Note[] = [
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

export const noteRouter = new Hono()
  .get('/', (c) => {
    logger.info('Fetching all notes');
    return c.json(notes);
  })
  .post('/', zValidator('json', CreateNoteSchema), (c) => {
    const data = c.req.valid('json');
    const newNote: Note = {
      id: notes.length + 1,
      ...data,
    };
    notes.push(newNote);
    logger.info(`Created new note: #${newNote.id} - ${newNote.title}`);
    return c.json(newNote, 201);
  });