import 'dotenv/config';

import Queue from 'bull';
import mongoose from 'mongoose';
import throng from 'throng';

import Email from '../models/Email';
import { submissionStatus } from '../schema';

import { sendStatusEmail } from '../utils/aws';
import { decrypt } from '../utils';

// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const { DATABASE_URL, CORS_ORIGIN, WEB_CONCURRENCY } = process.env;

const workers = WEB_CONCURRENCY || 1;

async function start() {
    try {
        await mongoose
            .connect(DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
        console.log('DB connection successful in worker');
    } catch (err) {
        console.log(err);
    }

    const sendMailQueue = new Queue('sendMail', REDIS_URL);

    sendMailQueue.process(async (job) => {
        let count = 0;
        let error = 0;
        const { data } = job;

        // Find emails e.g. type school: BROWN, status: UNSENT
        const rawEmails = await Email.find({ school: data.school, status: data.requestType });

        const emails = rawEmails.map((model) => (
            { model, token: model.token, email: decrypt(model.email) }
        ));

        try {
            for (const email of emails) {
            // Make a survey URL for the thing that we need
                const surveyUrl = `${CORS_ORIGIN}/survey?xtoken=${email.token}&school=${data.school}`;
                const unsubscribeUrl = `${CORS_ORIGIN}/unsubscribe?token=${email.token}`;

                console.log('email');
                await sendStatusEmail(email, data.requestType, surveyUrl, data.school, data.senderEmail.email, unsubscribeUrl)
                    .then(async () => {
                        // Set it to sent if it hasn't already been sent
                        if (email.model.status !== submissionStatus.sent) {
                        // eslint-disable-next-line no-param-reassign
                            email.model.status = submissionStatus.sent;
                            await email.model.save();
                        }
                        count += 1;
                    })
                    .catch((err) => {
                        console.log(err);
                        error += 1;
                    });
                await new Promise((r) => setTimeout(r, 500)); // in milliseconds
            }
            console.log(`For ${data.school} and ${data.requestType}, ${count} emails were successfully sent. ${error} emails had an error.`);
        } catch (ex) {
            console.log(ex);
            job.moveToFailed();
        }
    });
}

throng({ workers, start });
