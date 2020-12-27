const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type:String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type:Boolean, default:false},
    isEmployee: {type: Boolean, default: false},
    idPharmacy: {type: mongoose.Schema.Types.ObjectId, ref:'Pharmacy'},
    birthday: { type: Date },
    gender: {type: String}
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
