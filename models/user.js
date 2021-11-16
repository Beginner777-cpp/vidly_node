const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const config = require('config');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean
  }
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
  
}
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  userSchema,
};
