// types/list.ts
import { Types } from 'mongoose';
// models/list.ts
import { Schema, model, models } from 'mongoose';
export interface ListToolEntry {
  toolId?: Types.ObjectId;
  external?: {
    name: string;
    url: string;
  };
  note?: string;
}

export interface List {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  createdBy: Types.ObjectId;
  items: ListToolEntry[];
  createdAt: Date;
  updatedAt?: Date;
}



const listToolEntrySchema = new Schema({
  toolId: { type: Schema.Types.ObjectId, ref: 'Tool' },
  external: {
    name: { type: String },
    url: { type: String },
  },
  note: { type: String },
}, { _id: false });

const listSchema = new Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  createdBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items:       { type: [listToolEntrySchema], default: [] },
}, {
  timestamps: true,
});

export default models.List || model('List', listSchema);
