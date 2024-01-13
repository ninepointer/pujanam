const Mandir = require('../../models/Mandir/mandir');
const AWS = require('aws-sdk');
const { ObjectId } = require("mongodb");
// const {decode} = require('html-entities');
const sharp = require('sharp');
const ApiResponse = require('../../helpers/apiResponse');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION

});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.create = (async (req, res, next) => {
    
    try {
        const { name, description, dham, popular, morning_opening_time, 
            morning_closing_time, evening_opening_time, evening_closing_time,
            devi_devta, longitude, latitude, address, pincode, city, state, country,
            construction_year, pandit_mobile_number, pandit_full_name,
            status  } = req.body;

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

        const uploadedFiles = req.files;
        const otherImages = uploadedFiles.files && await Promise.all(await processUpload(uploadedFiles.files, s3, name));
        const coverImage = uploadedFiles.coverFiles && await Promise.all(await processUpload(uploadedFiles.coverFiles, s3, name, true));
        const mandir = await Mandir.create({
            name, description, dham, popular, morning_opening_time, 
            morning_closing_time, evening_opening_time, evening_closing_time,
            devi_devta, address_details, images: otherImages, cover_image: coverImage[0],
            construction_year, pandit_mobile_number, pandit_full_name,
            status
        });
       
        ApiResponse.created(res, mandir, 'Mandir updated successfully');
    } catch (error) {
        console.error(error);
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }

});

const processUpload = async(uploadedFiles, s3, title, isTitleImage)=>{
    const MAX_LIMIT = 5*1024*1024;
    const fileUploadPromises = uploadedFiles.map(async (file) => {
        
        if(file.size > MAX_LIMIT){
            return res.status(500).send({status: "error", err: error, message: 'Image size should be less then 5 MB.'});
        }
        if(isTitleImage){
            file.buffer = await sharp(file.buffer)
            .resize({ width: 1080, height: 720 })
            .toBuffer();
        }
        const key = `blogs/${title}/photos/${(Date.now()) + file.originalname}`;
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
            // size: (uploadedObject).Size,
            // mimetype: file.mimetype,
        };
    });

    return fileUploadPromises;
}

exports.edit = (async (req, res, next) => {

    try {
        // const { title } = req.body;
        const update = req.body;

        update.address_details = {
            location: {
                type: "Point",
                coordinates: [update?.latitude, update?.longitude]
            },
            address: update?.address,
            pincode: update?.pincode,
            city: update?.city,
            state: update?.state,
            country: update?.country
        }

        const {id} = req.params;
        const uploadedFiles = req.files;
        let otherImages; let coverImage;

        const mandir = await Mandir.findOne({_id: new ObjectId(id)});
        update.images = mandir?.images;
        update.cover_image = mandir?.cover_image;
        update.favourite = mandir?.favourite;
        update.share = mandir?.share

        if(uploadedFiles?.files){
            otherImages = await Promise.all(await processUpload(uploadedFiles.files, s3, update.name));
            update.images = mandir.images.concat(otherImages);
        }
        if(uploadedFiles?.coverFiles){
            coverImage = await Promise.all(await processUpload(uploadedFiles.coverFiles, s3, update.name, true));
            update.cover_image = coverImage[0];
        }

        update.lastModifiedBy = req?.user?._id;
        update.lastModifiedOn = new Date();

        for (let key in update) {
            if (!update[key]) {
              delete update[key];
            }
          }
        const mandirUpdate = await Mandir.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})
        ApiResponse.success(res, mandirUpdate, 'Mandir edited successfully');
    } catch (error) {
        console.error(error);
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }

});

exports.removeImage = (async (req, res, next) => {

    try {
        const {id, docId} = req.params;

        // console.log(uploadedFiles, update);
        const mandir = await Mandir.findOne({_id: new ObjectId(id)});
        const images = mandir.images.filter((elem)=>{
            return elem._id.toString() !== docId.toString()
        });

        mandir.images = images;
        await mandir.save({ validateBeforeSave: false, new: true })
        ApiResponse.success(res, mandir, 'Mandir\s image removed');
    } catch (error) {
        console.error(error);
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }

});

exports.getActive = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ status: 'Active' })
        .populate('devi_devta', 'name');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};
