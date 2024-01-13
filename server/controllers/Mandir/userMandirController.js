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
    try {
        const activeMandir = await Mandir.find({ status: 'Active' })
        .limit(4)
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getDham = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ dham: true })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getPopular = async (req, res) => {
    try {
        const activeMandir = await Mandir.find({ popular: true })
        .populate('devi_devta', 'name')
        .select('-created_on -created_by -last_modified_on -last_modified_by -__v -favourite -share');
        ApiResponse.success(res, activeMandir);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.addToFavourite = async (req, res) => {
    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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

exports.getByDistance = async (req, res) => {
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