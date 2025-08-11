import mongoose from 'mongoose';

export interface IPremiumAccess {
  userId: string;
  type: 'blog' | 'app_listing';
  productId: number;
  variantId: number;
  orderId: number;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogPremiumAccess {
  userId: string;
  subscriptionId: number;
  status: 'active' | 'expired' | 'cancelled';
  plan: 'monthly' | 'yearly';
  startsAt: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppPremiumListing {
  userId: string;
  appId: string;
  orderId: number;
  status: 'active' | 'expired';
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const premiumAccessSchema = new mongoose.Schema<IPremiumAccess>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['blog', 'app_listing'], required: true },
    productId: { type: Number, required: true },
    variantId: { type: Number, required: true },
    orderId: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const blogPremiumAccessSchema = new mongoose.Schema<IBlogPremiumAccess>(
  {
    userId: { type: String, required: true, index: true },
    subscriptionId: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    plan: { type: String, enum: ['monthly', 'yearly'], required: true },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const appPremiumListingSchema = new mongoose.Schema<IAppPremiumListing>(
  {
    userId: { type: String, required: true, index: true },
    appId: { type: String, required: true, index: true },
    orderId: { type: Number, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for better query performance
premiumAccessSchema.index({ userId: 1, type: 1, status: 1 });
blogPremiumAccessSchema.index({ userId: 1, status: 1 });
appPremiumListingSchema.index({ userId: 1, appId: 1, status: 1 });

const PremiumAccess =
  (mongoose.models.PremiumAccess as mongoose.Model<IPremiumAccess>) ||
  mongoose.model<IPremiumAccess>('PremiumAccess', premiumAccessSchema);

const BlogPremiumAccess =
  (mongoose.models.BlogPremiumAccess as mongoose.Model<IBlogPremiumAccess>) ||
  mongoose.model<IBlogPremiumAccess>('BlogPremiumAccess', blogPremiumAccessSchema);

const AppPremiumListing =
  (mongoose.models.AppPremiumListing as mongoose.Model<IAppPremiumListing>) ||
  mongoose.model<IAppPremiumListing>('AppPremiumListing', appPremiumListingSchema);

export default PremiumAccess;
export { BlogPremiumAccess, AppPremiumListing };
// export type { IPremiumAccess, IBlogPremiumAccess, IAppPremiumListing };
