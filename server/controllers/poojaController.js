const Pooja = require('../models/Pooja/poojaSchema');
const ApiResponse = require('../helpers/ApiResponse');

// Create a Pooja
exports.createPooja = async (req, res) => {
    try {
        const {
            pooja_name,
            pooja_description,
            pooja_includes,
            purpose_of_pooja,
            benefits_of_pooja,
            pooja_image,
            pooja_items,
            pooja_duration,
            pooja_packages,
            pooja_type,
            status,
            faq,
            created_by
        } = req.body;

        const newPooja = new Pooja({
            pooja_name,
            pooja_description,
            pooja_includes,
            purpose_of_pooja,
            benefits_of_pooja,
            pooja_image,
            pooja_items,
            pooja_duration,
            pooja_packages,
            pooja_type,
            status,
            faq,
            created_by
        });
        ApiResponse.created(res, newPooja, 'Pooja created successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get a Pooja by ID
exports.getPoojaById = async (req, res) => {
    try {
        const pooja = await Pooja.findById(req.params.id);
        if (!pooja) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, pooja);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Edit a Pooja
exports.editPooja = async (req, res) => {
    try {
        const updatedPooja = await Pooja.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPooja) {
            return ApiResponse.notFound(res, 'Pooja not found');
        }
        ApiResponse.success(res, updatedPooja, 'Pooja updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllPoojas = async (req, res) => {
    try {
        const poojas = await Pooja.find();
        ApiResponse.success(res, poojas);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get only active Poojas
exports.getActivePoojas = async (req, res) => {
    try {
        const activePoojas = await Pooja.find({ status: 'Published' });
        ApiResponse.success(res, activePoojas);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
