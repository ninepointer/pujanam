const UnKnownUser = require('../models/unKnownUserAction'); // Assuming your schema is saved in models/Tier
const ApiResponse = require('../helpers/apiResponse');
// Create a new unknown


exports.createUnknownMandir = async (req, res) => {
    try {
        const {
            ip, country, is_mobile, mandirId
        } = req.body;

        const checkExixtance = await UnKnownUser.findOne({ip: ip});

        if(checkExixtance){
            await UnKnownUser.findOneAndUpdate({_id: checkExixtance._id}, {
                $push: {
                    actions: {
                        product: "65a78b14f9ebef32f0add4dc",
                        specific_product: mandirId,
                        time: new Date()
                    }
                }
            });

            return ApiResponse.created(res, data, 'created');
        }

        const action = [
            {
                product: "65a78b14f9ebef32f0add4dc",
                specific_product: mandirId,
                time: new Date()
            }
        ]
        const data = await UnKnownUser.create({
            ip, country, is_mobile, actions: action
        });
        ApiResponse.created(res, data, 'created');
        
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.createUnknownPooja = async (req, res) => {
    try {
        const {
            ip, country, is_mobile, poojaId
        } = req.body;

        const checkExixtance = await UnKnownUser.findOne({ip: ip});

        if(checkExixtance){
            await UnKnownUser.findOneAndUpdate({_id: checkExixtance._id}, {
                $push: {
                    actions: {
                        product: "659e81ea30fa1324fb3d2681",
                        specific_product: poojaId,
                        time: new Date()
                    }
                }
            });

            return ApiResponse.created(res, data, 'created');
        }

        const action = [
            {
                product: "659e81ea30fa1324fb3d2681",
                specific_product: poojaId,
                time: new Date()
            }
        ]
        const data = await UnKnownUser.create({
            ip, country, is_mobile, actions: action
        });
        ApiResponse.created(res, data, 'created');
        
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};