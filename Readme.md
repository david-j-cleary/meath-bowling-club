# Meath Bowling Club

A small Astro site for the Meath Bowling Club, including member login and club content.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```
   or create `.env.local` manually.
3. Add your Supabase values:
   ```env
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Supabase wiring

This project uses `src/lib/supabase.ts` as the main Supabase client helper.
Client-side components import `supabase` from there for auth and data access.

## Notes

- Make sure `.env.local` is ignored by Git. The repo `.gitignore` already ignores `.env.*` files.
- The `PUBLIC_` prefix is required for Astro to expose the variables to browser code.
