const Bull = require('bull');
const nodemailer = require('nodemailer'); // Importing nodemailer for sending emails
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const db = require('./utils/db'); // Assuming db module for interacting with your DB is present

// Create Bull queues
const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

// Process fileQueue for generating thumbnails
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await db.findFileByIdAndUserId(fileId, userId);
  if (!file) {
    throw new Error('File not found');
  }

  const filePath = file.localPath;
  const sizes = [500, 250, 100];

  await Promise.all(sizes.map(async (size) => {
    const thumbnail = await imageThumbnail(filePath, { width: size });
    const newFilePath = `${filePath}_${size}`;
    fs.writeFileSync(newFilePath, thumbnail);
  }));
});

// userQueue for sending welcome emails
userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await db.findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  console.log(`Welcome ${user.email}!`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-email@example.com',
      pass: 'your-email-password',
    },
  });

  await transporter.sendMail({
    from: '"Your Application" <your-email@example.com>',
    to: user.email,
    subject: 'Welcome to Our Application!',
    text: `Hello ${user.email},\n\nWelcome to our application!`,
  });

  console.log(`Welcome email sent to ${user.email}`);
});

module.exports = {
  fileQueue,
  userQueue,
};
