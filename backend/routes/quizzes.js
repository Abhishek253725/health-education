const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const { auth, authorize } = require('../middleware/auth');

// Get all quizzes
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // If student, include attempt status
    if (req.user.role === 'student') {
      const quizzesWithStatus = await Promise.all(
        quizzes.map(async (quiz) => {
          const attempt = await QuizAttempt.findOne({
            quiz: quiz._id,
            student: req.userId
          });

          return {
            ...quiz.toObject(),
            attempted: !!attempt,
            lastScore: attempt ? attempt.percentage : null
          };
        })
      );

      return res.json({ quizzes: quizzesWithStatus });
    }

    res.json({ quizzes });
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get single quiz
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create quiz (Teacher only)
router.post('/', auth, authorize('teacher'), async (req, res) => {
  try {
    const { title, description, subject, questions, duration } = req.body;

    const quiz = new Quiz({
      title,
      description,
      subject,
      questions,
      duration,
      createdBy: req.userId
    });

    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update quiz (Teacher only)
router.put('/:id', auth, authorize('teacher'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if teacher owns this quiz
    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this quiz' });
    }

    const { title, description, subject, questions, duration, isActive } = req.body;

    quiz.title = title || quiz.title;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.subject = subject || quiz.subject;
    quiz.questions = questions || quiz.questions;
    quiz.duration = duration || quiz.duration;
    quiz.isActive = isActive !== undefined ? isActive : quiz.isActive;

    await quiz.save();

    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete quiz (Teacher only)
router.delete('/:id', auth, authorize('teacher'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if teacher owns this quiz
    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this quiz' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Submit quiz attempt (Student only)
router.post('/:id/attempt', auth, authorize('student'), async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    let score = 0;

    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        score += question.points;
      }

      return {
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      };
    });

    const percentage = (score / quiz.totalPoints) * 100;

    const attempt = new QuizAttempt({
      quiz: quiz._id,
      student: req.userId,
      answers: processedAnswers,
      score,
      percentage,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeTaken
    });

    await attempt.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      attempt: {
        score,
        percentage,
        correctAnswers,
        totalQuestions: quiz.questions.length
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get student's quiz attempts
router.get('/attempts/my-attempts', auth, authorize('student'), async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.userId })
      .populate('quiz', 'title subject')
      .sort({ attemptedAt: -1 });

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// Get all attempts for a quiz (Teacher only)
router.get('/:id/attempts', auth, authorize('teacher'), async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ quiz: req.params.id })
      .populate('student', 'name email studentId')
      .sort({ attemptedAt: -1 });

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz attempts' });
  }
});

module.exports = router;
