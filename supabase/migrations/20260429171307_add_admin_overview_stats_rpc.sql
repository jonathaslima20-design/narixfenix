/*
  # Admin Overview Stats RPC

  Creates a SECURITY DEFINER function that returns all KPIs displayed on
  AdminOverview page in a single call. Replaces 12+ parallel COUNT queries.

  1. New function
    - `admin_overview_stats(period_days int)` returns a single row of aggregated
      counts for the current period and the immediately previous period, plus
      WhatsApp health counts and lead category temperature counts.

  2. Security
    - Callable only by admins. Enforced inside the function body via the
      profiles.role column check against auth.uid().
*/

CREATE OR REPLACE FUNCTION public.admin_overview_stats(period_days int DEFAULT 30)
RETURNS TABLE (
  total_users bigint,
  new_users bigint,
  prev_new_users bigint,
  total_instances bigint,
  connected_instances bigint,
  total_leads bigint,
  new_leads bigint,
  prev_new_leads bigint,
  failed_sends bigint,
  cold_leads bigint,
  warm_leads bigint,
  hot_leads bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  current_start timestamptz;
  previous_start timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT (role = 'admin') INTO is_admin FROM profiles WHERE profiles.id = auth.uid();
  IF COALESCE(is_admin, false) = false THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  current_start := now() - make_interval(days => period_days);
  previous_start := now() - make_interval(days => period_days * 2);

  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles WHERE role = 'user'),
    (SELECT COUNT(*) FROM profiles WHERE role = 'user' AND created_at >= current_start),
    (SELECT COUNT(*) FROM profiles WHERE role = 'user' AND created_at >= previous_start AND created_at < current_start),
    (SELECT COUNT(*) FROM whatsapp_instances),
    (SELECT COUNT(*) FROM whatsapp_instances WHERE status = 'connected'),
    (SELECT COUNT(*) FROM leads),
    (SELECT COUNT(*) FROM leads WHERE created_at >= current_start),
    (SELECT COUNT(*) FROM leads WHERE created_at >= previous_start AND created_at < current_start),
    (SELECT COUNT(*) FROM whatsapp_send_logs WHERE error_message IS NOT NULL AND created_at >= current_start),
    (SELECT COUNT(*) FROM leads WHERE category = 'cold'),
    (SELECT COUNT(*) FROM leads WHERE category = 'warm'),
    (SELECT COUNT(*) FROM leads WHERE category = 'hot');
END;
$$;

REVOKE ALL ON FUNCTION public.admin_overview_stats(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_overview_stats(int) TO authenticated;
