const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const db = require('./utils/db'); // Assuming db module for interacting with your DB is present

const fileQueue = new Bull('fileQueue');

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

module.exports = fileQueue;
