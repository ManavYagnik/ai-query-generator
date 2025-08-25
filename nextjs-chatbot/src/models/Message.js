import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot', 'system'],
  },
  text: {
    type: String,
    required: true,
  },
  database: {
    type: String,
    enum: ['MongoDB', 'PostgreSQL', 'MySQL', null],
    default: null,
  },
  schema: {
    type: String,
    default: null,
  },
  timestamp: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
messageSchema.index({ userId: 1, timestamp: 1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
