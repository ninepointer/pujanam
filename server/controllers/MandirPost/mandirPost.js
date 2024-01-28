const MandirPost = require('../../models/MandirPost/mandirPost');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION

});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.resizePhoto = (req, res, next) => {
    console.log(req.file)
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }
    sharp(req.file.buffer).resize({ width: 1080, height: 1920 }).toBuffer()
        .then((resizedImageBuffer) => {
            req.file.buffer = resizedImageBuffer;
            // console.log("Resized:",resizedImageBuffer)
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Error resizing photo" });
        });
};

const processUpload = async (uploadedFiles, s3, route) => {
    const MAX_LIMIT = 10 * 1024 * 1024;
    const fileUploadPromises = uploadedFiles.map(async (file) => {

        if (file.size > MAX_LIMIT) {
            return res.status(500).send({ status: "error", err: error, message: 'Image size should be less then 5 MB.' });
        }
        const key = `MandirPost/${route}/photos/${(Date.now()) + file.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        const uploadedObject = await s3.upload(uploadParams).promise();
        return {
            name: file.originalname,
            url: uploadedObject.Location,
        };
    });

    return fileUploadPromises;
}
// Create a Pandit
exports.createMandirPost = async (req, res) => {
   console.log(req.body)
    try {
        const {
            mandir,
            videoUrl,
            status,
        } = req.body;

        const image = req.file;
        const photo = image && await Promise.all(await processUpload([image], s3, true));

        const mandirPost = await MandirPost.create({
            mandir,
            videoUrl,
            photo: photo[0],
            status,
            created_by:req.user._id, // Assuming the ID of the creator is passed in the request body
            last_modified_by:req.user._id // This might be the same as 'created_by' initially
        });

        ApiResponse.created(res, mandirPost, 'Mandir Post created successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
// Get all Pandits
exports.getAllMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find();
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
exports.getActiveMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find({status:'Active'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getInactiveMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find({status:'Inactive'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getDraftMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find({status:'Draft'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get a Pandit by ID
exports.getMandirPostById = async (req, res) => {
    try {
        const mandirPost = await MandirPost.findById(req.params.id);
        if (!mandirPost) {
            return ApiResponse.notFound(res, 'Mandir Post not found');
        }
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Edit a Pandit
exports.editMandirPost = async (req, res) => {
    try {
        const {id} = req.params;
        const update = req.body;
        const updateMandirPost = await MandirPost.findById(req.params.id);
        const image = req.file;

        if (!updateMandirPost) {
            return ApiResponse.notFound(res, 'Post not found');
        }
        let photo;

        if (image) {
            photo = await Promise.all(await processUpload([image], s3, update.route));
            update.photo = photo[0];
        }

        update.last_modified_by = req?.user?._id;
        update.last_modified_on = new Date();

        const mandirPostUpdate = await MandirPost.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})
        ApiResponse.success(res, mandirPostUpdate, 'Mandir Post updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
 
// Edit a Pandit additional_information
