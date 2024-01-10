const Pooja = require('../../models/Pooja/poojaSchema');
const ApiResponse = require('../../helpers/ApiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb')
// Create a Pandit
exports.getAllPooja = async (req, res) => {
    try {
        const pooja = await Pooja.find({status: "Published"})
        .select('-created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, pooja);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};