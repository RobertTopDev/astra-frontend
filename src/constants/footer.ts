import { TLink, TLogoLink } from '@/types'

export const footerInfo = [
  {
    logo: '/svgs/footer_logo_1.svg',
    logoAlt: 'Mining logo',
    title: 'Liquidity Mining',
    desc: 'Get rewarded for providing liquidity',
    data: 'liquidityMiningAPR',
    buttonName: 'LEARN MORE',
    buttonUrl: '/staking/liquidity-mining',
  },
  {
    logo: '/svgs/footer_logo_2.svg',
    logoAlt: 'Cart Logo',
    title: 'Staking Rewards',
    desc: 'The longer you stake, the more you earn',
    data: 'stakingRewardsAPR',
    buttonName: 'LEARN MORE',
    buttonUrl: '/staking',
  },
  {
    logo: '/svgs/footer_logo_3.svg',
    logoAlt: 'Bullseye Logo',
    title: 'iToken',
    data: 'iTokenAPR',
    desc: 'Stake your iToken for extra rewards',
    buttonName: 'LEARN MORE',
    buttonUrl: '/staking/itoken',
  },
] as const

export const astraLinks: TLink[] = [
  {
    link: '/about',
    name: 'About',
  },
  {
    link: '#terms-of-use',
    name: 'Terms of Use',
  },
]

export const communityLinks: TLink[] = [
  {
    link: 'https://mirror.xyz/0x0035BAb3c7Ab6EbdB9501f0C0cE4FC7C83A447A4',
    name: 'Mirror',
    external: true,
  },
  {
    link: 'https://discord.gg/FasMBbARMW',
    name: 'Discord',
    external: true,
  },
  {
    link: 'https://www.youtube.com/channel/UCzFfo1tC6dXlPkR1Vev932g',
    name: 'Youtube',
    external: true,
  },
]

export const resourcesLinks: TLink[] = [
  {
    link: 'https://docs.astradao.org/',
    name: 'GitBook',
    external: true,
  },
  {
    link: '/how-to-buy',
    name: 'How to buy Astra?',
  },
  {
    link: '/about',
    name: 'FAQs',
  },
  {
    link: 'https://www.youtube.com/channel/UCzFfo1tC6dXlPkR1Vev932g',
    name: 'Video Tutorials',
    external: true,
  },
  {
    link: '/files/whitepaper.pdf',
    name: 'Whitepaper',
    external: true,
  },
]

export const supportLinks: TLink[] = [
  {
    link: 'mailto:dao@astradao.org',
    name: 'Contact',
    external: true,
  },
]

export const quickLinks: TLink[] = [
  {
    link: '/governance/proposals',
    name: 'Governance',
  },
  {
    link: '/governance/proposals/create',
    name: 'Create Proposal',
  },
  {
    link: '/indices/create',
    name: 'Create Index',
  },
]

export const socialLinks: TLogoLink[] = [
  {
    alt: 'Twitter Logo',
    logoUrl: '/svgs/twitter_logo.svg',
    redirectUrl: 'https://twitter.com/astradao_org',
  },
  /* {
    logoUrl: '/images/facebook.svg',
    redirectUrl: 'https://www.facebook.com/astradao.org',
  }, */
  {
    alt: 'Medium Logo',
    logoUrl: '/images/medium-logo.png',
    /* redirectUrl: 'https://astradao.medium.com/', */
    /* redirectUrl: 'https://mirror.xyz/0x0035BAb3c7Ab6EbdB9501f0C0cE4FC7C83A447A4/Ear9ZKioVE9TWpTFCOV_GopzKhQfF7ApSShk0uAWK7g', */
    redirectUrl:
      'https://mirror.xyz/0x0035BAb3c7Ab6EbdB9501f0C0cE4FC7C83A447A4',
  },
  {
    alt: 'Discord Logo',
    logoUrl: '/svgs/discord.svg',
    redirectUrl: 'https://discord.gg/FasMBbARMW',
  },
  /* {
    logoUrl: '/images/reddit.svg',
    redirectUrl: 'https://www.reddit.com/r/astradao/',
  }, */
  {
    alt: 'Youtube Logo',
    logoUrl: '/images/youtube.png',
    redirectUrl: 'https://www.youtube.com/channel/UCzFfo1tC6dXlPkR1Vev932g',
  },
  {
    alt: 'GitBook Logo',
    logoUrl: '/svgs/gitbook-icon.svg',
    redirectUrl: 'https://docs.astradao.org/',
  },
  {
    alt: 'Telegram Logo',
    logoUrl: '/svgs/telegram.svg',
    redirectUrl: 'https://t.me/astradao',
  },
  // {
  //   alt: 'Telegram Logo',
  //   logoUrl: '/svgs/telegram.svg',
  //   redirectUrl: 'https://t.me/astradao_alerts',
  // },
]
