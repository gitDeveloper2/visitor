import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  type: 'app' | 'blog' | 'both';
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategory?: string; // For subcategories
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  stats?: {
    appCount: number;
    blogCount: number;
    totalViews: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['app', 'blog', 'both'],
    required: true,
    default: 'both'
  },
  description: {
    type: String,
    maxlength: 200
  },
  icon: {
    type: String,
    maxlength: 50
  },
  color: {
    type: String,
    maxlength: 7, // Hex color code
    default: '#1976d2'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  metadata: {
    seoTitle: String,
    seoDescription: String,
    keywords: [String]
  },
  stats: {
    appCount: { type: Number, default: 0 },
    blogCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
CategorySchema.index({ slug: 1 });
CategorySchema.index({ type: 1, isActive: 1 });
CategorySchema.index({ sortOrder: 1 });
CategorySchema.index({ parentCategory: 1 });

// Virtual for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Pre-save middleware to generate slug if not provided
CategorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 