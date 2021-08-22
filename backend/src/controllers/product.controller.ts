import { NextFunction, Request, Response } from 'express';
import Product from '../model/product.model';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});

    if (products.length < 1) {
      return res.status(200).json({ success: true, message: 'No Products Found' });
    }

    const responseObject = {
      success: true,
      message: 'All Products',
      productCount: products.length,
      products,
    };

    res.status(200).json(responseObject);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, price, description, category, seller, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      seller,
      stock,
    });

    const product = await newProduct.save();

    console.log(product);

    res.status(201).json({ success: true, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
