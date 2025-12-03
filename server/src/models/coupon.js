import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ['percent', 'fixed'],
      default: 'percent'
    },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
