export type BigQueryDate = {
  value: string
}

export type TLink = {
  name: string
  link: string
  external?: boolean
  authenticated?: boolean
  menu?: (Omit<TLink, 'menu'> & { description?: string })[]
}

export type TLogoLink = {
  alt: string
  logoUrl: string
  redirectUrl: string
  external?: boolean
  background?: string
}

export type TIndex = {
  ITOKEN_ADDR: string
  NET_PROFIT: number
  INVESTMENT: number
  ROI: string
  ROI_NEW: string
  RISK_SCORE: number
  TVL: number
  MAX_DROP_DOWN: number
  CREATED_AT: string
  ITOKEN_ADDR_1: string
  DESCRIPTION: string
  OWNER: string
  TOTAL_WEIGHT: string
  ACTIVE: string
  REBAL_TIME: string
  THRESHOLD: string
  CURR_REBALANCE: string
  LAST_REBALANCE: string
  CREATED_AT_1: string
  TOTALPOOLBALANCE: string
  POOLPENDINGBALANCE: string
  ITOKENNAME: string
  ITOKENSYMBOL: string
  ITOKEN_INDEX: string
  CHAIN_ID: string
  TVL_REQUIRED_TO_START_INDEX_PER: number
  thresold_display: number
  IS_DELISTED: boolean
  ITOKEN_STAKING_ENABLED?: boolean
  ORIGINAL_THRESHOLD?: number
  DEPOSITED_AMOUNT: number
}

export type TIndexPerformance = {
  DATE: string
  ETH_CUMULATIVE_ROI: number
  TOTAL_MARKET_CUMULATIVE_ROI: number | null
  INDEX_CUMULATIVE_ROI: number | null
  TVL?: number | null
  CREATED_AT: string
}

export type TStakers = {
  // DATE: BigQueryDate
  // DEPOSITED: string
  // ADDRESS: string
  // CREATED_AT: BigQueryDate
  // DATE_PARTITIONED: BigQueryDate | null
  POOL_ID: number
  DEPOSITED: string
  ADDRESS: string
  REWARDMULTIPLER: string
  STAKINGSCORE: number
  DATE: string
  CREATED_AT: number
}

// '0xCE5b6d574E3ac1eEa9F9b2DA9caaAdF57c8f9c22': {
//   TOKEN_CONTRACT_ADDR: '0xCE5b6d574E3ac1eEa9F9b2DA9caaAdF57c8f9c22',
//   TOKEN_WEIGHT: '25'
// },
//
export type TIndexComposition = {
  TOKEN_CONTRACT_ADDR: `0x${string}`
  TOKEN_WEIGHT: string
}

export type TIndexCompositionWithAsset = TIndexComposition & {
  name?: string
  decimals?: number
  tokenBalance?: string
  holdings?: number
  tokenPrice?: number
}

export type TToken = {
  img?: string
  name: string
  symbol?: string
  id: string
  isBaseToken?: boolean
  balanceLoaded?: boolean
  lastPriceUSD?: string
  _totalSupply?: string
  _totalValueLockedUSD?: string
}

export type IDTOCHAIN = Record<number, string>
export type CHAINTOID = Record<string, number>

export type TChainConfig = Record<
  number,
  {
    networkURL: string
    chainStackHTTPS: string
    chainStackWS: string
    PURFI_CONFIGURE_URL: {
      dashboard: string
      issuer: string
    }
    LaunchpadFactoryContractAddress: `0x${string}`
    LaunchpadConfigurationAddress: `0x${string}`
    AstraDAOWhitelistAddress: `0x${string}`
    CrosschainSaleManagerAddress: `0x${string}`
    ChefContractAddress: `0x${string}`
    DAAContractAddress: `0x${string}`
    DAOContractAddress: `0x${string}`
    DAIContractAddress: `0x${string}`
    USDTContractAddress: `0x${string}`
    USDCContractAddress: `0x${string}`
    WETHContractAddress: `0x${string}`
    AstraContractAddress: `0x${string}`
    factoryContractAddress: `0x${string}`
    routerContractAddress: `0x${string}`
    IndicesPaymentContractAddress: `0x${string}`
    ethAddressForpaywithCrypto: `0x${string}`
    PoolConfigurationContractAddress: `0x${string}`
    uniswapNFTAddress: `0x${string}`
    VestingContractAddress: `0x${string}`
    iTokenStakingContractAddress: `0x${string}`
    BatchVoteContractAddress: `0x${string}`
    ZeroAddress: `0x${string}`
    rpcURL: string
    uniswapFeeTierValue: string
    astraSlashingFeeUnit: string
    astraSlashingFeeValue: number
    cooldownDetails: {
      ASTRAStakingCooldownDays: number
      ASTRAStakingCoolDownMaxTimestampDays: number
      ASTRAStakingCooldownDaysUnit: string
      iTokenStakingCooldownDays: number
      iTokenStakingCoolDownMaxTimestampDays: number
      iTokenStakingCooldownDaysUnit: string
      lmStakingCooldownDays: number
      lmStakingCoolDownMaxTimestampDays: number
      lmStakingCooldownDaysUnit: string
    }
    iTokenHoursMultiplier: number
  }
>

export type TProposal = {
  ID: string
  title?: string
  description?: string
  links?: string[]
  TEXT: Record<string, string>
  PROPOSER: string
  ETA: string
  STARTBLOCK: string
  ENDBLOCK: string
  FORVOTES: string
  AGAINSTVOTES: string
  CANCELED: string
  EXECUTED: string
  FUNDAMENTALCHANGES: string
  CREATED_AT: number
  ID_1: string
  PROPOSER_1: string
  TARGETS: string
  _VALUES: string
  SIGNATURES: string
  CALLDATAS: string
  STARTBLOCK_1: string
  ENDBLOCK_1: string
  DESCRIPTION: string
  EVENT: string
  LOGINDEX: string
  TRANSACTIONINDEX: string
  TRANSACTIONHASH: string
  ADDRESS: string
  BLOCKHASH: string
  BLOCKNUMBER: string
  DATE: string
  CREATED_AT_1: number
  status: number
  END_DATETIME: string
  GASELESS_COUNTER: number
}

// export type TProposalAction = {
//   action: string
//   address: string
//   function: string
// }

export type TProposalContractABIInput = {
  showLockUpDropdown?: boolean
  iTokensDropdown?: boolean
  showUpdatePoolDropdown?: boolean
  showDaysDropdown?: boolean
  contractDropdown?: boolean
  max?: number
  hide?: boolean
  value?: string
  defaultValue?: string
  tooltipText: string
  internalType: string
  name: string
  type: string
  displayName: string
  placeholder: string
}

export type TProposalContractABI = {
  constant: boolean
  inputs: [TProposalContractABIInput]
  name: string
  outputs: []
  payable: boolean
  stateMutability: string
  type: string
}

export type TProposalContractAction = {
  label: string
  value: `0x${string}`
  hasDropdown?: boolean
  subLabel?: string
  action?: {
    label: string
    value: string
    contractAbi: TProposalContractABI[]
  }[]

  contractAbi: TProposalContractABI[]
}

export type TProposalActionSelected = {
  contractAbi?: TProposalContractABI[]
  inputs: Array<string>
  index?: number
  subActionIndex?: string
  actionIndex: string
} & TProposalContractAction

export type TInvestmentToken = {
  TOKEN_SYMBOL?: string
  TOKEN_ADDRESS: string
  DECIMAL: number
}

export type TIToken = {
  id: number
  itoken: string
  decimal: number
  poolId: number
  name: string
  symbol: string
  contractAddress?: `0x${string}`
}

export type TLpToken = {
  poolId: number
  name: string
  contractAddress: `0x${string}`
  img2: string
}

export type TLpPosition = {
  index: number
  tokenId: number
  token0Info?: string
  token1Info?: string
  liquidity: number
  img2: string
  positionDetails: readonly [
    bigint,
    `0x${string}`,
    `0x${string}`,
    `0x${string}`,
    number,
    number,
    number,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ]
}

export type TPool = {
  CHAINID: string
  EXCHANGE: string
  DEX_SCREENER_URL: string
  PAIRADDRESS: string
  PRICE_NATIVE: string
  PRICE_USD: string
  FULLY_DILUTED_VALUATION: string
  PAIRCREATEDAT: string
  TOKEN0_ID: string
  TOKEN0_NAME: string
  TOKEN0_SYMBOL: string
  TOKEN1_ID: string
  TOKEN1_NAME: string
  TOKEN1_SYMBOL: string
  TXNS_H24_BUYS: string
  TXNS_H24_SELLS: string
  TXNS_H6_BUYS: string
  TXNS_H6_SELLS: string
  TXNS_H1_BUYS: string
  TXNS_H1_SELLS: string
  TXNS_M5_BUYS: string
  TXNS_M5_SELLS: string
  VOLUME_H24: string
  VOLUME_H6: string
  VOLUME_H1: string
  VOLUME_M5: string
  PRICECHANGE_H24: string
  PRICECHANGE_H6: string
  PRICECHANGE_H1: string
  PRICECHANGE_M5: string
  LIQUIDITY: string
  TOKEN0_LIQUIDITY: string
  TOKEN1_LIQUIDITY: string
  DATE: string
  CREATED_AT: string
}

export type TLiquidityMiningDetails = {
  totalVolume: number
  tokenPrice: string
  totalLiquidity: number
  averageAPY: string
  percentageOfAstraStacked: string
}

export type TProposalVoters = {
  ADDRESS: string
  BLOCKHASH: string
  BLOCKNUMBER: string
  CREATED_AT: string
  DATE: string
  EVENT: string
  PROPOSALID: string
  SUPPORT: string
  TRANSACTIONHASH: string
  VOTER: string
  VOTES: string
}

export type TProposalSignature = {
  proposalId: string
  support: boolean
  v: string
  r: `0x${string}`
  s: `0x${string}`
}

export type TTransaction = {
  ASSET: string | number
  METHOD: string
  AMOUNT: number | string
  BLOCKHASH: string
  BLOCKNUMBER: number
  CHAIN_ID: number
  CONFIRMATIONS: string
  CONTRACTADDRESS: string
  CREATED_AT: string
  CUMULATIVEGASUSED: string
  DECODED_INPUT: string
  DETAILS: string
  EVENT: string
  FUNCTIONNAME: string
  FUNCTION_NAME: string
  GAS: number
  GASPRICE: number
  GASUSED: string
  ID: number
  INPUT: string
  METHODID: string
  NONCE: number
  PID: null
  TIMESTAMP: string
  TOKEN_ID: string
  TOKEN_NAME: string
  TOKEN_SYMBOL: string
  TRANSACTION_DATE_TIME: string
  TRANSACTION_HASH: string
  TRANSACTION_INDEX: number
  TXRECEIPT_STATUS: number
  TYPE: string
  VALUE: number
  VAULT: null | number | string
  _FROM: string
  _TO: string
}

export type TUserITokenStakeInfo = {
  amount: number
  timestamp: number
  vault: number
  withdrawTime: number
  iTokenAmount: number
  iTokenDecimals: number
  iTokenId: number
}

export type TUserLpTokenStakeInfo = {
  amount: number
  timestamp: number
  vault: number
  withdrawTime: number
  lpTokenAmount: number
  lpTokenId: number
  isERC721: boolean
}

export type TVestingReward = {
  vestingScheduleID?: `0x${string}`
  vestingIndexDetails?: {
    initialized: boolean
    beneficiary: `0x${string}`
    cliff: bigint
    start: bigint
    duration: bigint
    slicePeriodSeconds: bigint
    revocable: boolean
    amountTotal: bigint
    released: bigint
    revoked: boolean
  }
  releaseAmount: number
  revoked: boolean
  totalTokenAmount: number
}

export type TLaunchpadVestingReward = {
  vestingScheduleID?: `0x${string}`
  vestingIndexDetails?: {
    initialized: boolean
    beneficiary: `0x${string}`
    amountTotal: bigint
    released: bigint
    revoked: boolean
  }
  releaseAmount: number
  revoked: boolean
  totalTokenAmount: number
  launchpadAddress?: `0x${string}`
  launchpadTokenName?: string
  launchpadTokenDecimals?: number
  vestingAddress?: `0x${string}`
  vestingStart: Date
  vestingCliff: number
  vestingDuration: number
  vestingSlicePeriodSeconds: number
  vestingInitialUnlock: number
}

export type TClaimTransaction = {
  DATE: string
  BLOCKNUMBER: string
  TIMESTAMP: string
  HASH: string
  NONCE: string
  BLOCKHASH: string
  TRANSACTIONINDEX: string
  _FROM: string
  _TO: string
  VALUE: string
  GAS: string
  GASPRICE: string
  ISERROR: string
  TXRECEIPT_STATUS: string
  INPUT: string
  CONTRACTADDRESS: string
  CUMULATIVEGASUSED: string
  GASUSED: string
  CONFIRMATIONS: string
  METHOD: string
  DECODED_INPUT: string
  METHODID: string
  FUNCTIONNAME: string
  CREATED_AT: string
}

export type TLaunchpadListInfo = {
  ID: number
  LAUNCHPADINDEX: number
  LAUNCHPADADDRESS: string
  OWNER: string
  SALETOKENADDRESS: string
  SALESTARTTIME: string
  SALEENDTIME: string
  SALETOKENPRICE: string
  TOTALSALEAMOUNT: number
  BASEAMOUNT: number
  TOTALCOLLECTEDAMOUNT: number
  STATUS: string
  CREATED_AT: string
  UPDATED_AT: string
}

export type TLaunchpadDetailInfo = {
  ID: string
  OWNER: string
  APPROVE_TRANSACTION: string
  CHAIN: string
  EMAIL: string
  HARD_CAP: number
  INITIAL_MARKET_CAP: number
  LAUNCHPAD_ADDRESS: string
  LAUNCHPAD_INDEX: number
  LAUNCHPAD_TOKEN_ADDRESS: string
  LAUNCHPAD_TOKEN_DECIMAL: number
  LAUNCHPAD_TOKEN_FDV: number
  LAUNCHPAD_TOKEN_NAME: string
  LAUNCHPAD_TOKEN_PRICE: number
  LAUNCHPAD_TOKEN_SYMBOL: string
  LAUNCHPAD_TOKEN_TOTAL_SUPPLY: number
  MIN_PURCHASE_BASE_AMOUNT: number
  MAX_PURCHASE_BASE_AMOUNT: number
  METRICS: string
  OTHER_URL: string
  PROJECT_DETAIL: string
  PROJECT_VALUATION: number
  REQUEST_TRANSACTION: string
  SALE_END_TIME: Date
  SALE_START_TIME: Date
  SOFT_CAP: number
  STATUS: string
  TEAM_INFO: string
  TELEGRAM: string
  DISCORD: string
  MEDIUM: string
  TOTAL_SALE_AMOUNT: number
  TWITTER: string
  WEBSITE_URL: string
  WHITEPAPER_URL: string
  CREATED_AT: string
  UPDATED_AT: string
  INVESTOR_DETAIL?: string
  TOKEN_TYPE: string
  LEAD_VC: string
  MARKET_MAKER: string
  CONTROLLED_CAP: string
  DAO_APPROVED_METRICS: string
  IS_VESTING: boolean
  BASE_TOKEN: string
  VEST_START: Date
  VEST_CLIFF: number
  VEST_DURATION: number
  VEST_SLICE_PERIOD_SECONDS: number
  VEST_INITIAL_UNLOCK: number
  VESTING_DEPLOYED: boolean
  VEST_ADDRESS: string

  PROJECT_DESCRIPTION_DETAIL: string
  TEAM_DESCRIPTION: string
  SALE_ROUND_DETAIL: string
  PROJECT_IMAGE: string
  LEAD_VC_IMAGE: string
  MARKET_MAKER_IMAGE: string
  PROJECT_DECK: string
  RAISED: number
  GITHUB: string
  TOTAL?: number
}

export type TRequestLaunchpadContractInfo = {
  tokenAddress: `0x${string}`
  saleStartTime: number
  saleEndTime: number
  tokenPrice: string
  baseToken: `0x${string}`
  tokenAmount: string
  minPurchaseAmount: string
  baseAmount: string
  tokenDecimals: string
  isVesting: boolean
}

export interface TeamObject {
  name: string
  position: string
  description: string
  linkedin?: string
  twitter?: string
  avatar?: string
}
export interface DateObject {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export interface RequestLaunchpadResultValues {
  data: { [key: string]: any }
  team: TeamObject[]
  metrics: MetricsObject[]
  launchpadId?: string
}

export interface MetricsObject {
  id: string
  label: string
  value: number
}
export interface SaleRoundDetailObject {
  price: number
  raised: number
  lockup: string
  saleType: string
}

export interface ProjectObject {
  saleStartDate: Date
  saleEndDate: Date
  tokenAddress: string
  tokenAmount: number | string
  tokenPrice: number | string
  minPurchaseAmount: number | string
  baseAmount: number | string
  tokenDecimals: number | string
  tokenSymbol: string
  totalSupply: number | string
  softCap: number | string
  hardCap: number | string
  initialMarketCap: number | string
  projectValuation: number | string
  tokenName: string
  website: string
  pitchdeck: string
  email: string
  projectTwitter: string
  contactTelegram: string
  contactDiscord: string
  contactMedium: string
  projectDescription: string
  totalToken: number | string
  projectDescriptionDetail?: string
  projectImage?: string
  teamDescription?: string
  saleRoundDetail?: string
  projectDeck: string
  github: string

  leadVC: string
  marketMaker: string
  raised: number | string
  investorDetail: string

  leadVCImage: string
  marketMakerImage: string
  controlledCap: string
  daoApprovedMetrics: string

  tokenType: string
  isVesting: boolean
  baseToken: string

  vest_start: Date | undefined
  vest_cliff: number | string
  vest_duration: number | string
  vest_slice_period_seconds: number | string
  vest_initial_unlock: number | string
}

export interface TFollowingStatus {
  USER: string
  IS_TELEGRAM_FOLLOWING: boolean
  IS_TWITTER_FOLLOWING: boolean
}
