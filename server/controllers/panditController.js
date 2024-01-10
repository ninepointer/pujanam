const Pandit = require('../models/Pandit/pandit');
const ApiResponse = require('../helpers/ApiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb')
// Create a Pandit
exports.createPandit = async (req, res) => {
    try {
        const {
            pandit_name,
            mobile,
            email,
            experience_in_year,
            address_details,
            dob,
            onboarding_date,
            pooja,
            description,
            additional_information,
            language,
            status,
        } = req.body;

        const newPandit = await Pandit.create({
            pandit_name,
            mobile,
            email,
            experience_in_year,
            address_details,
            dob,
            onboarding_date,
            pooja,
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
        const pandits = await Pandit.find({status:'Active'});
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
        const updatedPandit = await Pandit.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
