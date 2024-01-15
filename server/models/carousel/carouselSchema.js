const mongoose = require("mongoose");
const { Schema } = mongoose;

const carouselSchema = new mongoose.Schema({
    carouselName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    carouselStartDate:{
        type:Date,
        required: true
    },
    carouselEndDate:{
        type:Date,
        required: true
    },
    carouselPosition:{
        type: Number,
        required: true,
    },
    window:{
        type: String,
        required: false
    },
    visibility:{
        type: String,
        required: true,
        default: "All"
    },
    status:{
        type:String,
        required:true,
        enum: ['Live','Draft','Rejected']
    },
    position:{
        type:String,
        required:true,
        enum: ['Home','Mandir','Dham','Popular','Shop','Services','Pooja',]
    },
    clickable:{
        type: Boolean,
        required: true,
    },
    linkToCarousel:{
        type: String,
        required: false,
    },
    carouselImage:{
        type:String,
        required: true,
    },
    clickedBy: [
        {
            userId:{type:Schema.Types.ObjectId,ref: 'user'},
            clickedOn:{type:Date, default: ()=>new Date()}
        }
    ],
    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        // required : true
    },
})

const carouselData = mongoose.model("carousel", carouselSchema);
module.exports = carouselData;