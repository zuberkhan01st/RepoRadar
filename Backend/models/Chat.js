const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // Human user (reference to User model)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Chatbot/AI identifier
  botId: {
    type: String,
    enum: ['github-assistant', 'claude', 'chatgpt', 'custom-ai'], // Updated to match controller
    required: function () {
      return !this.recipientUserId;
    }
  },
  // Optional: For human-to-human chats
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return !this.botId;
    }
  },
  // Message content
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000 // Prevent overly long messages
  },
  // Sender type
  senderType: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  // Context for GitHub-related chats
  context: {
    owner: {
      type: String,
      trim: true,
      maxlength: 100
    },
    repo: {
      type: String,
      trim: true,
      maxlength: 100
    },
    issueId: {
      type: Number,
      min: 0
    },
    pullRequestId: {
      type: Number,
      min: 0
    },
    selectedTool: {
      type: String,
      trim: true,
      maxlength: 50
    }
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
chatSchema.index({ userId: 1, botId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, 'context.repo': 1, createdAt: -1 });
chatSchema.index({ userId: 1, recipientUserId: 1, createdAt: -1 });

// Update timestamp on save
chatSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Validate that either botId or recipientUserId is provided
chatSchema.pre('validate', function (next) {
  if (!this.botId && !this.recipientUserId) {
    next(new Error('Either botId or recipientUserId must be provided'));
  }
  if (this.botId && this.recipientUserId) {
    next(new Error('Cannot provide both botId and recipientUserId'));
  }
  next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;