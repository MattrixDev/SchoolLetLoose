import { Schema, model, Document } from 'mongoose';
import { Card as CardType, CardType as CardTypeEnum, ManaCost, CardEffect } from '../types';

export interface CardDocument extends Omit<CardType, 'id'>, Document {
  _id: string;
}

const manaCostSchema = new Schema<ManaCost>({
  math: { type: Number, default: 0 },
  german: { type: Number, default: 0 },
  english: { type: Number, default: 0 },
  french: { type: Number, default: 0 },
  latin: { type: Number, default: 0 },
  differentiation: { type: Number, default: 0 },
  learning: { type: Number, default: 0 }
}, { _id: false });

const cardEffectSchema = new Schema<CardEffect>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  trigger: { type: String, required: true },
  parameters: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const cardSchema = new Schema<CardDocument>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  type: { 
    type: String,
    required: true,
    enum: Object.values(CardTypeEnum)
  },
  manaCost: {
    type: manaCostSchema,
    required: true
  },
  attack: {
    type: Number,
    min: 0,
    max: 20,
    validate: {
      validator: function(this: CardDocument, value: number) {
        // Only creatures can have attack
        return this.type === CardTypeEnum.CREATURE ? value >= 0 : value === undefined;
      },
      message: 'Only creatures can have attack values'
    }
  },
  defense: {
    type: Number,
    min: 0,
    max: 20,
    validate: {
      validator: function(this: CardDocument, value: number) {
        // Only creatures can have defense
        return this.type === CardTypeEnum.CREATURE ? value >= 0 : value === undefined;
      },
      message: 'Only creatures can have defense values'
    }
  },
  effects: [cardEffectSchema],
  artworkUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Artwork URL must be a valid HTTP/HTTPS URL'
    }
  },
  createdBy: {
    type: String,
    default: 'system'
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

// Indexes for better query performance
cardSchema.index({ name: 1 });
cardSchema.index({ type: 1 });
cardSchema.index({ createdAt: -1 });
cardSchema.index({ createdBy: 1 });

export const Card = model<CardDocument>('Card', cardSchema);
