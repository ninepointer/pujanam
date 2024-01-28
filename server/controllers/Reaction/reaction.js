const Reaction = require('../../models/Reaction/reaction');
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
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }
    sharp(req.file.buffer).resize({ width: 100, height: 100 }).toBuffer()
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
    const MAX_LIMIT = 5 * 1024 * 1024;
    const fileUploadPromises = uploadedFiles.map(async (file) => {

        if (file.size > MAX_LIMIT) {
            return res.status(500).send({ status: "error", err: error, message: 'Image size should be less then 5 MB.' });
        }
        const key = `Reaction/${route}/photos/${(Date.now()) + file.originalname}`;
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
exports.createReaction = async (req, res) => {
    try {
        const {
            name,
            status,
        } = req.body;

        const image = req.file;
        const icon = image && await Promise.all(await processUpload([image], s3, name, true));

        const newReaction = await Reaction.create({
            name,
            icon: icon[0],
            status,
            created_by:req.user._id, // Assuming the ID of the creator is passed in the request body
            last_modified_by:req.user._id // This might be the same as 'created_by' initially
        });

        ApiResponse.created(res, newReaction, 'Reaction created successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
// Get all Pandits
exports.getAllReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find();
        ApiResponse.success(res, reactions);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
exports.getActiveReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find({status:'Active'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, reactions);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getInactiveReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find({status:'Inactive'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, reactions);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getDraftReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find({status:'Draft'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, reactions);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get a Pandit by ID
exports.getReactionById = async (req, res) => {
    try {
        const reaction = await Reaction.findById(req.params.id);
        if (!reaction) {
            return ApiResponse.notFound(res, 'Reaction not found');
        }
        ApiResponse.success(res, reaction);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Edit a Pandit
exports.editReaction = async (req, res) => {
    try {
        const {id} = req.params;
        const update = req.body;
        const updateReaction = await Reaction.findById(req.params.id);
        const image = req.file;

        if (!updateReaction) {
            return ApiResponse.notFound(res, 'Reaction not found');
        }
        let icon;

        if (image) {
            icon = await Promise.all(await processUpload([image], s3, update.route));
            update.icon = icon[0];
        }

        update.last_modified_by = req?.user?._id;
        update.last_modified_on = new Date();

        const reactionUpdate = await Reaction.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})
        ApiResponse.success(res, reactionUpdate, 'Reaction updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
 
// Edit a Pandit additional_information
