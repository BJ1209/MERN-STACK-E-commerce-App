import { productType } from '../model/product.model';

export default (resPerPage: number, currPage: number, products: productType[]): productType[] => {
  const skip = resPerPage * (currPage - 1);
  return products.slice(skip, skip + resPerPage);
};
