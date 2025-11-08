const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// Mark attendance for students (Teacher only)
router.post('/mark', auth, authorize('teacher'), async (req, res) => {
  try {
    const { studentId, status, subject, notes, date } = req.body;

    // Validate student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Use provided date or today's date (start of day)
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this student on this date
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: attendanceDate,
      subject: subject || 'General'
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.notes = notes || '';
      existingAttendance.teacher = req.user.id;
      existingAttendance.markedAt = new Date();
      await existingAttendance.save();

      return res.json({
        success: true,
        message: 'Attendance updated successfully',
        attendance: existingAttendance
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      student: studentId,
      teacher: req.user.id,
      date: attendanceDate,
      status,
      subject: subject || 'General',
      notes: notes || ''
    });

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark bulk attendance (multiple students at once)
router.post('/mark-bulk', auth, authorize('teacher'), async (req, res) => {
  try {
    const { attendanceRecords, date, subject } = req.body;
    // attendanceRecords: [{ studentId, status, notes }]

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const record of attendanceRecords) {
      try {
        const existingAttendance = await Attendance.findOne({
          student: record.studentId,
          date: attendanceDate,
          subject: subject || 'General'
        });

        if (existingAttendance) {
          existingAttendance.status = record.status;
          existingAttendance.notes = record.notes || '';
          existingAttendance.teacher = req.user.id;
          existingAttendance.markedAt = new Date();
          await existingAttendance.save();
          results.push(existingAttendance);
        } else {
          const attendance = new Attendance({
            student: record.studentId,
            teacher: req.user.id,
            date: attendanceDate,
            status: record.status,
            subject: subject || 'General',
            notes: record.notes || ''
          });
          await attendance.save();
          results.push(attendance);
        }
      } catch (err) {
        errors.push({ studentId: record.studentId, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance for a specific date (Teacher only)
router.get('/date/:date', auth, authorize('teacher'), async (req, res) => {
  try {
    const { date } = req.params;
    const { subject } = req.query;

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const query = { date: attendanceDate };
    if (subject) {
      query.subject = subject;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'name email studentId class')
      .populate('teacher', 'name')
      .sort({ 'student.name': 1 });

    // Get all students to show who hasn't been marked
    const allStudents = await User.find({ role: 'student' })
      .select('name email studentId class')
      .sort({ name: 1 });

    const markedStudentIds = attendanceRecords.map(a => a.student._id.toString());
    const unmarkedStudents = allStudents.filter(
      s => !markedStudentIds.includes(s._id.toString())
    );

    res.json({
      success: true,
      date: attendanceDate,
      marked: attendanceRecords,
      unmarked: unmarkedStudents,
      summary: {
        total: allStudents.length,
        marked: attendanceRecords.length,
        unmarked: unmarkedStudents.length,
        present: attendanceRecords.filter(a => a.status === 'present').length,
        absent: attendanceRecords.filter(a => a.status === 'absent').length,
        late: attendanceRecords.filter(a => a.status === 'late').length,
        excused: attendanceRecords.filter(a => a.status === 'excused').length
      }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance report for a student (Teacher, Student, Parent)
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, subject } = req.query;

    // Authorization check
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = { student: studentId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (subject) {
      query.subject = subject;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('teacher', 'name')
      .sort({ date: -1 });

    const summary = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(a => a.status === 'present').length,
      absent: attendanceRecords.filter(a => a.status === 'absent').length,
      late: attendanceRecords.filter(a => a.status === 'late').length,
      excused: attendanceRecords.filter(a => a.status === 'excused').length
    };

    summary.attendanceRate = summary.total > 0 
      ? ((summary.present + summary.late) / summary.total * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      records: attendanceRecords,
      summary
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance statistics (Teacher only)
router.get('/statistics', auth, authorize('teacher'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'name email studentId class');

    // Calculate statistics
    const studentStats = {};

    attendanceRecords.forEach(record => {
      const studentId = record.student._id.toString();
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.student,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0
        };
      }
      studentStats[studentId][record.status]++;
      studentStats[studentId].total++;
    });

    // Convert to array and calculate attendance rate
    const statistics = Object.values(studentStats).map(stat => ({
      ...stat,
      attendanceRate: ((stat.present + stat.late) / stat.total * 100).toFixed(1)
    }));

    // Sort by attendance rate (lowest first - students needing attention)
    statistics.sort((a, b) => parseFloat(a.attendanceRate) - parseFloat(b.attendanceRate));

    res.json({
      success: true,
      statistics,
      overall: {
        totalRecords: attendanceRecords.length,
        totalStudents: Object.keys(studentStats).length,
        averageAttendanceRate: statistics.length > 0
          ? (statistics.reduce((sum, s) => sum + parseFloat(s.attendanceRate), 0) / statistics.length).toFixed(1)
          : 0
      }
    });
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete attendance record (Teacher only)
router.delete('/:attendanceId', auth, authorize('teacher'), async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const attendance = await Attendance.findByIdAndDelete(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
