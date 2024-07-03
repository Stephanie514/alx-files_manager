const Bull = require('bull');

// Defining your Bull queues
const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

// Process functions for queues
fileQueue.process(async (job) => {
  // Processing logic for fileQueue if needed
  console.log('Processing fileQueue job:', job.data);
});

userQueue.process(async (job) => {
  const { userId } = job.data;

  // Simulating sending a welcome email
  console.log(`Sending welcome email to user ${userId}`);
});

module.exports = {
  fileQueue,
  userQueue,
};
