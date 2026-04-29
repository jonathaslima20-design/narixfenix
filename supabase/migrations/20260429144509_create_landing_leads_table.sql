/*
  # Create landing_leads table

  1. New Tables
    - `landing_leads`
      - `id` (uuid, pk)
      - `email` (text, required)
      - `source` (text, default 'landing')
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `landing_leads`
    - Policy allowing anonymous INSERTs (lead capture from public landing page)
    - No public SELECT/UPDATE/DELETE policies (protected by default)
*/

CREATE TABLE IF NOT EXISTS landing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'landing',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE landing_leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'landing_leads' AND policyname = 'Anyone can submit a landing lead'
  ) THEN
    CREATE POLICY "Anyone can submit a landing lead"
      ON landing_leads FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;
