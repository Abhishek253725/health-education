const express = require('express');
const router = express.Router();
const QuizAttempt = require('../models/QuizAttempt');
const HealthData = require('../models/HealthData');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// Get all registered students (for teachers)
router.get('/students/all', auth, authorize('teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get additional stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const attempts = await QuizAttempt.find({ student: student._id });
        const healthData = await HealthData.find({ student: student._id })
          .sort({ timestamp: -1 })
          .limit(7);

        const avgScore = attempts.length > 0
          ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
          : 0;

        const latestHealth = healthData[0] || null;
        const avgSleep = healthData.length > 0
          ? healthData.reduce((sum, h) => sum + h.sleepHours, 0) / healthData.length
          : 0;

        const avgStress = healthData.length > 0
          ? healthData.reduce((sum, h) => sum + h.stressLevel, 0) / healthData.length
          : 0;

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          class: student.class,
          createdAt: student.createdAt,
          stats: {
            totalQuizzes: attempts.length,
            avgScore: avgScore.toFixed(1),
            avgSleep: avgSleep.toFixed(1),
            avgStress: avgStress.toFixed(1),
            latestHealth: latestHealth ? {
              heartRate: latestHealth.heartRate,
              sleepHours: latestHealth.sleepHours,
              stressLevel: latestHealth.stressLevel,
              mood: latestHealth.mood
            } : null
          }
        };
      })
    );

    res.json({
      success: true,
      count: studentsWithStats.length,
      students: studentsWithStats
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student performance analytics
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get quiz attempts
    const attempts = await QuizAttempt.find({ student: studentId })
      .populate('quiz', 'title subject')
      .sort({ attemptedAt: -1 })
      .limit(10);

    // Get health data
    const healthData = await HealthData.find({ student: studentId })
      .sort({ timestamp: -1 })
      .limit(30);

    // Calculate performance metrics
    const avgScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
      : 0;

    const totalQuizzes = attempts.length;
    const passedQuizzes = attempts.filter(a => a.percentage >= 60).length;

    // Calculate health metrics
    const avgSleep = healthData.length > 0
      ? healthData.reduce((sum, h) => sum + h.sleepHours, 0) / healthData.length
      : 0;

    const avgStress = healthData.length > 0
      ? healthData.reduce((sum, h) => sum + h.stressLevel, 0) / healthData.length
      : 0;

    res.json({
      performance: {
        avgScore: avgScore.toFixed(2),
        totalQuizzes,
        passedQuizzes,
        recentAttempts: attempts
      },
      health: {
        avgSleep: avgSleep.toFixed(1),
        avgStress: avgStress.toFixed(1),
        recentData: healthData.slice(0, 7)
      }
    });
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get teacher dashboard analytics
router.get('/teacher/dashboard', auth, authorize('teacher'), async (req, res) => {
  try {
    // Get all students
    const students = await User.find({ role: 'student' });
    const studentIds = students.map(s => s._id);

    // Get all quiz attempts
    const allAttempts = await QuizAttempt.find({ student: { $in: studentIds } });

    // Calculate class average
    const classAverage = allAttempts.length > 0
      ? allAttempts.reduce((sum, a) => sum + a.percentage, 0) / allAttempts.length
      : 0;

    // Get low performers (< 60%)
    const recentAttempts = await QuizAttempt.find({ student: { $in: studentIds } })
      .populate('student', 'name email studentId')
      .sort({ attemptedAt: -1 })
      .limit(50);

    const lowPerformers = recentAttempts.filter(a => a.percentage < 60);

    // Get students with health concerns
    const healthConcerns = [];
    for (const student of students) {
      const latestHealth = await HealthData.findOne({ student: student._id })
        .sort({ timestamp: -1 });

      if (latestHealth && latestHealth.isAbnormal()) {
        healthConcerns.push({
          student: {
            id: student._id,
            name: student.name,
            studentId: student.studentId
          },
          healthData: latestHealth
        });
      }
    }

    res.json({
      totalStudents: students.length,
      classAverage: classAverage.toFixed(2),
      totalAttempts: allAttempts.length,
      lowPerformers: lowPerformers.slice(0, 10),
      healthConcerns
    });
  } catch (error) {
    console.error('Teacher analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch teacher analytics' });
  }
});

// Get parent dashboard analytics
router.get('/parent/:childId', auth, authorize('parent'), async (req, res) => {
  try {
    const { childId } = req.params;

    // Verify parent-child relationship
    if (req.user.parentOf?.toString() !== childId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get child's data
    const child = await User.findById(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Get quiz attempts
    const attempts = await QuizAttempt.find({ student: childId })
      .populate('quiz', 'title subject')
      .sort({ attemptedAt: -1 })
      .limit(10);

    // Get health data
    const healthData = await HealthData.find({ student: childId })
      .sort({ timestamp: -1 })
      .limit(7);

    // Calculate metrics
    const avgScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
      : 0;

    const avgSleep = healthData.length > 0
      ? healthData.reduce((sum, h) => sum + h.sleepHours, 0) / healthData.length
      : 0;

    const avgStress = healthData.length > 0
      ? healthData.reduce((sum, h) => sum + h.stressLevel, 0) / healthData.length
      : 0;

    // Generate notifications
    const notifications = [];
    if (avgSleep < 6) {
      notifications.push({
        type: 'warning',
        message: 'Child is not getting enough sleep',
        value: avgSleep.toFixed(1)
      });
    }

    if (avgStress > 7) {
      notifications.push({
        type: 'danger',
        message: 'Child is experiencing high stress levels',
        value: avgStress.toFixed(1)
      });
    }

    if (avgScore < 60) {
      notifications.push({
        type: 'warning',
        message: 'Academic performance needs attention',
        value: avgScore.toFixed(1)
      });
    }

    res.json({
      child: {
        name: child.name,
        studentId: child.studentId,
        class: child.class
      },
      performance: {
        avgScore: avgScore.toFixed(2),
        totalQuizzes: attempts.length,
        recentAttempts: attempts
      },
      health: {
        avgSleep: avgSleep.toFixed(1),
        avgStress: avgStress.toFixed(1),
        recentData: healthData
      },
      notifications
    });
  } catch (error) {
    console.error('Parent analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch parent analytics' });
  }
});

module.exports = router;
