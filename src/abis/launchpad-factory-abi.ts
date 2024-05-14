export const launchpadFactoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'launchpadAddress',
        type: 'address',
      },
    ],
    name: 'LaunchpadRequestApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'LaunchpadRequestCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
    ],
    name: 'LaunchpadRequestCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_saleStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_saleEndTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_tokenPrice',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_isVestingEnabled',
        type: 'bool',
      },
    ],
    name: 'addLaunchpad',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'approveLaunchpadRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'approvedLaunchpads',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'cancelLaunchpadRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'config',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_launchpadAddress',
        type: 'address',
      },
    ],
    name: 'getLaunchpadDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'admin',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'saleStartTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'saleEndTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenPrice',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'baseAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'canceled',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'launchpadAddress',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isVestingEnabled',
            type: 'bool',
          },
        ],
        internalType: 'struct LaunchpadFactory.LaunchpadRequest',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_config',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isWhitelisted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requestCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_saleStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_saleEndTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_tokenPrice',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_isVestingEnabled',
        type: 'bool',
      },
    ],
    name: 'requestLaunchpad',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'requests',
    outputs: [
      {
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'saleStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'saleEndTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokenPrice',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'baseToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'canceled',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'launchpadAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isVestingEnabled',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_launchpadAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_vestingContract',
        type: 'address',
      },
    ],
    name: 'setVestingContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'tokenToLaunchpad',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
