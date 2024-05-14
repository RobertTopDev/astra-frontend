import { TChainConfig } from '@/types'

export const durations = [
  {
    value: '0',
    label: 'No Lockup',
  },
  /* {
      value: '2',
      label: '2 months',
    }, 
    {
      value: '3',
      label: '3 months',
    },
    {
      value: '4',
      label: '4 months',
    },
    {
      value: '5',
      label: '5 months',
    }, */
  {
    value: '6',
    label: '6 months',
  },
  /*  {
      value: '7',
      label: '7 months',
    },
    {
      value: '8',
      label: '8 months',
    },*/
  {
    value: '9',
    label: '9 months',
  },
  /*{
      value: '10',
      label: '10 months',
    },
    {
      value: '11',
      label: '11 months',
    },*/
  {
    value: '12',
    label: '12 months',
  },
]

export const updatePoolDropdown = [
  {
    label: 'True',
    value: 'true',
  },
  {
    label: 'False',
    value: 'false',
  },
]

export const days = [
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  },
  {
    value: '3',
    label: '3',
  },
  {
    value: '4',
    label: '4',
  },
  {
    value: '5',
    label: '5',
  },
  {
    value: '6',
    label: '6',
  },
  {
    value: '7',
    label: '7',
  },
  {
    value: '8',
    label: '8',
  },
  {
    value: '9',
    label: '9',
  },
  {
    value: '10',
    label: '10',
  },
]

export const proposalOptions = (
  chainConfig: TChainConfig[keyof TChainConfig]
) => {
  return [
    {
      label: 'Community Grant Funds',
      value: chainConfig.AstraContractAddress,
      contractAbi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
              displayName: 'Recipient Address to Receive Funds',
              placeholder: '',
              tooltipText: 'The Ethereum address to receive funds.',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              displayName: 'Amount of ASTRADAO Tokens Requested',
              placeholder: '',
              tooltipText: 'The total amount of funds to transfer.',
            },
          ],
          name: 'transfer',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    /* {
      label: 'Lock Astra Token',
      value: config.AstraContractAddress,
      contractAbi: [
        {
          inputs: [],
          name: 'pause',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
          placeholder: '0x012.....Ad91Ff',
        },
      ],
    }, */
    /* {
      label: 'Unlock Astra token',
      value: config.AstraContractAddress,
      contractAbi: [
        {
          inputs: [],
          name: 'unpause',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    }, */
    {
      label: 'Update Performance Fees',
      value: chainConfig.PoolConfigurationContractAddress,
      contractAbi: [
        {
          constant: false,
          inputs: [
            {
              internalType: 'uint256',
              name: '_feesper',
              type: 'uint256',
              displayName: 'New Performance Fees',
              placeholder: 'Maximum up to 50',
              max: 50,
              tooltipText:
                "Performance fees are collected automatically upon iTokens redemption if the investor's ROI is above 0.",
            },
          ],
          name: 'updatePerfees',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Update Early Exit Fees',
      value: chainConfig.PoolConfigurationContractAddress,
      contractAbi: [
        {
          constant: false,
          inputs: [
            {
              internalType: 'uint256',
              name: '_feesper',
              type: 'uint256',
              displayName: 'New Early Exit Fees',
              placeholder: 'Maximum up to 50',
              max: 50,
              tooltipText:
                'Early exit fee prevents investors from redeeming iTokens shortly after buying them.',
            },
          ],
          name: 'updateEarlyExitFees',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Update Slippage Rate',
      value: chainConfig.PoolConfigurationContractAddress,
      contractAbi: [
        {
          constant: false,
          inputs: [
            {
              internalType: 'uint256',
              name: '_slippagerate',
              type: 'uint256',
              displayName: 'New Slippage Rate',
              placeholder: 'Maximum up to 30',
              max: 30,
              tooltipText:
                "Slippage rate is the difference between a trade's expected price and the actual price at which the trade is executed.",
            },
          ],
          name: 'updateSlippagerate',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Update Max Number of Tokens Allowed in an Index',
      value: chainConfig.PoolConfigurationContractAddress,
      contractAbi: [
        {
          constant: false,
          inputs: [
            {
              internalType: 'uint256',
              name: '_maxTokenSupported',
              type: 'uint256',
              displayName: 'New Max Number of Tokens Allowed in an Index',
              placeholder: 'Maximum up to 100',
              max: 100,
              tooltipText:
                'Maximum number of tokens allowed in an index at the time of the creation.',
            },
          ],
          name: 'updateMaxToken',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Add Supported Tokens for Index Deposits',
      value: chainConfig.PoolConfigurationContractAddress,
      contractAbi: [
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: '_stable',
              type: 'address',
              displayName: 'ERC20 Token Contract Address',
              placeholder: '',
              tooltipText: 'The ERC20 contract address for the new token.',
            },
          ],
          name: 'addStable',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Remove Supported Tokens for Index Deposits',
      value: chainConfig.PoolConfigurationContractAddress,
      contractAbi: [
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: '_stable',
              type: 'address',
              displayName: 'ERC20 Token Contract Address',
              placeholder: '',
              tooltipText: 'The ERC20 contract address for the new token.',
            },
          ],
          name: 'removeStable',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
          displayName: 'ERC20 Token Contract Address',
        },
      ],
    },
    {
      // show dropdown
      label: 'Add Index for Staking',
      value: chainConfig.iTokenStakingContractAddress,
      contractAbi: [
        {
          inputs: [
            {
              iTokensDropdown: true,
              internalType: 'address',
              name: '_itoken',
              type: 'address',
              displayName: 'Select the Index',
              placeholder: 'Select an Index',
              tooltipText:
                'The name of the index that should be approved for staking.',
            },
            {
              internalType: 'uint256',
              name: '_poolId',
              value: '0',
              type: 'uint256',
              displayName: 'Select the pool ID',
              placeholder: '1',
              tooltipText:
                'The pool ID of the index that should be approved for staking.',
              disabled: true,
              hide: true,
            },
          ],
          name: 'addItoken',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Add LP Pool for Staking',
      value: chainConfig.ChefContractAddress,
      contractAbi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_erc721Token',
              type: 'address',
              displayName: 'Exchange and Trading NFT',
              showPoolsDropdown: false,
              placeholder: chainConfig.uniswapNFTAddress,
              value: chainConfig.uniswapNFTAddress,
              tooltipText:
                'The LP Pool NFT that should be approved for staking.',
            },
            {
              internalType: 'address',
              name: '_token0',
              type: 'address',
              displayName: 'ASTRADAO token address',
              showPoolsDropdown: false,
              placeholder: chainConfig.AstraContractAddress,
              value: chainConfig.AstraContractAddress,
              tooltipText: 'ASTRADAO token address',
            },
            {
              internalType: 'address',
              name: '_token1',
              type: 'address',
              displayName: 'Other token address',
              showPoolsDropdown: false,
              placeholder: '',
              tooltipText: 'Other token address',
            },
            {
              internalType: 'uint24',
              name: 'fee',
              type: 'uint24',
              displayName: 'Fee tier',
              showPoolsDropdown: false,
              placeholder: 0.3,
              value: chainConfig.uniswapFeeTierValue,
              tooltipText: 'Fee tier',
            },
            {
              showUpdatePoolDropdown: true,
              internalType: 'bool',
              name: '_WithUpdate',
              type: 'bool',
              displayName: 'With Update Flag',
              showBooleanRadio: false,
              placeholder: false,
            },
          ],
          name: 'addUniswapVersion3',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Grant ASTRADAO from treasury to LM reward pool',
      value: chainConfig.ChefContractAddress,
      contractAbi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_rewardAmount',
              type: 'uint256',
              placeholder: '',
              displayName:
                'Amount of ASTRADAO to be distributed for LM rewards',
            },
          ],
          name: 'distributeAdditionalReward',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    {
      label: 'Change Governance Configuration',
      value: chainConfig.DAOContractAddress,
      hasDropdown: true,
      subLabel: 'Select an Action',
      action: [
        {
          label: 'Update Minimum Number of Votes Required',
          value: 'updateQuorumValue',
          contractAbi: [
            {
              constant: false,
              inputs: [
                {
                  tooltipText:
                    'The minimum number of votes required for a proposal to pass.',
                  internalType: 'uint256',
                  name: '_quorumValue',
                  type: 'uint256',
                  displayName: 'New Minimum Number of Votes',
                  placeholder: '',
                },
              ],
              name: 'updateQuorumValue',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        },
        {
          label: 'Change Staking Lockup Duration for Proposal Creation',
          value: 'updateStakeVault',
          contractAbi: [
            {
              constant: false,
              inputs: [
                {
                  tooltipText: 'The lockup duration time frame in months.',
                  showLockUpDropdown: true,
                  internalType: 'uint256',
                  name: '_stakeVault',
                  type: 'uint256',
                  displayName: 'Lockup Duration',
                  placeholder: 'Select Lockup Duration',
                },
              ],
              name: 'updateStakeVault',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        },
        {
          label: 'Update Minimum Number of Voters Required',
          value: 'updateMinVotersValue',
          contractAbi: [
            {
              constant: false,
              inputs: [
                {
                  tooltipText:
                    'The minimum number of voters required to vote on a proposal.',
                  internalType: 'uint256',
                  name: '_minVotersValue',
                  type: 'uint256',
                  displayName: 'New Minimum Number of Voters',
                  placeholder: '',
                },
              ],
              name: 'updateMinVotersValue',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        },
        {
          label: 'Select Max Number of Proposals Allowed in a Day',
          value: 'updateMinProposalTimeIntervalSec',
          contractAbi: [
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: '_minProposalTimeIntervalSec',
                  type: 'uint256',
                  displayName: 'Update proposal creation time in seconds',
                  placeholder: '',
                },
              ],
              name: 'updateMinProposalTimeIntervalSec',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        },
        {
          label: 'Update amount of ASTRADAO required to create a proposal',
          value: 'updateProposalTokens',
          contractAbi: [
            {
              constant: false,
              inputs: [
                {
                  showDaysDropdown: false,
                  internalType: 'uint256',
                  name: '_proposalTokens',
                  type: 'uint256',
                  displayName: 'ASTRADAO amount',
                  placeholder: '',
                },
              ],
              name: 'updateProposalTokens',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        },
      ],
    },
  ]
}

export const listOfContracts = (config: TChainConfig[keyof TChainConfig]) => [
  {
    NAME: 'ASTRADAO staking',
    ADDRESS: config.ChefContractAddress,
  },
  {
    NAME: 'iToken staking',
    ADDRESS: config.IndicesPaymentContractAddress,
  },
]
