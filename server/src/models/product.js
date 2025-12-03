import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String },
    sku: { type: String },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [String],
    inventory: {
      stock: { type: Number, default: 0 },
      lowStockAlert: { type: Number, default: 5 }
    },
    attributes: { type: mongoose.Schema.Types.Mixed },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
