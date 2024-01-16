const Pandit = require('../models/Pandit/pandit');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const ApiResponse = require('../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
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
        console.log('no file');
        next();
        return;
    }
    sharp(req.file.buffer).resize({ width: 512, height: 512 }).toBuffer()
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
        const key = `Pandit/${route}/photos/${(Date.now()) + file.originalname}`;
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
exports.createPandit = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.file)
        const {
            pandit_name,
            mobile,
            email,
            experience_in_year,
            // address_details,
            longitude, 
            latitude, 
            address,
            pincode, 
            city, 
            state, 
            country,
            dob,
            onboarding_date,
            pooja,
            description,
            additional_information,
            language,
            status,
        } = req.body;

        const address_details = {
            location: {
                type: "Point",
                coordinates: [latitude, longitude]
            },
            address,
            pincode,
            city,
            state,
            country
        }

        const image = req.file;
        const photo = image && await Promise.all(await processUpload([image], s3, pandit_name, true));

        const newPandit = await Pandit.create({
            pandit_name,
            mobile,
            email,
            experience_in_year,
            address_details,
            dob,
            onboarding_date,
            pooja,
            photo: photo[0],
            description,
            additional_information,
            language,
            status,
            created_by:req.user._id, // Assuming the ID of the creator is passed in the request body
            last_modified_by:req.user._id // This might be the same as 'created_by' initially
        });

        ApiResponse.created(res, newPandit, 'Pandit created successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
// Get all Pandits
exports.getAllPandits = async (req, res) => {
    try {
        const pandits = await Pandit.find();
        ApiResponse.success(res, pandits);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
exports.getActivePandits = async (req, res) => {
    try {
        const pandits = await Pandit.find({status:'Active'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, pandits);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get a Pandit by ID
exports.getPanditById = async (req, res) => {
    try {
        const pandit = await Pandit.findById(req.params.id);
        if (!pandit) {
            return ApiResponse.notFound(res, 'Pandit not found');
        }
        ApiResponse.success(res, pandit);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Edit a Pandit
exports.editPandit = async (req, res) => {
    try {
        const update = req.body;
        const updatedPandit = await Pandit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const image = req.file;

        let photo;

        if (image) {
            photo = await Promise.all(await processUpload([image], s3, update.route));
            update.image = photo[0];
        }

        update.last_modified_by = req?.user?._id;
        update.last_modified_on = new Date();

        if (!updatedPandit) {
            return ApiResponse.notFound(res, 'Pandit not found');
        }
        ApiResponse.success(res, updatedPandit, 'Pandit updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Edit a Pandit additional_information
exports.additionalInformationPandit = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;
    try {
        if(prevData){
            const pandit = await Pandit.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pandit.additional_information){
                if(elem === prevData){
                    elem = data;
                }
                newArr.push(elem)
            }

            pandit.additional_information = newArr;
            await pandit.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pandit, 'Pandit updated successfully');

        } else{
            const update = await Pandit.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    additional_information: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pandit not found');
            }
            ApiResponse.success(res, update, 'Pandit updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.deleteInfo = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pandit.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                additional_information: data
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'Pandit not found');
        }
        ApiResponse.success(res, update, 'Pandit updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
