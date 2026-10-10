export interface DemoSample {
  id: string;
  name: string;
  tag: string;
  expectedRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  text: string;
  url: string;
  description: string;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'sample-high',
    name: 'Sample 1: Upfront Fee & Impersonation',
    tag: 'Expected HIGH',
    expectedRisk: 'HIGH',
    text: `Congratulations! Following your recent resume screening, you have been selected for the Remote Associate role at Google. 

Before we send your official offer letter and dispatch your home office equipment, a refundable security deposit and registration fee of $150 is required for training materials and IT setup. 

Kindly reply within 24 hours to secure your slot, as limited positions remain available. Please confirm your acceptance by emailing hr.google.onboarding@gmail.com with your proof of payment.`,
    url: '',
    description: 'Demands upfront equipment/training fee, manufactures 24h urgency, and uses a free Gmail address while claiming Google affiliation.',
  },
  {
    id: 'sample-medium',
    name: 'Sample 2: Shortened / Lookalike Link',
    tag: 'Expected MEDIUM',
    expectedRisk: 'MEDIUM',
    text: `Hi there! We reviewed your profile and were impressed by your background. We would like to invite you for an introductory screening call. 

Please review the interview preparation document and reserve your interview timeslot on our candidate portal here: https://bit.ly/google-job-interview`,
    url: 'https://bit.ly/google-job-interview',
    description: 'Uses an obfuscated bit.ly link disguised as a company interview portal, bypassing domain inspection.',
  },
  {
    id: 'sample-low',
    name: 'Sample 3: Legitimate Career Posting',
    tag: 'Expected LOW',
    expectedRisk: 'LOW',
    text: `Software Engineer, Core Infrastructure at Stripe. 

You will design and scale resilient distributed systems, build customer-facing APIs in Go and TypeScript, and collaborate with globally distributed product teams. 

Requirements:
- 3+ years of experience with distributed backend architectures.
- Experience operating relational databases and message queues.
- Strong written communication and peer code review practices.

We offer comprehensive health coverage, 401(k) matching, and parental leave. You can view the full job specification and apply directly at https://stripe.com/jobs`,
    url: 'https://stripe.com/jobs',
    description: 'Realistic engineering job description with balanced requirements, official HTTPS domain, and standard compensation overview.',
  },
];
