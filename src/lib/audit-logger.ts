import { supabase } from './supabase-client';
import { getCurrentUser } from './supabase-auth';

export type AuditLogEventType = 'create' | 'update' | 'delete';

export interface AuditLogEntry {
  event_type: AuditLogEventType;
  resource: string;
  resource_id?: string;
  previous_state?: any;
  new_state?: any;
  outcome: string;
}

/**
 * Logs an event to the audit_logs table.
 * @param entry Audit log entry details
 */
export const logAuditEvent = async (entry: AuditLogEntry) => {
  try {
    // Get the current user
    const user = await getCurrentUser();
    let displayName = 'Unknown';
    if (user) {
      displayName = user.user_metadata?.name || user.user_metadata?.display_name || user.email || 'Unknown';
    }

    // Insert into audit_logs
    const { error } = await supabase.from('audit_logs').insert([
      {
        display_name: displayName,
        event_type: entry.event_type,
        resource: entry.resource,
        resource_id: entry.resource_id || null,
        previous_state: entry.previous_state ? JSON.stringify(entry.previous_state) : null,
        new_state: entry.new_state ? JSON.stringify(entry.new_state) : null,
        outcome: entry.outcome,
      },
    ]);

    if (error) {
      // Optionally, you could send this error to an error monitoring service
      console.error('Audit log insert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Audit log unexpected error:', err);
    return false;
  }
}; 