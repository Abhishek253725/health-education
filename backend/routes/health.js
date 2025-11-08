const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');
const { auth, authorize } = require('../middleware/auth');

// Get health data for a student
router.get('/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { days = 7 } = req.query;

    // Check authorization
    if (req.user.role === 'student' && req.userId !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const healthData = await HealthData.find({
      student: studentId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    res.json({ healthData });
  } catch (error) {
    console.error('Fetch health data error:', error);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

// Add health data
router.post('/', auth, async (req, res) => {
  try {
    const { heartRate, sleepHours, stressLevel, activityLevel, mood, notes } = req.body;

    const healthData = new HealthData({
      student: req.user.role === 'student' ? req.userId : req.body.studentId,
      heartRate,
      sleepHours,
      stressLevel,
      activityLevel,
      mood,
      notes
    });

    await healthData.save();

    res.status(201).json({
      message: 'Health data recorded successfully',
      healthData
    });
  } catch (error) {
    console.error('Add health data error:', error);
    res.status(500).json({ error: 'Failed to record health data' });
  }
});

// Get health analytics
router.get('/:studentId/analytics', auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    const healthData = await HealthData.find({ student: studentId })
      .sort({ timestamp: -1 })
      .limit(30);

    if (healthData.length === 0) {
      return res.json({
        analytics: {
          avgHeartRate: 0,
          avgSleepHours: 0,
          avgStressLevel: 0,
          alerts: []
        }
      });
    }

    // Calculate averages
    const avgHeartRate = healthData.reduce((sum, d) => sum + d.heartRate, 0) / healthData.length;
    const avgSleepHours = healthData.reduce((sum, d) => sum + d.sleepHours, 0) / healthData.length;
    const avgStressLevel = healthData.reduce((sum, d) => sum + d.stressLevel, 0) / healthData.length;

    // Generate alerts
    const alerts = [];
    const latestData = healthData[0];

    if (latestData.heartRate > 100 || latestData.heartRate < 60) {
      alerts.push({
        type: 'warning',
        message: 'Abnormal heart rate detected',
        value: latestData.heartRate
      });
    }

    if (latestData.sleepHours < 6) {
      alerts.push({
        type: 'warning',
        message: 'Insufficient sleep detected',
        value: latestData.sleepHours
      });
    }

    if (latestData.stressLevel > 7) {
      alerts.push({
        type: 'danger',
        message: 'High stress level detected',
        value: latestData.stressLevel
      });
    }

    res.json({
      analytics: {
        avgHeartRate: Math.round(avgHeartRate),
        avgSleepHours: avgSleepHours.toFixed(1),
        avgStressLevel: avgStressLevel.toFixed(1),
        alerts,
        latestData
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

// Simulate IoT data (for demo purposes)
router.post('/simulate/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Generate random but realistic health data
    const healthData = new HealthData({
      student: studentId,
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
      sleepHours: Math.random() * 4 + 5, // 5-9 hours
      stressLevel: Math.floor(Math.random() * 10), // 0-10
      activityLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
      mood: ['happy', 'neutral', 'sad', 'anxious', 'stressed'][Math.floor(Math.random() * 5)],
      notes: 'Auto-generated IoT data'
    });

    await healthData.save();

    res.status(201).json({
      message: 'Simulated health data generated',
      healthData
    });
  } catch (error) {
    console.error('Simulate data error:', error);
    res.status(500).json({ error: 'Failed to simulate health data' });
  }
});

module.exports = router;
