
const express = require('express');
const router = express.Router();
const Application = require('../models/todo');

const internships = [
  {
    id: '1',
    title: 'Web Development Intern',
    company: 'Tech Solutions',
    duration: '2 months',
    description: 'Build responsive websites using React and JavaScript.'
  },
  {
    id: '2',
    title: 'Python Developer Intern',
    company: 'Code Labs',
    duration: '3 months',
    description: 'Develop Python applications and work with databases.'
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    company: 'Analytics Hub',
    duration: '2 months',
    description: 'Analyze datasets and prepare useful reports.'
  }
];

// GET: retrieve available internships
router.get('/internships', (req, res) => {
  res.json(internships);
});

// GET: retrieve all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve applications' });
  }
});

// POST: save a new application
router.post('/applications', async (req, res) => {
  try {
    const { name, email, rollNo, internship } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !rollNo?.trim() ||
      !internship?.trim()
    ) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const application = new Application({
      name,
      email,
      rollNo,
      internship
    });

    const savedApplication = await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application: savedApplication
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid application details'
      });
    }

    res.status(500).json({
      message: 'Server error while submitting application'
    });
  }
});

module.exports = router;
