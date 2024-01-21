const User = require('../models/User/userSchema'); // Replace with the actual path to your model
const mongoose = require('mongoose');
const ApiResponse = require('../helpers/apiResponse'); // Update the path according to your project structure

// Add Item to Cart
exports.addItemToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity, status } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return ApiResponse.notFound(res, 'User not found');
        }

        const existingItemIndex = user.cart.findIndex(item => item.itemId.equals(itemId));
        if (existingItemIndex !== -1) {
            // Item exists, update the quantity
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            // Item does not exist, add new item
            user.cart.push({ itemId, quantity, status });
        }

        await user.save();
        ApiResponse.success(res, user.cart, 'Item added to cart successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Remove Item from Cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return ApiResponse.notFound(res, 'User not found');
        }

        const existingItemIndex = user.cart.findIndex(item => item.itemId.equals(itemId));
        if (existingItemIndex !== -1) {
            if (user.cart[existingItemIndex].quantity > 1) {
                // Reduce quantity by 1
                user.cart[existingItemIndex].quantity -= 1;
            } else {
                // Remove item from cart
                user.cart.splice(existingItemIndex, 1);
            }
        } else {
            return ApiResponse.notFound(res, 'Item not found in cart');
        }

        await user.save();
        ApiResponse.success(res, user.cart, 'Item quantity updated in cart successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};


// Get User's Cart
exports.getUserCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('cart.itemId');

        if (!user) {
            return ApiResponse.notFound(res, 'User not found');
        }

        ApiResponse.success(res, user.cart);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};
