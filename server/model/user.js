const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userSchema = new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}
});



userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);