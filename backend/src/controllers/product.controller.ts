import { NextFunction, Response } from 'express';
import { newRequest } from '../interfaces';
import Product from '../model/product.model';
import pagination from '../utils/pagination';

export const getAllProducts = async (req: newRequest, res: Response, next: NextFunction) => {
  const { q, page, category, limit, plte, pgte } = req.query;
  const resPerPage = 4;

  // keyword search
  let products = q
    ? await Product.find({ name: { $regex: `${q}`, $options: 'i' } }).select({ __v: 0 })
    : await Product.find({}).select({ __v: 0 });

  // category
  if (category) {
    products = products.filter((product) => {
      return product.category === category;
    });
  }

  // price less than
  if (plte) {
    products = products.filter((product) => {
      return product.price <= Number(plte);
    });
  }

  // price greater than
  if (pgte) {
    products = products.filter((product) => {
      return product.price >= Number(pgte);
    });
  }
  // limit for the products
  if (limit) {
    products = products.slice(0, Number(limit));
  }

  if (page) {
    products = pagination(resPerPage, Number(page), products);
  }

  if (products.length < 1) {
    return res.status(200).json({ success: true, message: 'No Products Found' });
  }

  const responseObject = {
    success: true,
    message: 'All Products',
    productCount: products.length,
    products: products.map(
      ({
        id,
        name,
        price,
        description,
        ratings,
        images,
        category,
        seller,
        stock,
        numOfReviews,
        reviews,
        createdAt,
      }) => {
        return {
          id,
          name,
          price,
          description,
          ratings,
          images,
          category,
          seller,
          stock,
          numOfReviews,
          reviews,
          createdAt,
          request: {
            url: `http://localhost:4000/api/v1/products/${id}`,
            request: 'GET',
            message: 'Get single product detail',
          },
        };
      }
    ),
  };

  res.status(200).json(responseObject);
};
export const createNewProduct = async (req: newRequest, res: Response, next: NextFunction) => {
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
export const getProductById = async (req: newRequest, res: Response, next: NextFunction) => {
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
export const updateProductById = async (req: newRequest, res: Response, next: NextFunction) => {
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
export const deleteProductById = async (req: newRequest, res: Response, next: NextFunction) => {
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
