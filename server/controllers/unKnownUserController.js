const UnKnownUser = require('../models/unKnownUserAction'); // Assuming your schema is saved in models/Tier
const ApiResponse = require('../helpers/apiResponse');
const Mandir = require('../models/Mandir/mandir');
const Pooja = require('../models/Pooja/poojaSchema');
const {ObjectId} = require('mongodb')
// Create a new unknown


exports.createUnknownMandir = async (req, res) => {
    try {
        const {
            ip, country, is_mobile, mandirId, latitude, longitude, address
        } = req.body;

        const address_details = {
            location: {
                type: 'Point',
                coordinates: [latitude, longitude]
            },
            address: address
        }

        const checkExixtance = await UnKnownUser.findOne({ip: ip});
        const updatedMandir = await Mandir.findOneAndUpdate({_id: new ObjectId(mandirId)}, {
            $inc: {viewCount: 1}
        }, { new: true } )

        if(checkExixtance){
            const insert = await UnKnownUser.findOneAndUpdate({_id: checkExixtance._id}, {
                $push: {
                    actions: {
                        product: "65a78b14f9ebef32f0add4dc",
                        specific_product: mandirId,
                        time: new Date()
                    }
                },
                $set: {
                    address_details: address_details
                }
            });

            return ApiResponse.created(res, insert, 'created');
        }

        const action = [
            {
                product: "65a78b14f9ebef32f0add4dc",
                specific_product: mandirId,
                time: new Date()
            }
        ]

        console.log(action, mandirId)
        const data = await UnKnownUser.create({
            ip, country, is_mobile, actions: action, address_details
        });
        ApiResponse.created(res, data, 'created');
        
    } catch (error) {
        console.log(error)
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.createUnknownPooja = async (req, res) => {
    try {
        const {
            ip, country, is_mobile, poojaId, latitude, longitude, address
        } = req.body;

        const address_details = {
            location: {
                type: 'Point',
                coordinates: [latitude, longitude]
            },
            address: address
        }

        const checkExixtance = await UnKnownUser.findOne({ip: ip});
        const updatedMandir = await Pooja.findOneAndUpdate({_id: new ObjectId(poojaId)}, {
            $inc: {viewCount: 1}
        }, { new: true } )

        if(checkExixtance){
            const insert = await UnKnownUser.findOneAndUpdate({_id: checkExixtance._id}, {
                $push: {
                    actions: {
                        product: "659e81ea30fa1324fb3d2681",
                        specific_product: poojaId,
                        time: new Date()
                    }
                },
                $set: {
                    address_details: address_details
                }
            });

            return ApiResponse.created(res, insert, 'created');
        }

        const action = [
            {
                product: "659e81ea30fa1324fb3d2681",
                specific_product: poojaId,
                time: new Date()
            }
        ]
        const data = await UnKnownUser.create({
            ip, country, is_mobile, actions: action, address_details
        });
        ApiResponse.created(res, data, 'created');
        
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};