import { TLink } from '@/types'

export const navLinks: TLink[] = [
  {
    name: 'BUY ASTRADAO',
    link: '/how-to-buy',
  },
  // ...(process.env.NODE_ENV === 'development'
  //   ? [
  //       {
  //         name: 'LAUNCHPAD',
  //         link: '/launchpad',
  //       },
  //     ]
  //   : []),
  {
    name: 'LAUNCHPAD',
    link: '/launchpad',
  },
  {
    name: 'LAUNCHPAD',
    link: '',
    menu: [
      {
        name: 'Dashboard',
        link: '/launchpad',
        description: 'Live and Upcoming Projects',
      },
      {
        name: 'Launchpad Portfolio',
        link: '/launchpad/user',
        description: 'Check your launchpad portfolio',
      },
      {
        name: 'Launchpad Request',
        link: '/launchpad/request',
        description: 'Create your project',
      },
      {
        name: 'Launchpad Admin',
        link: '/launchpad/admin',
        description: 'Manage the requested launchpad',
      },
    ],
  },
  {
    name: 'INDICES',
    link: '',
    menu: [
      {
        name: 'Create Index',
        link: '/indices/create',
        description: 'Create a New Index',
      },
      {
        name: 'Invest',
        link: '/indices',
        description: 'Invest in an Index',
      },
    ],
  },
  {
    name: 'GOVERNANCE',
    link: '',
    menu: [
      {
        name: 'Proposals',
        link: '/governance/proposals',
        description: 'Current Active Proposals',
      },
      {
        name: 'Create Proposals',
        link: '/governance/proposals/create',
        description: 'Create a New Proposal',
      },
    ],
  },
  {
    name: 'MY PORTFOLIO',
    link: '/portfolio',
    authenticated: true,
  },
  {
    name: 'TRANSACTIONS',
    link: '/staking/transactions',
    authenticated: true,
  },
  {
    name: 'STAKING',
    link: '/staking',
    authenticated: true,
  },
  {
    name: 'CLAIM',
    link: '/claim',
    authenticated: true,
  },
  {
    name: 'LEARN',
    link: '',
    menu: [
      {
        name: 'About Us',
        link: '/about',
        description: 'Learn more about Astra DAO',
      },
      {
        name: 'AMBASSADORS',
        link: '/ambassadors',
        description: 'Learn how to Become an Astra DAO Ambassador',
      },
      {
        name: 'Docs',
        link: 'https://docs.astradao.org/',
        external: true,
        description: 'Explore our Gitbook Documentation',
      },
      {
        name: 'Whitepaper',
        link: '/files/whitepaper.pdf',
        external: true,
        description: 'Read our Whitepaper',
      },
      {
        name: 'Video Tutorials',
        link: 'https://www.youtube.com/channel/UCzFfo1tC6dXlPkR1Vev932g',
        external: true,
        description: 'Check our Latest Videos',
      },
    ],
  },
]
