const mongoose = require("mongoose");
const { Schema } = mongoose;

const SettingSchema = new mongoose.Schema({
    booking_end_time: {
        type: Date,
        required: true,
    },
    booking_start_time: {
        type: Date,
        required: true
    },
    playstore_link:{
        type: String,
    },
    last_modified_on:{
        type: Date,
        default: function() {
          return Date.now();
        }
    },
    last_modified_by:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});
const Setting = mongoose.model('setting', SettingSchema);
module.exports = Setting;