const Pooja = require('../../models/Pooja/poojaSchema');
const ApiResponse = require('../../helpers/ApiResponse');
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
        const key = `Pooja/${route}/photos/${(Date.now()) + file.originalname}`;
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

// Create a Pooja
exports.createPooja = async (req, res) => {
    try {
        const {
            pooja_name,
            pooja_description,
            pooja_includes,
            purpose_of_pooja,
            benefits_of_pooja,
            pooja_items,
            pooja_duration,
            pooja_type,
            status,
            faq,
            price,
            _id
        } = req.body;

        console.log(req.body);

        const packages = {
            price: price,
            tier: _id
        }
        // const myObject = JSON.parse(req.body.pooja_packages);
        // console.log("myObject", myObject)
        const image = req.file;
        const poojaImage = image && await Promise.all(await processUpload([image], s3, pooja_name, true));

        console.log("poojaImage", poojaImage)
        const newPooja = await Pooja.create({
            pooja_name,
            pooja_description,
            pooja_includes,
            purpose_of_pooja,
            benefits_of_pooja,
            pooja_image: poojaImage[0],
            pooja_items,
            pooja_duration,
            pooja_packages: packages,
            pooja_type,
            status,
            faq,
            created_by: req.user._id
        });

        console.log("newPooja", newPooja)

        ApiResponse.created(res, newPooja, 'Pooja created successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Get a Pooja by ID
exports.getPoojaById = async (req, res) => {
    try {
        const pooja = await Pooja.findById(req.params.id);
        if (!pooja) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, pooja);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Edit a Pooja
exports.editPooja = async (req, res) => {
    try {
        const update = req.body;
        const { id } = req.params;
        const image = req.file;
        let poojaImage;

        if (image) {
            poojaImage = await Promise.all(await processUpload([image], s3, update.route));
            update.pooja_image = poojaImage[0];
        }

        update.last_modified_by = req?.user?._id;
        update.last_modified_on = new Date();


        const updatedPooja = await Pooja.findByIdAndUpdate(new ObjectId(req.params.id), update, { new: true });
        if (!updatedPooja) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, updatedPooja, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllPoojas = async (req, res) => {
    try {
        const poojas = await Pooja.find();
        ApiResponse.success(res, poojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Get only active Poojas
exports.getActivePoojas = async (req, res) => {
    try {
        const activePoojas = await Pooja.find({ status: 'Published' });
        ApiResponse.success(res, activePoojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.addPurpose = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                purpose_of_pooja: data
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, update, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addBenefits = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                benefits_of_pooja: data
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, update, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addDescription = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                pooja_description: data
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, update, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addFaq = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                faq: data
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, update, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};