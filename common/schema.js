import fs from 'fs';

/**
 * Exports shared schemas between client and server. Holds information specific to certain
 * universities.
 */
const schools = {
  unset: 'UNSET',
  brown: 'BROWN',
  penn: 'PENN',
  harvard: 'HARVARD',
  drexel: 'DREXEL',
  duke: 'DUKE',
  rutgers: 'RUTGERS',
  cmu: 'CMU',
  columbia: 'COLUMBIA',
  nyu: 'NYU',
  uiuc: 'UIUC',
  umd: 'UMD',
  vanderbilt: 'VANDERBILT',
  percentProj: 'PERCENTAGE_PROJECT',
};
const schoolsArray = Object.values(schools);

// Defines roles that are particular to admins. Vanilla users have no roles.
const roles = { unset: 'UNSET', schoolAdmin: 'SCHOOL_ADMIN', percentAdmin: 'PERCENTAGE_PROJECT_ADMIN' };
const rolesArray = Object.values(roles);

const submissionStatus = {
  unsent: 'UNSENT', sent: 'SENT', inProgress: 'IN-PROGRESS', completed: 'COMPLETED', unsubscribed: 'UNSUBSCRIBED',
};
const submissionStatusArray = Object.values(submissionStatus);

const generalSurveyStatus = {
  unsent: 'UNSENT', open: 'OPEN', closed: 'CLOSED',
};

const defaultCloseDate = '2021-01-01T04:59:00.000Z';
/**
 * Schema for questions. Note that the "type" field should be for Mongoose
 */
const commonQuestions = {
  // TODO: Actually fix the participation agreement so it doesn't look jank. This is a temporary hack.
  participationIntro: {
    id: 'participationIntro',
    heading: 'Consent for Participation in the Survey',
    text:
    `I agree to participate in an anonymous survey conducted by the Percentage Project. I understand that all responses that I provide in the survey will remain anonymous and that no identifying information about me will be made public. In addition, my email address and all other personally identifiable information will be purged from the data file and replaced with a unique and anonymous identification number when the survey is submitted.
    
    In order to analyze the survey responses, my answers will be combined with those given by other survey respondents. All data from the survey will be stored in a secured location and retained indefinitely by the Percentage Project.
    
    I understand that my participation in this survey is voluntary and that I can exit the survey at any time without penalty.
    
    I also understand that if I have any questions about the survey I can contact the Percentage Project by sending an email to hello@percentageproject.com. 
    
    This online survey should take approximately 5 minutes to complete. You can only take the survey once, and you will not be able to edit your responses once the survey is submitted.`,
    component: 'Text',
  },
  participation: {
    id: 'participation',
    question:
      'By checking the box below I understand my rights and give my consent to participate in the survey.',
    component: 'MultiCheckbox',
    options: ['I agree to participate.'],
    required: true,
    type: [String],
  },
  year: {
    id: 'year',
    question: 'What year are you in?',
    component: 'Radio',
    options: [
      'First year',
      'Sophomore',
      'Junior',
      'Senior',
      'Super Senior',
      'Graduate',
    ],
    required: true,
    type: String,
  },
  microaggression: {
    id: 'microaggression',
    question: 'Check all of the following that apply to you:',
    component: 'MultiCheckbox',
    options: [
      'I have experienced a microaggression. A microaggression is a comment that subtly and often unconsciously or unintentionally expresses a prejudiced attitude toward a member of a marginalized group.',
      'I have been interrupted or talked to condescendingly by someone who assumed they knew more.',
      'In a group project, my opinion is as respected as that of other group members.',
      'None of the above',
    ],
    required: true,
    type: [String],
  },
  respect: {
    id: 'respect',
    question: 'Check all of the following that apply to you:',
    component: 'MultiCheckbox',
    options: [
      'My peers respect me.',
      'I would tell my peers if they made discriminatory or inappropriate comments.',
      'My professors and TAs respect me.',
      'I have to prove myself before being taken seriously in academic settings.',
      'I would tell my professors or TAs if a discriminatory or inappropriate comment was made during class or office hours, either by another student, a TA, or the professor.',
      'None of the above',
    ],
    required: true,
    type: [String],
  },
  comfort: {
    id: 'comfort',
    question: 'Check all of the following that apply to you:',
    component: 'MultiCheckbox',
    options: [
      'I generally feel comfortable asking questions during lecture.',
      'I feel more comfortable in a class taught by a professor who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
      'I generally feel comfortable asking questions in office hours.',
      'I prefer to go to office hours led by someone who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
      'I ask questions on Piazza, anonymously or publicly.',
      'If Piazza didn’t allow for anonymous questions, I would not likely post on the platform.',
      'None of the above',
    ],
    required: true,
    type: [String],
  },
  roleModel: {
    id: 'roleModel',
    question: 'Do you have a faculty member whom you perceive as a role model?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: true,
    type: String,
  },
  leaving: {
    id: 'leaving',
    question: 'Have you seriously considered leaving your computer science-related field of study?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: true,
    type: String,
  },
  dropOut: {
    id: 'dropOut',
    question: 'Have you ever been encouraged to take leave or drop out by a faculty member or an administrator?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: true,
    type: String,
  },
  equal: {
    id: 'equal',
    question: 'At my university, students from every background have an equal chance to succeed.',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: true,
    type: String,
  },
  department: {
    id: 'department',
    question: 'I feel adequately supported by the CS department and the resources offered by the department.',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: true,
    type: String,
  },
  job: {
    id: 'job',
    question: 'Someone has once claimed to me that _____ has unfairly given me an advantage in gaining job opportunities. Check all that apply to you.',
    component: 'MultiCheckbox',
    options: [
      'my race/ethnicity',
      'my gender identity',
      'my sexual orientation',
      'my disability',
      'being a first generation student',
      'my income status',
      'None of the above',
    ],
    required: true,
    type: [String],
  },
  bias: {
    id: 'bias',
    question: 'Check all of the following that you agree with. I believe that conscious and unconscious biases against certain groups based on ______ still exist today.',
    component: 'MultiCheckbox',
    options: [
      'race/ethnicity',
      'gender identity',
      'sexual orientation',
      'disabilities',
      'parental education',
      'income status',
      'None of the above',
    ],
    required: true,
    type: [String],
  },
  groups: {
    id: 'groups',
    question: 'Do you believe organizations whose purpose is to support underrepresented or marginalized groups, such as (but not limited to) Women in Computer Science, Society of Hispanic Professional Engineers, National Society of Black Engineers, are still needed today?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: true,
    type: String,
  },
  contentWarning: {
    id: 'contentWarning',
    question: 'Content Warning: The following four questions contain references to sexual violence. Please press “Continue” to view these questions, or “Skip” to skip these questions.',
    component: 'Radio',
    options: [
      'Continue',
      'Skip',
    ],
    required: false,
    type: String,
  },
  harassment1: {
    id: 'harassment1',
    question: 'Sexual harassment is defined as unwelcome sexual advances, requests for sexual favors and other verbal or physical conduct of a sexual nature. Have you ever experienced any form of sexual harassment?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: false,
    type: String,
    contentWarning: true,
  },
  harassment2: {
    id: 'harassment2',
    question: 'Have you or someone you know been affected by sexual harassment?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: false,
    type: String,
    contentWarning: true,
  },
  assault1: {
    id: 'assault1',
    question: 'Sexual assault is defined as intentional sexual contact, characterized by use of force, threats, intimidation, abuse of authority or when the victim does not or cannot consent. Have you ever experienced any form of sexual assault?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: false,
    type: String,
    contentWarning: true,
  },
  assault2: {
    id: 'assault2',
    question: 'Have you or someone you know been affected by sexual assault?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Maybe',
    ],
    required: false,
    type: String,
    contentWarning: true,
  },
  idIntro: {
    id: 'idIntro',
    heading: 'Identification Questions',
    text: 'We do not discriminate on the basis of race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, income status, or nationality. In order to track the effectiveness of our diversity and inclusion efforts and ensure we consider the needs of all our students, please consider the following anonymous question(s):',
    component: 'Text',
  },
  gender: {
    id: 'gender',
    question: 'What is your gender?',
    component: 'Radio',
    options: [
      'Woman',
      'Man',
      'Non-binary',
      'Prefer to self-describe:',
      'Prefer not to say',
    ],
    required: true,
    type: String,
  },
  transgender: {
    id: 'transgender',
    question: 'Are you transgender?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Prefer not to say',
    ],
    required: true,
    type: String,
  },
  ethnicity: {
    id: 'ethnicity',
    question: 'Which categories best describe how you self-identify? Check all that apply.',
    component: 'MultiCheckbox',
    options: [
      'African American/Black',
      'Asian',
      'Hispanic/Latinx',
      'Middle Eastern/North African (MENA)',
      'Native American/Alaska Native/First Nations',
      'Native Hawaiian or other Pacific Islander',
      'White',
      'Prefer to self-describe:',
      'Prefer not to say',
    ],
    required: true,
    type: [String],
  },
  lgbq: {
    id: 'lgbq',
    question: 'Which of the following best describes your current sexual orientation? Check all that apply.',
    component: 'MultiCheckbox',
    options: [
      'Asexual',
      'Bisexual',
      'Gay/lesbian',
      'Heterosexual/straight',
      'Pansexual',
      'Queer',
      'Prefer to self-describe:',
      'Prefer not to say',
    ],
    required: true,
    type: [String],
  },
  disability: {
    id: 'disability',
    question: 'Do you have a disability, or have a history or record of having a disability?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Prefer not to say',
    ],
    required: true,
    type: String,
  },
  fg: {
    id: 'fg',
    question: 'Are you a first generation student?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Prefer not to say',
    ],
    required: true,
    type: String,
  },
  li: {
    id: 'li',
    question: 'Are you a low-income student?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Prefer not to say',
    ],
    required: true,
    type: String,
  },
  international: {
    id: 'international',
    question: 'Are you an international student?',
    component: 'Radio',
    options: [
      'Yes',
      'No',
      'Prefer not to say',
    ],
    required: true,
    type: String,
  },
};

/**
 * QUESTIONS SPECIFIC TO SCHOOLS
 *
 * These replace options and text that are specific to schools.
 * The questionOrder key handles what order the questions should appear in.
 *
 * Note: please make the ID field different from any other questions
 */
// These orders determine the frontend order of the questions.
// In the build step, we order the questions into a list to reduce load time
const demographicOrder = ['idIntro', 'gender', 'transgender', 'ethnicity', 'lgbq', 'disability', 'fg', 'li', 'international'];
const commonOrder = ['participationIntro', 'participation', 'year', 'major', 'confidence', 'microaggression', 'respect', 'comfort', 'roleModel', 'leaving', 'dropOut', 'equal', 'department', 'acceptance', 'job', 'bias', 'groups', 'contentWarning', 'harassment1', 'harassment2', 'assault1', 'assault2'];

const brownQuestions = {
  questionOrder: [...commonOrder.slice(0, 15), 'brown1', 'brown2', ...commonOrder.slice(15), ...demographicOrder],
  customQuestions: {
    year: {
      id: 'year',
      question: 'What year are you in?',
      component: 'Radio',
      options: [
        'First year',
        'Sophomore',
        'Junior',
        'Senior',
        'Graduate',
      ],
      required: true,
      type: String,
    },
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'Computer Science',
        'Applied Math-CS',
        'CS-Economics',
        'Math-CS',
        'Computational Biology',
        'CS-Engaged Scholars Program',
        'Applied Math',
        'Engineering',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Brown to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    respect: {
      id: 'respect',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'My peers respect me.',
        'I would tell my peers if they made discriminatory or inappropriate comments.',
        'My professors and TAs respect me.',
        'I have to prove myself before being taken seriously in academic settings.',
        'I would tell my professors or TAs if a discriminatory or inappropriate comment was made during class, office hours, or TA hours, either by another student, a TA, or the professor.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    comfort: {
      id: 'comfort',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I generally feel comfortable asking questions during lecture.',
        'I feel more comfortable in a class taught by a professor who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
        'I generally feel comfortable asking questions in office/TA hours.',
        'I prefer to go to office/TA hours led by someone who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
        'I ask questions on Piazza, anonymously or publicly.',
        'If Piazza didn’t allow for anonymous questions, I would not likely post on the platform.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Brown. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    brown1: {
      id: 'brown1',
      question: 'I feel that the CS Department has been accommodating to my experience as a student throughout the COVID-19 pandemic, given the additional challenges of time zone differences, internet connectivity, remote learning, etc.',
      component: 'Radio',
      options: [
        'Strongly Agree',
        'Agree',
        'Neutral',
        'Disagree',
        'Strongly Disagree',
      ],
      required: true,
      type: String,
    },
    brown2: {
      id: 'brown2',
      question: 'I miss the physical spaces of Brown’s CS community, such as the sunlab, CIT lobby, atrium, lecture halls, fishbowl, etc.',
      component: 'Radio',
      options: [
        'Strongly Agree',
        'Agree',
        'Neutral',
        'Disagree',
        'Strongly Disagree',
      ],
      required: true,
      type: String,
    },
  },
};
const pennQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'CIS Major in SEAS (including NETS, DMD)',
        'CIS Major in College',
        'ESE Major in SEAS (including EE, CMPE, SE)',
        'CIS Minor in SEAS (including NETS, DMD)',
        'CIS Minor in College',
        'ESE Minor in SEAS (including EE, CMPE, SE)',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Penn to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Penn Engineering. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
  },
};
const harvardQuestions = {
  questionOrder: [...commonOrder.slice(0, 4), 'harvard1', 'harvard2', ...commonOrder.slice(4), ...demographicOrder, 'harvard3', 'harvard4'],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which declared or intended plan of study fits you best.',
      component: 'Radio',
      options: [
        'CS concentration or secondary in SEAS',
        'Electrical Engineering concentration or secondary in SEAS',
        'Other concentration or secondary in SEAS',
        'Math concentration or secondary',
        'Statistics concentration or secondary',
        'Neuroscience concentration or secondary',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Harvard to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Harvard. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    comfort: {
      id: 'comfort',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I generally feel comfortable asking questions during lecture.',
        'I feel more comfortable in a class taught by a professor who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
        'I generally feel comfortable asking questions in office hours.',
        'I prefer to go to office hours led by someone who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
        'I ask questions on Piazza or Ed, anonymously or publicly.',
        'If Piazza or Ed didn’t allow for anonymous questions, I would not likely post on the platform.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    harvard1: {
      id: 'harvard1',
      question: 'At what age did you start programming?',
      component: 'Radio',
      options: [
        'Elementary school',
        'Middle school / junior high',
        'High school',
        'College',
      ],
      required: true,
      type: String,
    },
    harvard2: {
      id: 'harvard2',
      question: ' If you need extra support in a CS class, what do you do? Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'Attend office hours',
        'Work in a group',
        'Seek peer tutoring',
        'Ask questions on Ed/Piazza',
        'I prefer to work independently',
      ],
      required: true,
      type: [String],
    },
    harvard3: {
      id: 'harvard3',
      heading: '[Optional] Chat with Us?',
      component: 'TextWithLink',
      text1: 'Would you be interested in being interviewed by the Percentage Project about your experience? If so, please submit your email at ',
      text2: '. Please note that your email will be submitted separately from your other question responses.',
      url: 'https://tiny.cc/stem-interview',
    },
    harvard4: {
      id: 'harvard4',
      heading: '[Optional] Raffle',
      component: 'TextWithLink',
      text1: 'As a thank you for your participation, we are holding a raffle for a $50 Amazon gift card. If you would like to enter the raffle, please submit your email at ',
      text2: '. Please note that your email will be submitted separately from your other question responses.',
      url: 'https://forms.gle/JvRtyNLobAvzLWmV8',
    },
  },
};

const drexelQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    year: {
      id: 'year',
      question: 'What year are you in?',
      component: 'Radio',
      options: [
        'Freshman',
        'Sophomore',
        'Pre-Junior',
        'Junior',
        'Senior',
        'Graduate',
      ],
      required: true,
      type: String,
    },
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'Computer Science Major in CCI',
        'Information Systems Major in CCI',
        'Software Engineering Major in CCI',
        'Data Science Major in CCI',
        'Computing & Security Technology Major in CCI',
        'Minor in College of Computing & Informatics',
        'Other Major in College of Engineering',
        'Other Minor in College of Engineering',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Drexel to find co-ops, research opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Drexel CCI/Engineering. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    job: {
      id: 'job',
      question: 'Someone has once claimed to me that _____ has unfairly given me an advantage in gaining co-op opportunities. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    department: {
      id: 'department',
      question: 'I feel adequately supported by my Co-op Advisor and the resources offered by Steinbright.',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
      ],
      required: true,
      type: String,
    },
  },
};
const dukeQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'Computer Science major in Trinity College',
        'Electrical Engineering major in Pratt School of Engineering',
        'Electrical Engineering / CS double major in Pratt School of Engineering',
        'Computer Science Minor',
        'Computer Science secondary major',
        'Computer Science IDM',
        'Program II',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Duke to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Duke. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
  },
};
const rutgersQuestions = {
  questionOrder: [...commonOrder.slice(0, 8), 'rutgers1', ...commonOrder.slice(8, 13), 'rutgers2', ...commonOrder.slice(13), ...demographicOrder],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'CS Major in SAS',
        'CS Minor in SAS',
        'ECE Major in SOE',
        'ITI Major in SOC',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Rutgers to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Rutgers. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    leaving: {
      id: 'leaving',
      question: 'Have you seriously considered leaving your tech-related field of study?',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
      ],
      required: true,
      type: String,
    },
    department: {
      id: 'department',
      question: "I feel adequately supported by my major/minor's department and the resources offered by the department.",
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
      ],
      required: true,
      type: String,
    },
    rutgers1: {
      id: 'rutgers1',
      question: 'Do you feel overwhelmed or uncomfortable being at the CAVE (Hill Room 252)?',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
        'I have never been to CAVE',
      ],
      required: true,
      type: String,
    },
    rutgers2: {
      id: 'rutgers2',
      question: 'Do you feel like there are enough Rutgers resources specifically geared toward helping underrepresented groups in tech progress, such as mentoring, tutoring for higher-level classes, scholarships or financial aid availability, etc.?',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
        'Prefer not to say',
      ],
      required: true,
      type: String,
    },
  },
};
const cmuQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'Major in SCS (including CS, CompBio, AI, and HCI majors)',
        'Electric & Computer Engineering Major in CIT',
        'Information Systems Major in DC',
        'Statistics and Machine Learning Major in DC',
        'Minor in SCS (including HCI, LTI, ML, SWE, Robotics, Neural Computation, Information Security, and IDeATe minors)',
        'Electric & Computer Engineering Minor in CIT',
        'Information Systems Minor in DC',
        'Statistics and Machine Learning Minor in DC',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Carnegie Mellon to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    department: {
      id: 'department',
      question: 'I feel adequately supported by the CS-related department and the resources offered by the department.',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
      ],
      required: true,
      type: String,
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Carnegie Mellon. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    groups: {
      id: 'groups',
      question: 'Do you believe organizations whose purpose is to support underrepresented or marginalized groups, such as (but not limited to) SCS4ALL, Society of Hispanic Professional Engineers, National Society of Black Engineers, and ColorStack, are still needed today?',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
      ],
      required: true,
      type: String,
    },
  },
};
const columbiaQuestions = {
  questionOrder: [...commonOrder.slice(0, 13), 'columbia1', ...commonOrder.slice(13), ...demographicOrder],
  customQuestions: {
    year: {
      id: 'year',
      question: 'What year are you in?',
      component: 'Radio',
      options: [
        'First year',
        'Sophomore',
        'Junior',
        'Senior',
        'Super Senior',
        'Masters',
      ],
      required: true,
      type: String,
    },
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'Prospective CS Major or Minor/Concentration in SEAS, CC, Barnard or GS',
        'CS Major or Minor in Barnard',
        'CS Major or Concentration in CC',
        'CS Major or Concentration in GS',
        'CS Major or Minor in SEAS',
        'CE Major or Minor in SEAS',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Columbia to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Columbia. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    columbia1: {
      id: 'columbia1',
      question: 'I feel that the CS Department has been accommodating to my experience as a student throughout the COVID-19 pandemic given the additional challenges of time zone differences, internet connectivity, remote learning, etc.',
      component: 'Radio',
      options: [
        'Strongly Agree',
        'Agree',
        'Neutral',
        'Disagree',
        'Strongly Disagree',
      ],
      required: true,
      type: String,
    },
  },
};
const nyuQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    major: { // TODO - check with CD
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'CS or related major in College of Arts & Science (including CS, Engineering, Econ & CS, etc.)',
        'CS or related minor in College of Arts & Science (including CS, CS & Mathematics, and Web Programming and Applications)',
        'Gallatin STAC - Science, Technology, Art, and Creativity',
        'Computer Science Education Minor in Steinhardt',
        'Computing and Data Science in Stern',
        'CS, Computer Engineering, or Electrical & Computer Engineering major in Tandon',
        'CS or related minors in Tandon (including CS, Computer Engineering, Game Media, Robotics, etc.)',
        'Interactive Media Arts Major in Tisch',
        'Interactive Media Arts Minor in Tisch',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at NYU to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to NYU. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
  },
};
const uiucQuestions = {
  questionOrder: [...commonOrder.slice(0, 17), 'uiuc1', 'uiuc2', ...commonOrder.slice(17), ...demographicOrder],
  customQuestions: {
    year: {
      id: 'year',
      question: 'What year are you in?',
      component: 'Radio',
      options: [
        'Freshman',
        'Sophomore',
        'Junior',
        'Senior',
        'Fifth year +',
        'Graduate',
      ],
      required: true,
      type: String,
    },
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'CS Engineering',
        'Math & CS',
        'Stats & CS',
        'CS + X',
        'Electrical and Computer Engineering',
        'Information Sciences',
        'Minor in CS',
        'Minor in ECE',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at UIUC to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    comfort: {
      id: 'comfort',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I generally feel comfortable asking questions during lecture.',
        'I feel more comfortable in a class taught by a professor who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
        'I generally feel comfortable asking questions in office hours.',
        'I prefer to go to office hours led by someone who shares a similar identity, such as race, ethnicity, gender, gender expression, age, disability, sexual orientation, parental education, or income status.',
        'I ask questions on Piazza and Campuswire, anonymously or publicly.',
        'If Piazza and Campuswire didn’t allow for anonymous questions, I would not likely post on the platform.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to UIUC Engineering. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    groups: {
      id: 'groups',
      question: 'Do you believe organizations whose purpose is to support underrepresented or marginalized groups, such as (but not limited to) Women in Computer Science, Blacks and African Americans in Computing, Latinxs in Computer Science, Society of Hispanic Professional Engineers, National Society of Black Engineers, are still needed today?',
      component: 'Radio',
      options: [
        'Yes',
        'No',
        'Maybe',
      ],
      required: true,
      type: String,
    },
    uiuc1: {
      id: 'uiuc1',
      question: 'How would you describe your ability to code before you came to college? If you are between two of these categories, round up to the nearest integer.',
      component: 'Radio',
      options: [
        '1 - I had no previous experience with coding',
        '2 - I have written at least one line of code before',
        '3 - I have written some code with help from a template or tutorial',
        '4 - I completed some type of project before (i.e. website, app, game, etc.)',
        '5 - I have made contributions towards an internship, research, open source, or similar large-scale project',
      ],
      required: true,
      type: String,
    },
    uiuc2: {
      id: 'uiuc2',
      question: 'How encouraged or supported did you feel when starting the process of transferring into Illinois CS (from within the university or from a different school)?',
      component: 'Radio',
      options: [
        '0 - Not applicable (did not transfer into the major or university)',
        '1 - Intimidated and not supported at all',
        '2 - Somewhat intimidated but encouraged to apply',
        '3 - Not intimidated and encouraged to apply',
      ],
      required: true,
      type: String,
    },
  },
};
const umdQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'CS major',
        'CS minor',
        'Computer Engineering Major (Clark)',
        'Computer Engineering Minor (Clark)',
        'Information Science Major (iSchool)',
        'Information Systems Major (Smith)',
        'Letters and Sciences - Undecided',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at UMD to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to UMD. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
  },
};
const vanderbiltQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {
    major: {
      id: 'major',
      question: 'Please select which fits you the best.',
      component: 'Radio',
      options: [
        'Computer Science major/minor',
        'Computer Engineering major/minor',
        'Electrical Engineering major/minor',
        'Engineering Science major',
        'Communication of Science and Technology major/minor',
        'Scientific Computing minor',
        'Other (Please specify):',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Vanderbilt to find internships, job opportunities, and extracurricular activities.',
        'I feel confident studying computer science and related fields.',
        'I feel intimidated studying Computer Science and related fields.',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
    acceptance: {
      id: 'acceptance',
      question: 'Someone has once claimed to me that _____ has unfairly contributed to my acceptance to Vanderbilt. Check all that apply to you.',
      component: 'MultiCheckbox',
      options: [
        'my race/ethnicity',
        'my gender identity',
        'my sexual orientation',
        'my disability',
        'being a first generation student',
        'my income status',
        'None of the above',
      ],
      required: true,
      type: [String],
    },
  },
};

/**
 * Builds an array of the survey questions in the desired order for the frontend.
 * @param {Object} schoolQuestions – the school questions as from above. Should have questionOrder
 * and customQuestions.
 */
const buildOrderedQuestions = (schoolQuestions) => {
  // Build based off the order. If there are custom questions in the school dictionary, choose that
  const orderedQuestions = [];
  schoolQuestions.questionOrder.forEach((questionId) => {
    // The key exists in the custom dictionary

    if (schoolQuestions.customQuestions[questionId]) {
      orderedQuestions.push(schoolQuestions.customQuestions[questionId]);
    } else if (commonQuestions[questionId]) {
      orderedQuestions.push(commonQuestions[questionId]);
    } else {
      console.error(`Error – the key ${questionId} doesn't exist.`);
    }
  });

  return orderedQuestions;
};

// This is used to map loading the appropriate frontend questions
const schoolToQuestions = {};
schoolToQuestions[schools.brown] = buildOrderedQuestions(brownQuestions);
schoolToQuestions[schools.penn] = buildOrderedQuestions(pennQuestions);
schoolToQuestions[schools.harvard] = buildOrderedQuestions(harvardQuestions);
schoolToQuestions[schools.vanderbilt] = buildOrderedQuestions(vanderbiltQuestions);
schoolToQuestions[schools.drexel] = buildOrderedQuestions(drexelQuestions);
schoolToQuestions[schools.duke] = buildOrderedQuestions(dukeQuestions);
schoolToQuestions[schools.rutgers] = buildOrderedQuestions(rutgersQuestions);
schoolToQuestions[schools.cmu] = buildOrderedQuestions(cmuQuestions);
schoolToQuestions[schools.columbia] = buildOrderedQuestions(columbiaQuestions);
schoolToQuestions[schools.nyu] = buildOrderedQuestions(nyuQuestions);
schoolToQuestions[schools.uiuc] = buildOrderedQuestions(uiucQuestions);
schoolToQuestions[schools.umd] = buildOrderedQuestions(umdQuestions);

/**
 * Handles exporting questions as a .json file. Run using `npm esq`
 */
const exportSchoolQuestions = () => {
  const res = {};

  // Select just question, id, and options
  Object.entries(schoolToQuestions).forEach(([key, value]) => {
    res[key] = value.map(({ question, id, options }) => ({ question, id, options }));
  });

  // Pretty print out the file
  const data = JSON.stringify(res, null, 4);
  fs.writeFileSync('school-questions.json', data);
};

export {
  schools, schoolsArray, roles, rolesArray, submissionStatus, submissionStatusArray,
  defaultCloseDate,
  commonQuestions,
  brownQuestions, pennQuestions, harvardQuestions, vanderbiltQuestions,
  drexelQuestions, dukeQuestions, rutgersQuestions,
  columbiaQuestions, cmuQuestions, uiucQuestions, nyuQuestions,
  umdQuestions,
  generalSurveyStatus,
  schoolToQuestions,
  exportSchoolQuestions,
};
