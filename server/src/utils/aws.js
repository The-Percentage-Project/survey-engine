import AWS from 'aws-sdk';
import { submissionStatus } from '../schema';
// IMPORT TEMPLATES HERE
import unsent from './emailTemplates/unsent';

const { AWS_REGION } = process.env;

if (AWS_REGION == null) {
    throw new Error('AWS_REGION not set');
}

AWS.config.update({ region: AWS_REGION });

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export function sendStatusEmail(user, status, surveyUrl) {
    // if (user.emailUnsubscribed) {
    //     logger.info('Skipping email to unsubscribed user', user);
    // }

    let email;
    // Handles sending types of emails for each
    switch (status) {
    // case submissionStatus.completed:
    //     email = submitted(user);
    //     break;
    // case submissionStatus.inProgress:
    //     email = accepted(user);
    //     break;
    // case submissionStatus.sent:
    //     email = confirmed(user);
    //     break;
    case submissionStatus.unsent:
        email = unsent(user, surveyUrl);
        break;
    default:
        throw new Error(`Unimplemented email for status "${status}" to user "${user.email}`);
    }

    return ses
        .sendEmail(email)
        .promise();
}

export default { sendStatusEmail };