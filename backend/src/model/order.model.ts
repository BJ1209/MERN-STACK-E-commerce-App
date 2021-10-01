import { Schema, model, Document, SchemaTypes, ObjectId } from 'mongoose';

interface IShippingInfo {
  address: string;
  city: string;
  phoneNo: string;
  postalCode: string;
  country: string;
}
interface IPaymentInfo {
  id: string;
  status: string;
}
interface Order {
  name: string;
  price: number;
  image: string;
  quantity: string;
  productId: ObjectId;
}

interface IOrder extends Document {
  shippingInfo: IShippingInfo;
  userId: ObjectId;
  orderItems: Order[];
  paymentInfo: IPaymentInfo;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: string;
  paidAt: Date;
  deliveredAt: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  userId: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'user',
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productId: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'product',
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paidAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'processing',
  },
  deliveredAt: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<IOrder & Document>('order', OrderSchema);
