const Product = require('../models/Product/product');
const ApiResponse = require('../helpers/apiResponse');

exports.createProduct = async (req, res) => {
    try {
        const { product_name, status } = req.body;
        const newProduct = await Product.create({
            product_name,
            status,
            created_by:req.user._id,
            last_modified_by:req.user._id, // Assuming the user ID is passed in the request body
        });
        ApiResponse.created(res,newProduct,'Product created');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        ApiResponse.success(res, products);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
exports.getActiveProducts = async (req, res) => {
    try {
        const products = await Product.find({status:'Active'});
        ApiResponse.success(res, products);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            ApiResponse.notFound(res,'Product not found');
        }
        ApiResponse.success(res, product);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
}


