import { Document, Schema, model, models } from 'mongoose';

interface IApp {
  name: string;
  description: string;
  author: string;
  badges: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

interface IAppDocument extends IApp, Document {}

const appSchema = new Schema<IAppDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    badges: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const App = models.App || model<IAppDocument>('App', appSchema);

export default App;
export type { IApp, IAppDocument };
