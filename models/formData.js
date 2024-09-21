const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  Contact: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Eircode: { type: String, required: true },
  Address: { type: String, required: true },
  AddressNumber: { type: String, required: true },
  Complement: { type: String },
  Services: { type: String, required: true },
});

const FormData = mongoose.model('FormData', FormDataSchema);
module.exports = FormData;