import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is not set. Database queries may fail.');
}

export const sql = neon(process.env.DATABASE_URL || '');

export const db = {
  query: async <T = any>(text: string, params: any[] = []): Promise<T[]> => {
    // In newer @neondatabase/serverless, parameterized string queries must use sql.query(...)
    if (typeof (sql as any).query === 'function') {
      return (await (sql as any).query(text, params)) as T[];
    }
    // Fallback if neon function directly accepts arguments
    return (await (sql as any)(text, params)) as T[];
  }
};
