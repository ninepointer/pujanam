const DeviDevta = require('../models/Devi-Devta/devi-devta');
const ApiResponse = require('../helpers/apiResponse');
const AWS = require('aws-sdk');
const { ObjectId } = require('mongodb');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION

});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const processUpload = async (uploadedFiles, s3, route) => {
    const MAX_LIMIT = 5 * 1024 * 1024;
    const fileUploadPromises = uploadedFiles.map(async (file) => {

        if (file.size > MAX_LIMIT) {
            return res.status(500).send({ status: "error", err: error, message: 'Image size should be less then 5 MB.' });
        }
        const key = `DeviDevta/${route}/photos/${(Date.now()) + file.originalname}`;
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

exports.create = async (req, res) => {
    try {
        const {
            name,
            description,
        } = req.body;

        const imageData = req.file;
        const devtaImage = imageData && await Promise.all(await processUpload([imageData], s3, name, true));

        const devi_devta = await DeviDevta.create({
            name,
            description,
            image: devtaImage[0],
            created_by: req.user._id,
            last_modified_by: req.user._id,
        });

        ApiResponse.created(res, devi_devta, 'Devta\s created successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Get a DeviDevta by ID
exports.getDevtaById = async (req, res) => {
    try {
        const devta = await DeviDevta.findById(req.params.id)
        .populate('other_names', 'name')
        .populate('associated_devi_devta', 'name');
        if (!devta) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, devta);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};
// Edit a DeviDevta
exports.edit = async (req, res) => {
    try {
        const update = req.body;
        const image = req.file;
        let devtaImage;

        if (image) {
            devtaImage = await Promise.all(await processUpload([image], s3, update.route));
            update.image = devtaImage[0];
        }

        update.last_modified_by = req?.user?._id;
        update.last_modified_on = new Date();


        const updatedPooja = await DeviDevta.findByIdAndUpdate(new ObjectId(req.params.id), update, { new: true });
        if (!updatedPooja) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, updatedPooja, 'DeviDevta updated successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllDevta = async (req, res) => {
    try {
        const devta = await DeviDevta.find();
        ApiResponse.success(res, devta);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};
// Get only active Poojas
exports.getActiveDevta = async (req, res) => {
    try {
        const activePoojas = await DeviDevta.find({ status: 'Active' })
        .populate('other_names', 'name')
        .populate('associated_devi_devta', 'name');

        ApiResponse.success(res, activePoojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.addOtherDevta = async (req, res) => {
    const id = req.params.id;
    const {other_devta, prevPackage} = req.body;

    try {
        if(prevPackage){
            const deviDevta = await DeviDevta.findOne({_id: new ObjectId(id)}).
            populate('other_names', 'name')
            const newArr = [];
            for(let elem of deviDevta.other_names){
                if(elem?.other_names?._id?.toString() === prevPackage?.other_names?._id?.toString()){
                    elem = other_devta;
                }
                newArr.push(elem)
            }

            deviDevta.other_names = newArr;
            await deviDevta.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, deviDevta, 'DeviDevta updated successfully');

        } else{
        const update = await DeviDevta.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                other_names: other_devta._id
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, update, 'DeviDevta updated successfully');
    }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addAssociateDevta = async (req, res) => {
    const id = req.params.id;
    const {other_devta, prevPackage} = req.body;

    try {
        if(prevPackage){
            const deviDevta = await DeviDevta.findOne({_id: new ObjectId(id)}).
            populate('associated_devi_devta', 'name')
            const newArr = [];
            for(let elem of deviDevta.associated_devi_devta){
                if(elem?.associated_devi_devta?._id?.toString() === prevPackage?.associated_devi_devta?._id?.toString()){
                    elem = other_devta;
                }
                newArr.push(elem)
            }

            deviDevta.associated_devi_devta = newArr;
            await deviDevta.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, deviDevta, 'DeviDevta updated successfully');

        } else{
        const update = await DeviDevta.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                associated_devi_devta: other_devta._id
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, update, 'DeviDevta updated successfully');
    }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addGeography = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;
    try {
        if(prevData){
            const pooja = await DeviDevta.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.geography){
                if(elem === prevData){
                    elem = data;
                }
                newArr.push(elem)
            }

            pooja.geography = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'DeviDevta updated successfully');

        } else{
            const update = await DeviDevta.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    geography: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'DeviDevta not found');
            }
            ApiResponse.success(res, update, 'DeviDevta updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.deleteOtherDevta = async (req, res) => {
    const id = req.params.id;
    const {docId} = req.body;
    try {
        const update = await DeviDevta.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                other_names: {
                    _id: new ObjectId(docId)
                }
            }
        }, {new: true});

        await update.populate('other_names', 'name');
        if (!update) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, update, 'DeviDevta updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.deleteAssociateDevta = async (req, res) => {
    const id = req.params.id;
    const {docId} = req.body;
    try {
        const update = await DeviDevta.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                associated_devi_devta: {
                    _id: new ObjectId(docId)
                }
            }
        }, {new: true});

        await update.populate('associated_devi_devta', 'name');
        if (!update) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, update, 'DeviDevta updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.deleteGeography = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await DeviDevta.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                geography: data
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, update, 'DeviDevta updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};