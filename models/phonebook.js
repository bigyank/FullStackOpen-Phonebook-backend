const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'name must be more than 3 characters'],
  },
  number: {
    type: String,
    required: true,
    minlength: [8, 'minimum number of digits is 8'],
  },
});
personSchema.plugin(uniqueValidator);

personSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  userObject.id = userObject._id.toString();
  delete userObject._id;
  delete userObject.__v;
  return userObject;
};

const Person = model('Person', personSchema);

module.exports = Person;
