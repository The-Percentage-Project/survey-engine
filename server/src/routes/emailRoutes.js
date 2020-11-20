import { Router } from 'express';
import passport from 'passport';
import Queue from 'bull';
import { submissionStatus, roles } from '../schema';
import Email from '../models/Email';
import { encrypt, decrypt, isEmail } from '../utils';
import SenderEmail from '../models/SenderEmail';

const router = Router();

// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

router.get('/:school', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { role, school } = req.user;

    if (role === roles.schoolAdmin && school === req.params.school) {
        Email.find({ school: req.params.school })
            .then((emails) => {
                let unsent = 0;
                let sent = 0;
                let inprogress = 0;
                let completed = 0;
                for (let i = 0; i < emails.length; i += 1) {
                    switch (emails[i].status) {
                    case submissionStatus.unsent:
                        unsent += 1;
                        break;
                    case submissionStatus.sent:
                        sent += 1;
                        break;
                    case submissionStatus.inProgress:
                        inprogress += 1;
                        break;
                    case submissionStatus.completed:
                        completed += 1;
                        break;
                    default:
                        break;
                    }
                }
                const total = unsent + sent + inprogress + completed;
                const counts = {
                    total, unsent, sent, inprogress, completed,
                };
                res.send(JSON.stringify(counts));
            })
            .catch((err) => res.status(400).send(JSON.stringify({ error: err.message })));
    } else {
        res.status(401).send(JSON.stringify({ error: 'Not authorized.' }));
    }
});

/**
 * Unsubscribes a user from future emails
 *
 * @param {req.body.token} – Expects the email token
 *
 */
router.post('/unsubscribe', async (req, res) => {
    const { token } = req.body;

    try {
        // Find the email by the token
        const email = await Email.findOne({ token });
        if (email) {
            email.status = submissionStatus.unsubscribed;
            await email.save();
            return res.status(200).send(JSON.stringify({ message: 'You have been successfully unsubscribed.' }));
        }
        return res.status(400).send(JSON.stringify({ error: 'Could not unsubscribe. Please contact hello@percentageproject.com' }));
    } catch (err) {
        return res.status(400).send(JSON.stringify({ error: err.message }));
    }
});

// Expects email to be an array of valid emails. Allows adding emails to that school
router.post('/:school', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { role, school } = req.user;

    const { emails } = req.body;

    if (role === roles.schoolAdmin && school === req.params.school) {
        let count = 0;
        let invalid = 0;
        let duplicates = 0;
        try {
            // Try to get all emails
            const allSchoolEmails = await Email.find({ school }, (err, docs) => {
                if (!err) {
                    return docs;
                }
                res.status(400).send(JSON.stringify({ error: err.message }));
                next();
            });

            // Decrypt all emails
            const decryptedEmails = allSchoolEmails.map((model) => decrypt(model.email));

            for (let i = 0; i < emails.length; i += 1) {
                if (isEmail(emails[i])) {
                    // Only add the email if it doesn't exist already in decrypted email
                    if (decryptedEmails.indexOf(emails[i]) === -1) {
                        const encrypted = encrypt(emails[i]);
                        const emailModel = new Email(
                            { email: encrypted, school, status: submissionStatus.unsent },
                        );

                        emailModel.save();
                        count += 1;
                    } else {
                        duplicates += 1;
                    }
                } else {
                    invalid += 1;
                }
            }
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }

        return res.send({ message: `${count} successfully added to ${school}. ${invalid} were invalid. There were ${duplicates} duplicates.` });
    }
    // next({ message: 'Not authorized.' });
});

/**
 * sendAllEmails route for a specific school. Should include the requestType in the body
 *
 */
router.post('/:school/sendEmails', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // need to validate emails as well
    const { school } = req.params;

    const { role, school: userSchool } = req.user;

    const { requestType } = req.body;

    if (role === roles.schoolAdmin && userSchool === school) {
        // Find emails e.g. type school: BROWN, status: UNSENT
        const senderEmail = await SenderEmail.findOne({ school });
        if (!senderEmail) {
            return res.status(400).send(JSON.stringify({ error: 'Please set a sender email first.' }));
        }

        // 1. Initiating the Queue
        const sendMailQueue = new Queue('sendMail', REDIS_URL);
        const data = {
            senderEmail,
            requestType,
            school,
        };

        // 2. Adding a Job to the Queue
        await sendMailQueue.add(data);
    } else {
        return res.status(401).send(JSON.stringify({ error: 'Not authorized.' }));
    }
    return res.send({ message: 'Sending emails' });
});

/**
 * Changes the email from which emails will be sent for a certain school
 *
 */
router.post('/:school/changeSenderEmail', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { school } = req.params;

    const { role, school: userSchool } = req.user;

    const { email } = req.body;

    if (role === roles.schoolAdmin && userSchool === school) {
        // Makes sure email is valid before continuing
        if (!isEmail(email)) {
            return res.status(400).send(JSON.stringify({ error: 'Invalid email.' }));
        }

        SenderEmail.findOne({ school }).then(async (document) => {
            // If the model didn't exist before, make a new model for this school
            if (!document) {
                const newSenderEmail = new SenderEmail({ email, school });
                await newSenderEmail.save();
            } else {
                // eslint-disable-next-line no-param-reassign
                document.email = email;
                await document.save();
            }
        });
    } else {
        return res.status(401).send(JSON.stringify({ error: 'Not authorized.' }));
    }

    return res.send(JSON.stringify({ message: `Sender email successfully updated to ${email}` }));
});

export default router;

// /**
//  * Update a single email's status. Expects the emailToken and status in the body.
//  */
// router.post('/updateEmailStatus', passport.authenticate('jwt'), async (req, res) => {
//     const { emailToken, status } = req.body;

//     // Should validate email before continuing

//     // Find the email by the token
//     const email = await Email.findOne({ token: emailToken });

//     // Update status and save
//     if (email.status !== submissionStatus.completed) {
//         email.status = status;
//         await email.save();

//         return res.json({ message: `${emailToken} successfully updated to ${status}`, status: email.status });
//     }
//     return res.status(400).send(`This email is already listed as ${submissionStatus.completed}.`);
// });

// router.get('/decrypt', async (req, res) => {
//     const allEmails = await Email.find();
//     allEmails.forEach((email) => {
//         console.log(email.email);
//         console.log(decrypt(email.email));
//     });
// });
