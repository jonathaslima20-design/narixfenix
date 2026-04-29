/*
  # Admin Client List with Stats RPC

  Creates a SECURITY DEFINER function that returns all clients (profiles with
  role='user') enriched with aggregated stats (instance info, instance count,
  lead count, campaign count, template count, subscription + plan details) in
  a single query. Replaces the N+1 pattern in ClientManagement where 6 queries
  were executed per profile.

  1. New functions
    - `admin_list_clients_with_stats()` returns a table of client rows.
      Enforces that only admins can call it.

  2. Security
    - EXECUTE granted only to `authenticated`.
    - Internally raises an exception if the caller is not an admin.
*/

CREATE OR REPLACE FUNCTION public.admin_list_clients_with_stats()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz,
  updated_at timestamptz,
  is_enabled boolean,
  max_whatsapp_instances_override integer,
  instance_status text,
  instance_phone text,
  instance_send_mode text,
  instance_count bigint,
  lead_count bigint,
  campaign_count bigint,
  template_count bigint,
  subscription_id uuid,
  plan_id uuid,
  plan_name text,
  plan_slug text,
  plan_max_sends integer,
  plan_max_instances integer,
  max_instances_override integer,
  sub_status text,
  sub_started_at timestamptz,
  sub_expires_at timestamptz,
  sub_cancelled_at timestamptz,
  sub_notes text,
  send_count integer
)
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

  SELECT (role = 'admin') INTO is_admin FROM profiles WHERE profiles.id = auth.uid();

  IF COALESCE(is_admin, false) = false THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
  WITH first_inst AS (
    SELECT DISTINCT ON (wi.user_id)
      wi.user_id,
      wi.status,
      wi.phone_number,
      wi.send_mode
    FROM whatsapp_instances wi
    ORDER BY wi.user_id, wi.created_at ASC
  ),
  inst_count AS (
    SELECT user_id, COUNT(*)::bigint AS c FROM whatsapp_instances GROUP BY user_id
  ),
  lead_count AS (
    SELECT user_id, COUNT(*)::bigint AS c FROM leads GROUP BY user_id
  ),
  camp_count AS (
    SELECT user_id, COUNT(*)::bigint AS c FROM campaigns GROUP BY user_id
  ),
  tpl_count AS (
    SELECT user_id, COUNT(*)::bigint AS c FROM message_templates GROUP BY user_id
  )
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    p.updated_at,
    p.is_enabled,
    p.max_whatsapp_instances_override,
    COALESCE(fi.status, 'disconnected') AS instance_status,
    COALESCE(fi.phone_number, '') AS instance_phone,
    COALESCE(fi.send_mode, 'manual') AS instance_send_mode,
    COALESCE(ic.c, 0) AS instance_count,
    COALESCE(lc.c, 0) AS lead_count,
    COALESCE(cc.c, 0) AS campaign_count,
    COALESCE(tc.c, 0) AS template_count,
    cs.id AS subscription_id,
    cs.plan_id,
    COALESCE(pl.name, 'Sem plano') AS plan_name,
    pl.slug AS plan_slug,
    COALESCE(pl.max_sends, -1) AS plan_max_sends,
    COALESCE(pl.max_whatsapp_instances, 1) AS plan_max_instances,
    cs.max_instances_override,
    cs.status AS sub_status,
    cs.started_at AS sub_started_at,
    cs.expires_at AS sub_expires_at,
    cs.cancelled_at AS sub_cancelled_at,
    COALESCE(cs.notes, '') AS sub_notes,
    COALESCE(cs.send_count, 0) AS send_count
  FROM profiles p
  LEFT JOIN first_inst fi ON fi.user_id = p.id
  LEFT JOIN inst_count ic ON ic.user_id = p.id
  LEFT JOIN lead_count lc ON lc.user_id = p.id
  LEFT JOIN camp_count cc ON cc.user_id = p.id
  LEFT JOIN tpl_count tc ON tc.user_id = p.id
  LEFT JOIN client_subscriptions cs ON cs.user_id = p.id
  LEFT JOIN plans pl ON pl.id = cs.plan_id
  WHERE p.role = 'user'
  ORDER BY p.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_clients_with_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_clients_with_stats() TO authenticated;
