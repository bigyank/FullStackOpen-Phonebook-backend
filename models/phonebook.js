const { Schema, model } = require("mongoose");

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
});

personSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  userObject.id = userObject._id.toString();
  delete userObject._id;
  delete userObject.__v;
  return userObject;
};

const Person = model("Person", personSchema);

module.exports = Person;
