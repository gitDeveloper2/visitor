import { Schema, model, models,Types  } from 'mongoose';

export interface MiniBlog {
  _id: Types.ObjectId;
  toolId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  views: number;
  likes: number;
  performanceScore: number;
  pinned?: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}


const miniBlogSchema = new Schema<MiniBlog>({
  toolId:           { type: Schema.Types.ObjectId, ref: 'Tool', required: true },
  userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content:          { type: String, required: true },
  views:            { type: Number, default: 0 },
  likes:            { type: Number, default: 0 },
  performanceScore: { type: Number, default: 0 },
  pinned:           { type: Boolean, default: false },
  expiresAt:        { type: Date },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

export default models.MiniBlog || model<MiniBlog>('MiniBlog', miniBlogSchema);
