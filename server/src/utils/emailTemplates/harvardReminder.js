import escape from 'escape-html';

const formatSchool = (school) => {
    if (!['CMU', 'NYU', 'UMD', 'UIUC'].includes(school)) {
        return school.charAt(0).toUpperCase() + school.slice(1).toLowerCase();
    }
    return school;
};

// Note that this sends for a single user at a time; not in batch emails
export default (user, surveyUrl, school, senderEmail, unsubscribeUrl) => ({
    Destination: {
        ToAddresses: [user.email], // Email address/addresses that you want to send your email
    },
    Message: {
        Body: {
            Html: {
                // HTML Format of the email
                Charset: 'UTF-8',
                Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                      <style type="text/css">
                    body, p, div {
                      font-family: arial,helvetica,sans-serif;
                      font-size: 14px;
                    }
                    body {
                      color: #000000;
                    }
                    body a {
                      color: #1188E6;
                      text-decoration: none;
                    }
                    p { margin: 0; padding: 0; }
                    table.wrapper {
                      width:100% !important;
                      table-layout: fixed;
                      -webkit-font-smoothing: antialiased;
                      -webkit-text-size-adjust: 100%;
                      -moz-text-size-adjust: 100%;
                      -ms-text-size-adjust: 100%;
                    }
                    img.max-width {
                      max-width: 100% !important;
                    }
                    .column.of-2 {
                      width: 50%;
                    }
                    .column.of-3 {
                      width: 33.333%;
                    }
                    .column.of-4 {
                      width: 25%;
                    }
                    @media screen and (max-width:480px) {
                      .preheader .rightColumnContent,
                      .footer .rightColumnContent {
                        text-align: left !important;
                      }
                      .preheader .rightColumnContent div,
                      .preheader .rightColumnContent span,
                      .footer .rightColumnContent div,
                      .footer .rightColumnContent span {
                        text-align: left !important;
                      }
                      .preheader .rightColumnContent,
                      .preheader .leftColumnContent {
                        font-size: 80% !important;
                        padding: 5px 0;
                      }
                      table.wrapper-mobile {
                        width: 100% !important;
                        table-layout: fixed;
                      }
                      img.max-width {
                        height: auto !important;
                        max-width: 100% !important;
                      }
                      a.bulletproof-button {
                        display: block !important;
                        width: auto !important;
                        font-size: 80%;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                      }
                      .columns {
                        width: 100% !important;
                      }
                      .column {
                        display: block !important;
                        width: 100% !important;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                      }
                      .social-icon-column {
                        display: inline-block !important;
                      }
                    }
                  </style>
                    </head>
                    <body>
                      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
                        <div class="webkit">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                            <tr>
                              <td valign="top" bgcolor="#FFFFFF" width="100%">
                                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="100%">
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td>
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                              <tr>
                                                <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                <tr>
                      <td role="module-content">
                        <p></p>
                      </td>
                    </tr>
                  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f4a03b9f-a913-410c-89bb-2758cf1374ff">
                    <tbody>
                      <tr>
                        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/f9299102ca3c5b0a/531437e0-e503-438c-ae38-35d93c3389f8/820x312.png">
                        </td>
                      </tr>
                    </tbody>
                  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bc8c2188-18ce-4d81-b92b-c661fc56f24f" data-mc-module-version="2019-10-22">
                    <tbody>
                      <tr>
                        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">Dear SEAS,</div>
                <div style="font-family: inherit; text-align: inherit"><br></div>
                <div style="font-family: inherit; text-align: inherit">
                  WiCS is surveying students studying computer science and related fields for the <a href="https://percentageproject.com/#/">Percentage Project</a>, a storytelling initiative that highlights the experiences of underrepresented minorities in STEM. We are seeking perspectives from undergraduates of all identities, and all responses are anonymous. Your input will help us advocate for a more inclusive environment in SEAS.<br><br>
                  For each response received, WiCS will donate $1 to <a href="https://d4bl.org/">Data 4 Black Lives</a>, with $100 extra donated if we reach 300 responses. We’ve raised $101 so far through your peers’ responses, and we hope to hit our goal of 300 to reach the bonus donation.
                </div><div></div></div></td>
                      </tr>
                    </tbody>
                  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="771066b2-ef00-4cd7-9720-c8696cf3d511">
                      <tbody>
                        <tr>
                          <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
                            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                              <tbody>
                                <tr>
                                <td align="center" bgcolor="#333333" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                  <a href=${escape(surveyUrl)} style="background-color:#333333; border:1px solid #333333; border-color:#333333; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Take the Survey</a>
                                </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b331b37b-82b8-46ed-a5a9-813e46a8cb27" data-mc-module-version="2019-10-22">
                    <tbody>
                      <tr>
                        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">
                        If you have any questions about the survey or the project, please contact <a href="mailto:harvardwomenincs@gmail.com">harvardwomenincs@gmail.com</a>. Thank you so much for your participation, and wishing you the best in the new year.
                        </div>
                <div style="font-family: inherit; text-align: inherit"><br></div>
                <div style="font-family: inherit; text-align: inherit"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">Warmly,
                <div style="font-family: inherit; text-align: inherit">Harvard WiCS<br><br><i>**Total donation capped at $400</i></div>
                      </tr>
                    </tbody>
                  </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5"><p style="font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href=${escape(unsubscribeUrl)} target="_blank" style="">Unsubscribe</a></p></div></td>
                                                      </tr>
                                                    </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </center>
                    </body>
                  </html>
                `,
            },
            Text: {
                Charset: 'UTF-8',
                Data:
                  `Dear SEAS,

                  WiCS is surveying students studying computer science and related fields for the Percentage Project, a storytelling initiative that highlights the experiences of underrepresented minorities in STEM. We are seeking perspectives from undergraduates of all identities, and all responses are anonymous. Your input will help us advocate for a more inclusive environment in SEAS.
                  For each response received, WiCS will donate $1 to Data 4 Black Lives, with $100 extra donated if we reach 300 responses. We’ve raised $101 so far through your peers’ responses, and we hope to hit our goal of 300 to reach the bonus donation.
                  Take the Survey
                  If you have any questions about the survey or the project, please contact harvardwomenincs@gmail.com. Thank you so much for your participation, and wishing you the best in the new year.
                  
                  Warmly,
                  Harvard WiCS
                  ** Total donation capped at $400.
          
                  Unsubscribe
                  `,
            },
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Reminder: SEAS Climate Survey [Donation to Data 4 Black Lives on your behalf!]',
        },
    },
    Source: `The Percentage Project <${senderEmail}>`,
    ReplyToAddresses: [
        `The Percentage Project <${senderEmail}>`,
    ],
    ReturnPath: 'program@percentageproject.com',
});
