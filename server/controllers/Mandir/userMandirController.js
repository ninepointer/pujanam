const Mandir = require('../../models/Mandir/mandir');
const { ObjectId } = require("mongodb");
const ApiResponse = require('../../helpers/apiResponse');
const User = require('../../models/User/userSchema');
const mongoose = require("mongoose");

exports.getActive = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ status: 'Active' })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getActiveHome = async (req, res) => {
    const {lat, long} = req.query;

    try {
        const mandir = await Mandir.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [Number(lat), Number(long)],
                },
                distanceField: "distance",
                spherical: true,
                key: "address_details.location",
              },
            },
            {
                $match: {
                    status: "Active"
                }
            },
            {
              $lookup: {
                from: "devi-devtas",
                localField: "devi_devta",
                foreignField: "_id",
                as: "devtas",
              },
            },
            {
              $unwind: {
                path: "$devtas",
              },
            },
            {
              $project: {
                devi_devta: "$devtas.name",
                _id: 0,
                name: 1,
                description: 1,
                cover_image: 1,
                images: 1,
                dham: 1,
                popular: 1,
                morning_closing_time: 1,
                evening_opening_time: 1,
                evening_closing_time: 1,
                morning_opening_time: 1,
                address_details: 1,
                construction_year: 1,
                distance: 1,
                slug: 1,
                morning_aarti_time: 1,
                evening_aarti_time: 1
              },
            },
            {
              $sort: {
                distance: 1,
              },
            },
            {
                $limit: 4
            }
          ])
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getActiveAllHome = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ status: 'Active' })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getDham = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ dham: true, status: 'Active' })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getBydevta = async (req, res) => {
    const {devtaId} = req.query;
    try {
        const activeMandir = await Mandir.find({ devi_devta: new ObjectId(devtaId) })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getPopular = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ popular: true, status: 'Active' })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getPopularMandirHomeActive = async (req, res) => {
    const {lat, long} = req.query;

    try {
        const mandir = await Mandir.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [Number(lat), Number(long)],
                },
                distanceField: "distance",
                spherical: true,
                key: "address_details.location",
              },
            },
            {
                $match: {
                    status: "Active",
                    popular: true
                }
            },
            {
              $lookup: {
                from: "devi-devtas",
                localField: "devi_devta",
                foreignField: "_id",
                as: "devtas",
              },
            },
            {
              $unwind: {
                path: "$devtas",
              },
            },
            {
              $project: {
                devi_devta: "$devtas.name",
                _id: 0,
                name: 1,
                description: 1,
                cover_image: 1,
                images: 1,
                dham: 1,
                popular: 1,
                morning_closing_time: 1,
                evening_opening_time: 1,
                evening_closing_time: 1,
                morning_opening_time: 1,
                address_details: 1,
                construction_year: 1,
                distance: 1,
                slug: 1,
                morning_aarti_time: 1,
                evening_aarti_time: 1
              },
            },
            {
              $sort: {
                distance: 1,
              },
            },
            {
                $limit: 4
            }
          ])
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllPopularMandirHomeActive = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ status: 'Active', popular: true })
        .limit(8)
        .populate('devi_devta', 'name');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getDhamHomeActive = async (req, res) => {
    const {lat, long} = req.query;

    try {
        const mandir = await Mandir.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [Number(lat), Number(long)],
                },
                distanceField: "distance",
                spherical: true,
                key: "address_details.location",
              },
            },
            {
                $match: {
                    status: "Active",
                    dham: true
                }
            },
            {
              $lookup: {
                from: "devi-devtas",
                localField: "devi_devta",
                foreignField: "_id",
                as: "devtas",
              },
            },
            {
              $unwind: {
                path: "$devtas",
              },
            },
            {
              $project: {
                devi_devta: "$devtas.name",
                _id: 0,
                name: 1,
                description: 1,
                cover_image: 1,
                images: 1,
                dham: 1,
                popular: 1,
                morning_closing_time: 1,
                evening_opening_time: 1,
                evening_closing_time: 1,
                morning_opening_time: 1,
                address_details: 1,
                construction_year: 1,
                distance: 1,
                slug: 1,
                morning_aarti_time: 1,
                evening_aarti_time: 1
              },
            },
            {
              $sort: {
                distance: 1,
              },
            },
            {
                $limit: 4
            }
          ])
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.addToFavourite = async (req, res) => {
    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const find = await Mandir.findOne({_id: new ObjectId(id), 
            favourite: { $elemMatch: { $eq: new ObjectId(req.user._id) } }
        })

        if(find){
            return ApiResponse.error(res, 'This mandir is already added in your favourite.', 500);
        }

        const favUser = await User.findOneAndUpdate(
            { _id: new ObjectId(req.user._id) },
            { $push: { favourite_mandirs: id } },
            { session: session, new: true }
        )
        .populate('favourite_mandirs', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v');

        const favMandir = await Mandir.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $push: { favourite: req.user._id } },
            { session: session }
        )
        

        await session.commitTransaction();
        session.endSession();

        ApiResponse.success(res, favUser);
    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        session.endSession();

        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.sharedBy = async (req, res) => {
    const {id} = req.params;
    try {
        const mandir = await Mandir.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $push: {
                share: req.user._id
            }
        })
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.unfavouriteTemple = async (req, res) => {
    const {id} = req.params;
    try {
        const mandir = await Mandir.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $pull: {
                favourite: req.user._id
            }
        })
        .select('favourite');
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getByDistance = async (req, res) => {
    const {lat, long, search} = req.query;
    const matchStage = search ? {
        $and: [
            {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { "address_details.city": { $regex: search, $options: 'i' } },
                { "address_details.state": { $regex: search, $options: 'i' } },
                { "address_details.pincode": { $regex: search, $options: 'i' } },
              ]
            },
            {
              status: 'Active'
            },
          ]
    } :
    {
        status: 'Active'
    }
    try {
        const mandir = await Mandir.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [Number(lat), Number(long)],
                },
                distanceField: "distance",
                spherical: true,
                key: "address_details.location",
              },
            },
            {
                $match: matchStage
            },
            {
              $lookup: {
                from: "devi-devtas",
                localField: "devi_devta",
                foreignField: "_id",
                as: "devtas",
              },
            },
            {
              $unwind: {
                path: "$devtas",
              },
            },
            {
              $project: {
                devi_devta: "$devtas.name",
                _id: 0,
                name: 1,
                description: 1,
                cover_image: 1,
                images: 1,
                dham: 1,
                popular: 1,
                morning_closing_time: 1,
                evening_opening_time: 1,
                evening_closing_time: 1,
                morning_opening_time: 1,
                address_details: 1,
                construction_year: 1,
                distance: 1,
                slug: 1,
                morning_aarti_time: 1,
                evening_aarti_time: 1
              },
            },
            {
              $sort: {
                distance: 1,
              },
            },
          ])
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getBySearch = async (req, res) => {
    let {search, limit, skip} = req.query;
    limit = limit || 50;
    skip = skip || 0;
    try {
        const mandir = await Mandir.find({
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: 'i' } },
                  { "address_details.city": { $regex: search, $options: 'i' } },
                  { "address_details.state": { $regex: search, $options: 'i' } },
                  { "address_details.pincode": { $regex: search, $options: 'i' } },
                ]
              },
              {
                status: 'Active'
              },
            ]
          })

            .sort({ expiry: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        ApiResponse.success(res, mandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getMandirByTitle = async (req, res) => {
    const { name } = req.params;
    try {
        const mandir = await Mandir.findOne({slug: name})
        .populate('devi_devta', 'name')
        res.status(201).json({
            status: 'success',
            data: mandir
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.viewCount = async (req, res) => {

    try{
        const mandirId = req.params.id;
        const {ip, isMobile, country} = req.body;
        const mandir = await Mandir.findOne({_id: new ObjectId(mandirId)});
        let flag = false;
    
        await Promise.all(mandir.uniqueCount.map((elem)=>{
            if(elem.ip === ip){
                flag = true
            }
        }))
    
        if(!flag){
            const updatedMandir = await Mandir.findOneAndUpdate({_id: new ObjectId(mandirId)}, {
                $push: {
                    uniqueCount: {
                        ip: ip,
                        isMobile: isMobile,
                        country: country,
                        time: new Date()
                    }
                },
                $inc: {viewCount: 1}
            }, { new: true } )
        }
    
        const updatedMandir = await Mandir.findOneAndUpdate({_id: new ObjectId(mandirId)}, {
            $inc: {viewCount: 1}
        }, { new: true } )
        ApiResponse.success(res, updatedMandir, 'Count updated successfully!');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};