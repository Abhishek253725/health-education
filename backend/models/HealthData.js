const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  heartRate: {
    type: Number,
    required: true,
    min: 40,
    max: 200
  },
  sleepHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  activityLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  mood: {
    type: String,
    enum: ['happy', 'neutral', 'sad', 'anxious', 'stressed'],
    default: 'neutral'
  },
  notes: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
healthDataSchema.index({ student: 1, timestamp: -1 });

// Method to check if health data is concerning
healthDataSchema.methods.isAbnormal = function() {
  return (
    this.heartRate > 100 || 
    this.heartRate < 60 ||
    this.sleepHours < 6 ||
    this.stressLevel > 7
  );
};

module.exports = mongoose.model('HealthData', healthDataSchema);
