const mongoose = require('mongoose');
const Item = require('../models/Item/item'); // Replace with the actual path to your model
const AWS = require('aws-sdk');
const sharp = require('sharp');
const ApiResponse = require('../helpers/apiResponse'); // Update the path according to your project structure
const {ObjectId} = require('mongodb')

// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

// Resize and Upload Image
const resizeAndUploadImage = async (image, itemName) => {
    if (!image) return null;

    try {
        const resizedImageBuffer = await sharp(image.buffer).resize({ width: 512, height: 512 }).toBuffer();
        const key = `Item/${itemName}/${Date.now()}_${image.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: resizedImageBuffer,
            ContentType: image.mimetype,
            ACL: 'public-read',
        };
        const uploadedObject = await s3.upload(uploadParams).promise();
        return {
            name: image.originalname,
            url: uploadedObject.Location,
        };
    } catch (error) {
        throw new Error('Error processing image upload');
    }
};

// Create Item
exports.createItem = async (req, res) => {
    try {
        const { name, min_order_quantity, unit, price, featured, sponsored, description, category, status, created_by } = req.body;
        const image = req.file;

        console.log(req.body)
        const featuredValue =  featured==='undefined' ? false : true;
        const sponsoredValue = sponsored==='undefined' ? false : true;

        const imageDetails = image && await resizeAndUploadImage(image, name);
        const newItem = new Item({
            name,
            min_order_quantity: Math.abs(min_order_quantity),
            unit,
            price: Math.abs(price),
            image: imageDetails,
            featured: featuredValue,
            sponsored: sponsoredValue,
            description,
            category,
            status,
            created_by
        });

        const savedItem = await newItem.save();
        ApiResponse.created(res, savedItem, 'Item created successfully');
    } catch (error) {
        console.log(error)
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Edit Item
exports.editItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updateData = req.body;
        const image = req.file;

        updateData.featured =  updateData.featured==='false' ? false : true;
        updateData.sponsored = updateData.sponsored==='false' ? false : true;


        const existingItem = await Item.findById(itemId);
        if (!existingItem) {
            return ApiResponse.notFound(res, 'Item not found');
        }

        let imageDetails;
        if (image) {
            imageDetails = await resizeAndUploadImage(image, updateData.name || existingItem.name);
            updateData.image = imageDetails;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { ...updateData, last_modified_on: new Date(), last_modified_by: req.user._id },
            { new: true }
        );

        ApiResponse.success(res, updatedItem, 'Item updated successfully');
    } catch (error) {
        console.log(error)
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find().populate('category', 'name'); // Populate with category name, modify as needed
        ApiResponse.success(res, items);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllActiveItems = async (req, res) => {
    try {
        const items = await Item.find({status: "Active"}).populate('category', 'name'); // Populate with category name, modify as needed
        ApiResponse.success(res, items);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllInActiveItems = async (req, res) => {
    try {
        const items = await Item.find({status: "Inactive"}).populate('category', 'name'); // Populate with category name, modify as needed
        ApiResponse.success(res, items);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllDraftItems = async (req, res) => {
    try {
        const items = await Item.find({status: "Draft"}).populate('category', 'name'); // Populate with category name, modify as needed
        ApiResponse.success(res, items);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllItemsByCategory = async (req, res) => {
    try {
        const items = await Item.find({category:new ObjectId(req.params.id)}).populate('category', 'name'); // Populate with category name, modify as needed
        ApiResponse.success(res, items);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Get Individual Item
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category', 'name'); // Populate with category name, modify as needed
        if (!item) {
            return ApiResponse.notFound(res, 'Item not found');
        }
        ApiResponse.success(res, item);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};