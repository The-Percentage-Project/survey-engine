import 'dotenv/config';
import Email from '../models/Email';
import { decrypt } from '../utils';
import { submissionStatus } from '../schema';
import mongoose from 'mongoose';

const { Consumer } = require('sqs-consumer');

const { DATABASE_URL, AWS_BOUNCEDQUEUE_URL } = process.env;

const app = Consumer.create({
  queueUrl: AWS_BOUNCEDQUEUE_URL,
  handleMessage: async function (message) {
    if (!message.Body)
      return;
    let sqsMessage = JSON.parse(message.Body);
    if (sqsMessage.notificationType === 'Bounce') {
      console.log("Message received from SQS with bounced emails");
      await handleBounces(sqsMessage.bounce.bouncedRecipients);
    }
  }
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();

async function handleBounces(bounces) {
  try {
    await mongoose
      .connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    console.log('DB connection successful in worker');
  }
  catch (err) {
    console.log(err);
  }

  const allSentEmails = await Email.find({ status: submissionStatus.sent });
  console.log("Found " + allSentEmails.length + " emails sent");

  const emails = allSentEmails.map((model) => (
    { model, email: decrypt(model.email) }
  ));

  for (const bounce of bounces) {
    const theBouncedEmail = emails.find(sentEmail => sentEmail.email === bounce.emailAddress);
    if (!theBouncedEmail.model) {
      console.log("Bounced email in SQS not in the DB");
      return;
    }
    console.log("Bounced email found in the DB, updating DB");
    theBouncedEmail.model.status = submissionStatus.bounced;
    await theBouncedEmail.model.save();
  };
}