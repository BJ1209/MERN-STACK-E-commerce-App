import { NextFunction, Response } from 'express';
import { newRequest } from '../interfaces';
import Product from '../model/product.model';
import pagination from '../utils/pagination';
import createError from 'http-errors';

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
  const userId = req.user?.id;

  const newProduct = new Product({
    name,
    price,
    description,
    category,
    seller,
    stock,
    userId,
  });

  await newProduct.save();
  res.status(201).json({ success: true, message: 'Product created' });
};
export const getProductById = async (req: newRequest, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const productById = await Product.findById(productId).select({ __v: 0 });

  if (!productById) {
    throw new createError.NotFound("Coundn't find the product by Particular Id");
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
    throw new createError.NotFound("Coundn't find the product by Particular Id");
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
    throw new createError.NotFound("Coundn't find the product by Particular Id");
  }

  await Product.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
};

// Review routes
export const getAllReviews = async (req: newRequest, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.query.productId);

  res.status(200).json({
    success: true,
    count: product?.reviews.length,
    reviews: product?.reviews,
  });
};
export const addReview = async (req: newRequest, res: Response, next: NextFunction) => {
  const { rating, comment, productId } = req.body;

  const review = {
    userId: req.user!.id,
    name: req.user!.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  // Check if the product is reviewed by the user
  const isReviewed = product?.reviews.find((review) => review.userId === req.user?.id);

  // if true update the review to the new one
  // else push the new review to the reviews array
  if (isReviewed) {
    product!.reviews.forEach((review) => {
      if (review.userId === req.user?.id) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product!.reviews.push(review);
    product!.numOfReviews = product!.reviews.length;
  }

  product!.ratings =
    product!.reviews.reduce((acc, item) => item.rating + acc, 0) / product!.reviews.length;

  await product!.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Review Added' });
};
export const deleteReview = async (req: newRequest, res: Response, next: NextFunction) => {
  const { productId, reviewId } = req.query;

  const product = await Product.findById(productId);

  // @ts-ignore
  const reviews = product?.reviews.filter((review) => review._id !== reviewId);

  const numOfReviews = reviews!.length;

  const ratings = reviews!.reduce((acc, item) => acc + item.rating, 0);

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({ success: true, message: 'Review Deleted' });
};
