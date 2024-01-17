const axios = require('axios');
const ApiResponse = require('../helpers/apiResponse');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

exports.searchLocationFromText = async(req, res) =>{
    try {
        const searchString = req.query.search;
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
            params: {
                input: searchString,
                inputtype: 'textquery',
                fields: 'formatted_address,name,rating,opening_hours,geometry',
                key: API_KEY
            }
        });

        ApiResponse.success(res,response?.data?.candidates);
    } catch (error) {
        ApiResponse.error(res,"Something went wrong.", 500, error?.message);
    }
}

exports.autoComplete = async (req, res) => {
    try {
        const searchString = req.query.search;
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: searchString,
                key: API_KEY
            }
        });

        ApiResponse.success(res,response?.data?.predictions);
    } catch (error) {
        ApiResponse.error(res,"Something went wrong.", 500, error?.message);
    }
}

exports.placeDetails = async (req, res) => {
    try {
        const placeId = req.query.place_id;
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                fields: 'name,rating,formatted_phone_number,geometry',
                key: API_KEY
            }
        });

        ApiResponse.success(res,response?.data?.result);
    } catch (error) {
        ApiResponse.error(res,"Something went wrong.", 500, error?.message);
    }
}

exports.currentPlace = async (req, res) => {
    try {
        const {lat, long} = req.query;
        console.log(lat, long, Number(lat), Number(long))

        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number(lat)},${Number(long)}&result_type=street_address&key=${API_KEY}`);

        ApiResponse.success(res,response?.data);
    } catch (error) {
        // console.log(error);
        ApiResponse.error(res,"Something went wrong.", 500, error?.message);
    }
}