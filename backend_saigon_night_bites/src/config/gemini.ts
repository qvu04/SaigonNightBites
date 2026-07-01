import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw new Error('Missing GROQ_API_KEY environment variable');

export const groqClient = new Groq({ apiKey });

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
