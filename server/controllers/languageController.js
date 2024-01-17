const Language = require('../models/language');
const ApiResponse = require('../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder


exports.getLanguage = async (req, res) => {
    try {
        const languages = await Language.find();
        ApiResponse.success(res, languages);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};