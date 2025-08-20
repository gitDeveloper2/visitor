import mongoose, { Schema, model, models, Types } from 'mongoose';

export interface ILaunchBooking {
  appId: Types.ObjectId;
  isPremium: boolean;
  bookedAt: Date;
}

export interface ILaunchSlot extends mongoose.Document {
  date: string; // UTC YYYY-MM-DD
  cap: number; // daily capacity
  bookings: ILaunchBooking[];
  numNonPremium: number;
  updatedAt: Date;
}

const bookingSchema = new Schema<ILaunchBooking>({
  appId: { type: Schema.Types.ObjectId, required: true, ref: 'App' },
  isPremium: { type: Boolean, required: true },
  bookedAt: { type: Date, default: () => new Date() },
});

const launchSlotSchema = new Schema<ILaunchSlot>({
  date: { type: String, required: true, unique: true, index: true },
  cap: { type: Number, required: true, default: 3 },
  bookings: { type: [bookingSchema], default: [] },
  numNonPremium: { type: Number, default: 0 },
  updatedAt: { type: Date, default: () => new Date() },
});

launchSlotSchema.index({ date: 1 });

const LaunchSlot = (models.LaunchSlot as mongoose.Model<ILaunchSlot>) || model<ILaunchSlot>('LaunchSlot', launchSlotSchema);

export default LaunchSlot;