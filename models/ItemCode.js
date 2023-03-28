import mongoose from "mongoose";

const ItemCodeSchema = new mongoose.Schema({
    fileName : {type: String, required: true},
    fileUrl : {type: String, required: true},
    status : {type: String, required: false},
    owner : {type: String, required: true},
    createdBy : {type: String, required: false},
    createDate : {type: Date, required: true, default: Date.now},
    updatedBy : {type: String, required: false, default: null},
    updateDate : {type: Date, required: false, default: null}    
});

const itemCodeModel = mongoose.model("ItemCode", ItemCodeSchema);

export default itemCodeModel;