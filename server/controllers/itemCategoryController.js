const mongoose = require('mongoose');
const ItemCategory = require('../models/ItemCategory/itemCategory'); // Replace with the actual path to your model
const AWS = require('aws-sdk');
const sharp = require('sharp');
const ApiResponse = require('../helpers/apiResponse'); // Update the path according to your project structure

// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Resize and Upload Image
const resizeAndUploadImage = async (image, category) => {
    if (!image) return null;

    try {
        const resizedImageBuffer = await sharp(image.buffer).resize({ width: 512, height: 512 }).toBuffer();
        const key = `ItemCategory/${category}/${Date.now()}_${image.originalname}`;
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

// Create Item Category
exports.createItemCategory = async (req, res) => {
    try {
        const { name, description, status, created_by, last_modified_by } = req.body;
        const image = req.file;

        const imageDetails = image && await resizeAndUploadImage(image, name);

        const newItemCategory = new ItemCategory({
            name,
            description,
            image: imageDetails,
            status,
            created_by,
            last_modified_by
        });

        const savedCategory = await newItemCategory.save();
        ApiResponse.created(res, savedCategory, 'Item Category created successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};
// Edit Item Category
exports.editItemCategory = async (req, res) => {
    try {
        const { name, description, status, last_modified_by } = req.body;
        const image = req.file;
        const itemCategoryId = req.params.id;

        const existingCategory = await ItemCategory.findById(itemCategoryId);
        if (!existingCategory) {
            return ApiResponse.notFound(res, 'Item Category not found');
        }

        let imageDetails;
        if (image) {
            imageDetails = await resizeAndUploadImage(image, name || existingCategory.name);
        }

        const updatedCategory = await ItemCategory.findByIdAndUpdate(
            itemCategoryId,
            {
                name: name || existingCategory.name,
                description: description || existingCategory.description,
                image: imageDetails || existingCategory.image,
                status: status || existingCategory.status,
                last_modified_by: last_modified_by || existingCategory.last_modified_by,
                last_modified_on: new Date()
            },
            { new: true }
        );

        ApiResponse.success(res, updatedCategory, 'Item Category updated successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};


// Get All Item Categories
exports.getAllItemCategories = async (req, res) => {
    try {
        const categories = await ItemCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Individual Item Category
exports.getItemCategory = async (req, res) => {
    try {
        const category = await ItemCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Item Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
