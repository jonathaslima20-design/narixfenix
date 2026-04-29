/*
  # Add RPC for aggregated lead stats

  Creates a SECURITY DEFINER function that returns cold/warm/hot/total lead counts
  in a single query (using conditional aggregation) for a given user. Replaces 4
  separate COUNT queries in DashboardHome.

  1. New functions
    - `get_user_lead_stats(user_uuid uuid)` returns `(cold int, warm int, hot int, total int)`.
      Runs as SECURITY DEFINER; internally checks that the caller is either the owner of
      the user_uuid or an admin before returning counts.

  2. Security
    - EXECUTE granted to `authenticated` role only.
    - Function body enforces auth.uid() matches user_uuid OR caller has admin role.
*/

CREATE OR REPLACE FUNCTION public.get_user_lead_stats(user_uuid uuid)
RETURNS TABLE (cold int, warm int, hot int, total int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT (role = 'admin') INTO is_admin FROM profiles WHERE id = auth.uid();

  IF auth.uid() <> user_uuid AND COALESCE(is_admin, false) = false THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN category = 'cold' THEN 1 ELSE 0 END), 0)::int AS cold,
    COALESCE(SUM(CASE WHEN category = 'warm' THEN 1 ELSE 0 END), 0)::int AS warm,
    COALESCE(SUM(CASE WHEN category = 'hot' THEN 1 ELSE 0 END), 0)::int AS hot,
    COUNT(*)::int AS total
  FROM leads
  WHERE user_id = user_uuid;
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_lead_stats(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_lead_stats(uuid) TO authenticated;
