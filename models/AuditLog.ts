import mongoose, { Schema, models } from 'mongoose';

const auditLogSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  actorEmail: { type: String },
  action: { type: String, required: true },
  resourceType: { type: String },
  resourceId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed },
}, { timestamps: true });

const AuditLog = models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
