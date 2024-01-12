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