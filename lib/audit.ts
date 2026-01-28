import AuditLog from '@/models/AuditLog';

export async function logAudit({ actorId, actorEmail, action, resourceType, resourceId, details }: any) {
  try {
    const entry = new AuditLog({ actorId, actorEmail, action, resourceType, resourceId, details });
    await entry.save();
  } catch (err) {
    // non-blocking: log to console
    console.error('Failed to write audit log', err);
  }
}

export default logAudit;
