export type HotlineResource = {
  title: string;
  countryName: string;
  type: 'phone' | 'text' | 'web';
  details: string;
  action: string;
  href: string;
  info: string;
};

type HotlineData = {
  [countryCode: string]: HotlineResource[];
};

export const hotlines: HotlineData = {
  US: [
    {
      title: 'Suicide & Crisis Lifeline',
      countryName: 'United States',
      type: 'phone',
      details: 'Call or Text 988',
      action: 'Call 988',
      href: 'tel:988',
      info: '24/7 Confidential Support',
    },
    {
      title: 'NAMI Helpline',
      countryName: 'United States',
      type: 'phone',
      details: 'National Alliance on Mental Illness',
      action: 'Call 1-800-950-6264',
      href: 'tel:1-800-950-6264',
      info: 'Mon-Fri, 10am-10pm ET',
    },
  ],
  GB: [
    {
      title: 'Samaritans',
      countryName: 'United Kingdom',
      type: 'phone',
      details: 'Whatever you\'re going through',
      action: 'Call 116 123',
      href: 'tel:116123',
      info: '24/7 Confidential Support',
    },
    {
      title: 'Campaign Against Living Miserably (CALM)',
      countryName: 'United Kingdom',
      type: 'phone',
      details: 'For people in the UK',
      action: 'Call 0800 58 58 58',
      href: 'tel:0800585858',
      info: '5pm-midnight, 365 days a year',
    },
  ],
  CA: [
    {
      title: 'Talk Suicide Canada',
      countryName: 'Canada',
      type: 'phone',
      details: 'Connect to a crisis responder',
      action: 'Call 1.833.456.4566',
      href: 'tel:1-833-456-4566',
      info: '24/7 Confidential Support',
    },
    {
      title: 'Wellness Together Canada',
      countryName: 'Canada',
      type: 'text',
      details: 'Text WELLNESS to 741741 for adults',
      action: 'Text WELLNESS',
      href: 'sms:741741?&body=WELLNESS',
      info: '24/7 Confidential Support for Adults',
    },
  ],
  AU: [
    {
      title: 'Lifeline Australia',
      countryName: 'Australia',
      type: 'phone',
      details: 'Crisis Support and Suicide Prevention',
      action: 'Call 13 11 14',
      href: 'tel:131114',
      info: '24/7 Confidential Support',
    },
    {
      title: 'Beyond Blue',
      countryName: 'Australia',
      type: 'phone',
      details: 'Mental health support',
      action: 'Call 1300 22 4636',
      href: 'tel:1300224636',
      info: '24/7 Confidential Support',
    },
  ],
  PK: [
    {
        title: 'Umang',
        countryName: 'Pakistan',
        type: 'phone',
        details: 'Mental Health Helpline',
        action: 'Call 0317-4288665',
        href: 'tel:03174288665',
        info: 'Confidential Support',
    },
    {
        title: 'Taskeen',
        countryName: 'Pakistan',
        type: 'web',
        details: 'Mental Health and Suicide Prevention',
        action: 'Visit Website',
        href: 'https://taskeen.org/need-help-now/',
        info: 'Online Resources',
    }
  ],
  IN: [
    {
        title: 'Vandrevala Foundation',
        countryName: 'India',
        type: 'phone',
        details: 'Mental Health Helpline',
        action: 'Call 9999 666 555',
        href: 'tel:9999666555',
        info: '24/7 Confidential Support',
    },
    {
        title: 'iCALL',
        countryName: 'India',
        type: 'phone',
        details: 'Psychosocial helpline',
        action: 'Call 022-25521111',
        href: 'tel:022-25521111',
        info: 'Mon-Sat, 10am-8pm',
    }
  ]
};
