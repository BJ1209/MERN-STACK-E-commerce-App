import { Document, model, ObjectId, Schema, SchemaTypes } from 'mongoose';

interface ProductSchema {
  name: string;
  price: number;
  description: string;
  ratings: number;
  images: { imageURL: string }[];
  category: string;
  seller: string;
  stock: number;
  numOfReviews: number;
  user: ObjectId;
  reviews: { name: string; comment: string; rating: number }[];
  createdAt: Date;
}

// Setting up Schema for the product
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter the name'],
    trim: true,
    maxLength: [100, 'Product name can not exceed 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter the price'],
    maxLength: [5, 'Product price can not exceed 5 characters'],
    defult: 0.0,
  },
  description: {
    type: String,
    required: [true, 'Please enter the description'],
    trim: true,
    maxLength: [250, 'Product description can not exceed 250 characters'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      imageURL: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please select a category for your product'],
    enum: {
      values: [
        'electronics',
        'cameras',
        'laptop',
        'accessories',
        'headphones',
        'food',
        'books',
        'beauty',
        'cloths',
        'shoes',
        'sports',
        'outdoor',
        'indoor',
      ],
      message: 'Please select correct category for product',
    },
  },
  seller: {
    type: String,
    required: [true, 'Please enter the product seller'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter the product stock'],
    maxLength: [5, 'Product stock cannot exceed 5 characters'],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export type productType = ProductSchema & Document<any, any, ProductSchema>;

const productModel = model<ProductSchema>('product', productSchema);

export default productModel;
