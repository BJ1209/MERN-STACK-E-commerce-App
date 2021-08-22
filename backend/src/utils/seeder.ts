import Product from '../model/product.model';
import products from '../data/products.json';
import connect from '../db/connect';
require('dotenv/config');

connect();

const seeder = async () => {
  try {
    await Product.deleteMany({});
    console.log('all products deleted');

    await Product.insertMany(products);
    console.log('products added successfully');
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seeder();
