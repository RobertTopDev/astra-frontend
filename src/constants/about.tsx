export const utility = [
  {
    product: 'A variety of investment products',
    description:
      "User (investor) can visit the Astra DAO platform's webpage and navigate through the list of different products/indices. ",
  },
  {
    product: 'Participation units marketplace',
    description:
      'After choosing one of the products (index), the user can buy participation units (“iTokens”) representing their share in the product. ',
  },
  {
    product: 'Staking',
    description:
      'Users can also choose to buy and stake Astra DAO tokens for additional Astra DAO Yield.',
  },
  {
    product: 'Harvesting investment strategies profits',
    description:
      'Users can decide to cash out participation units in any index, anytime, simply by depositing them back to the index. In return, they will receive the original deposit plus a proportional share in a profit made by the index (if the index value has increased). ',
  },
  {
    product: 'Zero-fees user participation model',
    description:
      'No entry fees are collected from users upon buying participation units. An exit fee is collected upon cashing participation units out. The longer users hold the participation unit, the smaller the exit fee gets and ultimately gets to zero',
  },
  {
    product: 'Join & Earn',
    description:
      'A portion of the revenue will incentivize index creators to add successful investment strategies (creator’s performance fee).',
  },
  {
    product: 'Redistribution of profits to stakers',
    description:
      'Performance fees paid to creators are subjected to a small Astra DAO Fee, fully redistributed to the Astra DAO stakers.',
  },
  {
    product: 'Continuous improvement culture',
    description:
      'DAO-managed Treasury is used to incentive users, pay interests to Astra DAO token holders, and fund further platform development and continuous improvement.',
  },
] as const

export const allocation = [
  {
    group: 'Early Supporters',
    percentage: 10,
    allocation: '13,000,000,000,000',
    cliff: '0',
    tge: 25,
    vesting: '104',
  },
  {
    group: 'Liquidity Pools',
    percentage: 3.1,
    allocation: '4,000,000,000,000',
    cliff: '0',
    tge: 100,
    vesting: 'N/A',
  },
  {
    group: 'Liquidity Mining (LM) and Community Rewards',
    percentage: 34.6,
    allocation: '45,000,000,000,000',
    cliff: '0',
    tge: 5,
    vesting: '104',
  },
  {
    group: 'Grants and Development Fund',
    percentage: 13.8,
    allocation: '18,000,000,000,000',
    cliff: '0',
    tge: 5,
    vesting: '104',
  },
  {
    group: 'Early Contributors',
    percentage: 15.4,
    allocation: '20,000,000,000,000',
    cliff: '12',
    tge: 0,
    vesting: '208',
  },
  {
    group: 'Strategic Partners',
    percentage: 4.6,
    allocation: '6,000,000,000,000',
    cliff: '0',
    tge: 1,
    vesting: '104',
  },
  {
    group: 'Advisors',
    percentage: 3.1,
    allocation: '4,000,000,000,000',
    cliff: '0',
    tge: 2,
    vesting: '52',
  },
  {
    group: 'Compensation',
    percentage: 15.4,
    allocation: '20,000,000,000,000',
    cliff: '0',
    tge: 2,
    vesting: 'N/A',
  },
] as const
