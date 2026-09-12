const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

const [username, password] = process.argv.slice(2);

const createAdmin = async () => {
  if (!username || !password) {
    console.error('Usage: node scripts/createAdmin.js <username> <password>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      console.error(`Admin username "${username}" already exists.`);
      process.exitCode = 1;
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      username,
      password: hashedPassword,
    });

    console.log(`Admin username "${username}" created successfully.`);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
