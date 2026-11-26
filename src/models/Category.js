import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Category identifier is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '🛒',
    },
    color: {
      type: String,
      default: '#4CAF50',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
