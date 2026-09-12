const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/', async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const message = req.body.message?.trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  try {
    await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
