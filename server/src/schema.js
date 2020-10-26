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

/**
 * Schema for questions. Note that the "type" field should be for Mongoose
 */
const commonQuestions = {
  participation: {
    id: 'participation',
    question:
      `I agree to participate in an anonymous survey conducted by the Percentage Project. I understand that all responses that I provide in the survey will remain anonymous and that no identifying information about me will be made public. In addition, my email address and all other personally identifiable information will be purged from the data file and replaced with a unique and anonymous identification number when the survey is submitted.
      \n
      In order to analyze the survey responses, my answers will be combined with those given by other survey respondents. All data from the survey will be stored in a secured location and retained indefinitely by the Percentage Project.
      \n
      I also understand that if I have any questions about the survey I can contact the Percentage Project by sending an email to hello@percentageproject.com. 
      \n
      This online survey should take approximately 5 minutes to complete. You can only take the survey once, and you will not be able to edit your responses once the survey is submitted. Questions marked with an asterisk (*) are required.
      \n
      By checking the box below I understand my rights and give my consent to participate in the survey.`,
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
    question: 'Do you have a faculty whom you perceive as a role model?',
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
    question: 'Content Warning: The following four questions contain references to sexual violence. Please press “Continue” to continue, or “Skip” to skip these questions.',
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
      'Perfer to self-describe:',
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
const commonOrder = ['participation', 'year', 'major', 'confidence', 'microaggression', 'respect', 'comfort', 'roleModel', 'leaving', 'dropOut', 'equal', 'department', 'acceptance', 'job', 'bias', 'groups', 'contentWarning', 'harassment1', 'harassment2', 'assault1', 'assault2'];

const brownQuestions = {
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
        'Other (Please specify)',
      ],
      required: true,
      type: String,
    },
    confidence: {
      id: 'confidence',
      question: 'Check all of the following that apply to you:',
      component: 'MultiCheckbox',
      options: [
        'I feel pressure at Penn to find internships, job opportunities, extracurricular activities.',
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
const pennQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const harvardQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const drexelQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const dukeQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const rutgersQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const cmuQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const columbiaQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const nyuQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const uiucQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};
const vanderbiltQuestions = {
  questionOrder: [...commonOrder, ...demographicOrder],
  customQuestions: {},
};

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
};

// This is used to map loading the appropriate frontend questions
const schoolToQuestions = {};
schoolToQuestions[schools.brown] = buildOrderedQuestions(brownQuestions);
schoolToQuestions[schools.penn] = buildOrderedQuestions(pennQuestions);
schoolToQuestions[schools.harvard] = buildOrderedQuestions(harvardQuestions);
schoolToQuestions[schools.vanderbilt] = buildOrderedQuestions(vanderbiltQuestions);
schoolToQuestions[schools.drexel] = buildOrderedQuestions(drexelQuestions);
schoolToQuestions[schools.duke] = buildOrderedQuestions(uiucQuestions);
schoolToQuestions[schools.rutgers] = buildOrderedQuestions(rutgersQuestions);
schoolToQuestions[schools.cmu] = buildOrderedQuestions(cmuQuestions);
schoolToQuestions[schools.columbia] = buildOrderedQuestions(columbiaQuestions);
schoolToQuestions[schools.nyu] = buildOrderedQuestions(nyuQuestions);
schoolToQuestions[schools.uiuc] = buildOrderedQuestions(uiucQuestions);

export {
  schools, schoolsArray, roles, rolesArray, submissionStatus, submissionStatusArray,
  commonQuestions,
  brownQuestions, pennQuestions, harvardQuestions, vanderbiltQuestions,
  drexelQuestions, dukeQuestions, rutgersQuestions,
  columbiaQuestions, cmuQuestions, uiucQuestions, nyuQuestions,
  schoolToQuestions,
};
