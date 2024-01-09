const Tier = require('../models/Tier/tier'); // Assuming your schema is saved in models/Tier
const ApiResponse = require('../helpers/apiResponse');
// Create a new tier
exports.createTier = async (req, res) => {
    try {
        const {
            tier_name,
            pooja_items_included,
            post_pooja_cleanUp_included,
            min_pandit_experience,
            max_pandit_experience,
            number_of_main_pandit,
            number_of_assistant_pandit,
            status,
        } = req.body;

        const newTier = await Tier.create({
            tier_name,
            pooja_items_included,
            post_pooja_cleanUp_included,
            min_pandit_experience,
            max_pandit_experience,
            number_of_main_pandit,
            number_of_assistant_pandit,
            status,
            created_by:req.user._id,
            last_modified_by:req.user._id
        });
        ApiResponse.created(res, newTier, 'Tier created');
        
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get all tiers
exports.getTiers = async (req, res) => {
    try {
        const tiers = await Tier.find();
        ApiResponse.success(res,tiers);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
exports.getActiveTiers = async (req, res) => {
    try {
        const tiers = await Tier.find({status:"Active"});
        ApiResponse.success(res,tiers);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get a specific tier by ID
exports.getTierById = async (req, res) => {
    try {
        const tier = await Tier.findById(req.params.id);
        if (!tier) return ApiResponse.notFound(res,'Tier not found');
        ApiResponse.success(res,tier);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};


// Edit a tier
exports.editTier = async (req, res) => {
    try {
        const updatedTier = await Tier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTier) return ApiResponse.notFound(res,'Tier not found');
        ApiResponse.success(res,updatedTier);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
