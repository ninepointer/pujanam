const DeviDevta = require('../../models/Devi-Devta/devi-devta');
const ApiResponse = require('../../helpers/apiResponse');


exports.getDevtaById = async (req, res) => {
    try {
        const devta = await DeviDevta.findById(req.params.id)
        .populate('other_names', 'name')
        .populate('associated_devi_devta', 'name')
        .select('-created_by -created_on -last_modified_by -last_modified_on -__v');
        if (!devta) {
            return ApiResponse.notFound(res, 'DeviDevta not found');
        }
        ApiResponse.success(res, devta);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllDevta = async (req, res) => {
    try {
        const devta = await DeviDevta.find({ status: 'Active' })
        .populate('other_names', 'name')
        .populate('associated_devi_devta', 'name')
        .select('-created_by -created_on -last_modified_by -last_modified_on -__v')
        const count = devta?.length
        ApiResponse.success(res, devta, count);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};
