/*
  # Additional performance indexes

  Adds indexes on foreign-key-like columns frequently used by admin aggregations
  and by the new RPC functions. Safe to re-run.

  1. New indexes
    - `idx_whatsapp_instances_user_created` on `whatsapp_instances(user_id, created_at)`
    - `idx_whatsapp_instances_status` on `whatsapp_instances(status)`
    - `idx_campaigns_user_created` on `campaigns(user_id, created_at DESC)`
    - `idx_message_templates_user` on `message_templates(user_id)`
    - `idx_client_subscriptions_user` on `client_subscriptions(user_id)`
    - `idx_client_subscriptions_status` on `client_subscriptions(status)`
    - `idx_leads_category` on `leads(category)` (global counts without user_id)
    - `idx_leads_created` on `leads(created_at)` (admin period filters)
    - `idx_profiles_role_created` on `profiles(role, created_at)`
    - `idx_whatsapp_send_logs_error_created` on `whatsapp_send_logs(error_message, created_at)` (partial WHERE error_message is not null)
*/

CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_user_created
  ON whatsapp_instances (user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_status
  ON whatsapp_instances (status);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_created
  ON campaigns (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_message_templates_user
  ON message_templates (user_id);

CREATE INDEX IF NOT EXISTS idx_client_subscriptions_user
  ON client_subscriptions (user_id);

CREATE INDEX IF NOT EXISTS idx_client_subscriptions_status
  ON client_subscriptions (status);

CREATE INDEX IF NOT EXISTS idx_leads_category
  ON leads (category);

CREATE INDEX IF NOT EXISTS idx_leads_created
  ON leads (created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_role_created
  ON profiles (role, created_at);

CREATE INDEX IF NOT EXISTS idx_whatsapp_send_logs_error_created
  ON whatsapp_send_logs (created_at)
  WHERE error_message IS NOT NULL;
