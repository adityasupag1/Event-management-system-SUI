const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: String,
  duration: {
    type: String,
    enum: ['6 months', '1 year', '2 years'],
    required: true,
    default: '6 months'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Expired'],
    default: 'Active'
  }
}, { timestamps: true });

membershipSchema.pre('save', function(next) {
  if (!this.endDate) {
    const startDate = new Date(this.startDate);
    if (this.duration === '6 months') {
      startDate.setMonth(startDate.getMonth() + 6);
    } else if (this.duration === '1 year') {
      startDate.setFullYear(startDate.getFullYear() + 1);
    } else if (this.duration === '2 years') {
      startDate.setFullYear(startDate.getFullYear() + 2);
    }
    this.endDate = startDate;
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);
