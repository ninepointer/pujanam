const Pooja = require('../../models/Pooja/poojaSchema');
const ApiResponse = require('../../helpers/apiResponse');
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
            featured,
            name,
            description,
            category,
            sub_category,
            purpose,
            benefits,
            items,
            duration,
            type,
            status,
            faq,
            price,
            _id
        } = req.body;

        // console.log(req.body)
        const image = req.file;
        const poojaImage = image && await Promise.all(await processUpload([image], s3, name, true));

        const newPooja = await Pooja.create({
            name,
            featured,
            description,
            category,
            sub_category,
            purpose,
            benefits,
            image: poojaImage[0],
            items,
            duration,
            type,
            status,
            faq,
            created_by: req.user._id
        });


        ApiResponse.created(res, newPooja, 'Pooja created successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Get a Pooja by ID
exports.getPoojaById = async (req, res) => {
    try {
        const pooja = await Pooja.findById(req.params.id)
        .populate('packages.tier', 'tier_name')
        .populate('category', 'product_name');
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
            update.image = poojaImage[0];
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
        const poojas = await Pooja.find()
        .populate('category', 'product_name');
        ApiResponse.success(res, poojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getHomePoojas = async (req, res) => {
    try {
        const poojas = await Pooja.find()
        .limit(4)
        .populate('category', 'product_name');
        ApiResponse.success(res, poojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

// Get only active Poojas
exports.getActivePoojas = async (req, res) => {
    try {
        const activePoojas = await Pooja.find({ status: 'Published' })
        .populate('packages.tier', 'tier_name')
        .populate('category', 'product_name');
        ApiResponse.success(res, activePoojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.addPoojaInclude = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;
    try {
        if(prevData){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.includes){
                if(elem === prevData){
                    elem = data;
                }
                newArr.push(elem)
            }

            pooja.includes = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
            const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    includes: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pooja not found');
            }
            ApiResponse.success(res, update, 'Pooja updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addPurpose = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;
    try {
        if(prevData){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.purpose){
                if(elem === prevData){
                    elem = data;
                }
                newArr.push(elem)
            }

            pooja.purpose = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
            const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    purpose: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pooja not found');
            }
            ApiResponse.success(res, update, 'Pooja updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addBenefits = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;

    try {
        if(prevData){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.benefits){
                if(elem._id?.toString() === prevData?._id?.toString()){
                    elem.header = data.header;
                    elem.description = data.description;
                }
                newArr.push(elem)
            }

            pooja.benefits = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
            const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    benefits: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pooja not found');
            }
            ApiResponse.success(res, update, 'Pooja updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addDescription = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;
    try {
        if(prevData){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.description){
                if(elem === prevData){
                    elem = data;
                }
                newArr.push(elem)
            }

            pooja.description = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
            const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    description: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pooja not found');
            }
            ApiResponse.success(res, update, 'Pooja updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addPoojaItem = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;

    try {
        if(prevData){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.items){
                if(elem._id?.toString() === prevData?._id?.toString()){
                    elem.name = data.name;
                    elem.quantity = data.quantity;
                    elem.unit = data.unit;
                }
                newArr.push(elem)
            }

            pooja.items = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
            const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    items: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pooja not found');
            }
            ApiResponse.success(res, update, 'Pooja updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addFaq = async (req, res) => {
    const id = req.params.id;
    const {data, prevData} = req.body;

    try {
        if(prevData){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)});
            const newArr = [];
            for(let elem of pooja.faq){
                if(elem._id?.toString() === prevData?._id?.toString()){
                    elem.question = data.question;
                    elem.answer = data.answer;
                }
                newArr.push(elem)
            }

            pooja.faq = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
            const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
                $push: {
                    faq: data
                }
            }, {new: true});
            if (!update) {
                return ApiResponse.notFound(res, 'Pooja not found');
            }
            ApiResponse.success(res, update, 'Pooja updated successfully');
    
        }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.addTier = async (req, res) => {
    const id = req.params.id;
    const {packages, prevPackage} = req.body;

    try {
        if(prevPackage){
            const pooja = await Pooja.findOne({_id: new ObjectId(id)}).
            populate('packages.tier', 'tier_name')
            const newArr = [];
            for(let elem of pooja.packages){
                if(elem?.tier?._id?.toString() === prevPackage?.tier?._id?.toString()){
                    elem = packages;
                }
                newArr.push(elem)
            }

            pooja.packages = newArr;
            await pooja.save({new: true, validateBeforeSave: false});
            ApiResponse.success(res, pooja, 'Pooja updated successfully');

        } else{
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                packages: {
                    tier: packages._id,
                    price: packages.price
                }
            }
        }, {new: true});
        if (!update) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, update, 'Pooja updated successfully');
    }
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.deleteTier = async (req, res) => {
    const id = req.params.id;
    const {docId} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                packages: {
                    _id: new ObjectId(docId)
                }
            }
        }, {new: true});

        await update.populate('packages.tier', 'tier_name');
        if (!update) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, update, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.deletePurpose = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                purpose: data
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

exports.deleteInclude = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                includes: data
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

exports.deleteBenefit = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                benefits: data
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

exports.deleteDescription = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                description: data
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

exports.deleteFaq = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                faq: {
                    _id: data
                }
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

exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    try {
        const update = await Pooja.findOneAndUpdate({_id: new ObjectId(id)}, {
            $pull: {
                items: data
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