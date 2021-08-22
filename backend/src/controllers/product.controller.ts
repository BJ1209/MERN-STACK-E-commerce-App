import { NextFunction, Request, Response } from 'express';
import Product from '../model/product.model';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({}).select({ __v: 0 });

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

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
