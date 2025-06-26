import { Schema, model, Document } from 'mongoose';
import { Room as RoomType, GameState } from '@magicschool/shared';

export interface RoomDocument extends Omit<RoomType, 'id'>, Document {
  _id: string;
}

const roomSchema = new Schema<RoomDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  players: [{
    type: String,
    required: true
  }],
  maxPlayers: {
    type: Number,
    required: true,
    min: 2,
    max: 2, // Currently only 1v1 games
    default: 2
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  gameState: {
    type: Schema.Types.Mixed,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
roomSchema.index({ isActive: 1, createdAt: -1 });
roomSchema.index({ players: 1 });

export const Room = model<RoomDocument>('Room', roomSchema);
