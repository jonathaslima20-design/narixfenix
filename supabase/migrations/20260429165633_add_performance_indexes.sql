/*
  # Performance indexes for hot query paths

  Adds composite indexes aligned with the most frequent query patterns in the
  frontend. These speed up list loading (Inbox, CRM, Audit) and chat messages
  without changing any data or schema semantics.

  1. New indexes
    - `idx_leads_user_activity` on `leads(user_id, last_activity_at DESC NULLS LAST)`
      Speeds up InboxPage and LeadsPage ordering by most recent activity.
    - `idx_leads_user_category` on `leads(user_id, category)`
      Speeds up dashboard temperature counts (cold/warm/hot) and CRM kanban grouping.
    - `idx_leads_user_archived_activity` on `leads(user_id, is_archived, last_activity_at DESC NULLS LAST)`
      Speeds up archived/unarchived filter combined with ordering.
    - `idx_messages_lead_created` on `messages(lead_id, created_at DESC)`
      Speeds up ChatPanel message loading (ORDER BY created_at DESC LIMIT 80).
    - `idx_lead_activities_lead_created` on `lead_activities(lead_id, created_at DESC)`
      Speeds up LeadDetailsDrawer activity tab.
    - `idx_lead_notes_lead_created` on `lead_notes(lead_id, created_at DESC)`
      Speeds up LeadDetailsDrawer notes tab.
    - `idx_admin_audit_logs_created` on `admin_audit_logs(created_at DESC)`
      Speeds up AuditLogs page ordering and period filtering.

  2. Notes
    All indexes are created with `IF NOT EXISTS` to be idempotent and safe to re-run.
*/

CREATE INDEX IF NOT EXISTS idx_leads_user_activity
  ON leads (user_id, last_activity_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_leads_user_category
  ON leads (user_id, category);

CREATE INDEX IF NOT EXISTS idx_leads_user_archived_activity
  ON leads (user_id, is_archived, last_activity_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_messages_lead_created
  ON messages (lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_created
  ON lead_activities (lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_created
  ON lead_notes (lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created
  ON admin_audit_logs (created_at DESC);
