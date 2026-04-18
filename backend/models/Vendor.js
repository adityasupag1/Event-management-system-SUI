const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 4
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Catering', 'Florist', 'Decoration', 'Lighting']
  },
  contactDetails: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'vendor',
    enum: ['vendor']
  },
  membership: {
    duration: {
      type: String,
      enum: ['6 months', '1 year', '2 years'],
      default: '6 months'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    }
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive']
  }
}, { timestamps: true });

vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

vendorSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);
