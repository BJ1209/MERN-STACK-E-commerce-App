import { NextFunction, Request, Response } from 'express';
import Product from '../model/product.model';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({}).select({ __v: 0 });

  if (products.length < 1) {
    return res.status(200).json({ success: true, message: 'No Products Found' });
  }

  const responseObject = {
    success: true,
    message: 'All Products',
    productCount: products.length,
    products: products.map((product) => {
      return {
        ...product,
        request: {
          url: `http://localhost:4000/api/v1/products/${product.id}`,
          request: 'GET',
          message: 'Get single product detail',
        },
      };
    }),
  };

  res.status(200).json(responseObject);
};

export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, price, description, category, seller, stock } = req.body;

  const newProduct = new Product({
    name,
    price,
    description,
    category,
    seller,
    stock,
  });

  await newProduct.save();
  res.status(201).json({ success: true, message: 'Product created' });
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const productById = await Product.findById(productId).select({ __v: 0 });

  if (!productById) {
    return res
      .status(404)
      .json({ success: true, message: "Coundn't find the product by Particular Id" });
  }

  res.status(200).json({
    success: true,
    message: 'GET: Single Product',
    product: productById,
  });
};
export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const productById = await Product.findById(productId).select({ __v: 0 });

  if (!productById) {
    return res
      .status(404)
      .json({ success: true, message: "Coundn't find the product by Particular Id" });
  }

  await Product.updateOne({ _id: productId }, req.body);

  res.status(200).json({
    success: true,
    message: 'Product Updated',
    request: { type: 'GET', Url: `http://localhost:4000/api/v1/products/${productId}` },
  });
};
export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const productById = await Product.findById(productId).select({ __v: 0 });

  if (!productById) {
    return res
      .status(404)
      .json({ success: true, message: "Coundn't find the product by Particular Id" });
  }

  await Product.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
};
