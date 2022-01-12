import { AbiItem } from 'web3-utils/types'

export const ABI_IMPLEMENTATION: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newContract',
        type: 'address',
      },
    ],
    name: 'ContractUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint32', name: 'index', type: 'uint32' },
    ],
    name: 'GuardianSetAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'sequence',
        type: 'uint64',
      },
      { indexed: false, internalType: 'uint32', name: 'nonce', type: 'uint32' },
      { indexed: false, internalType: 'bytes', name: 'payload', type: 'bytes' },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'consistencyLevel',
        type: 'uint8',
      },
    ],
    name: 'LogMessagePublished',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'chainId',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentGuardianSetIndex',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: 'index', type: 'uint32' }],
    name: 'getGuardianSet',
    outputs: [
      {
        components: [
          { internalType: 'address[]', name: 'keys', type: 'address[]' },
          { internalType: 'uint32', name: 'expirationTime', type: 'uint32' },
        ],
        internalType: 'struct Structs.GuardianSet',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getGuardianSetExpiry',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'hash', type: 'bytes32' }],
    name: 'governanceActionIsConsumed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'governanceChainId',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'governanceContract',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'initialGuardians',
        type: 'address[]',
      },
      { internalType: 'uint16', name: 'chainId', type: 'uint16' },
      { internalType: 'uint16', name: 'governanceChainId', type: 'uint16' },
      { internalType: 'bytes32', name: 'governanceContract', type: 'bytes32' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'impl', type: 'address' }],
    name: 'isInitialized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'messageFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'emitter', type: 'address' }],
    name: 'nextSequence',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedVM', type: 'bytes' }],
    name: 'parseAndVerifyVM',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'version', type: 'uint8' },
          { internalType: 'uint32', name: 'timestamp', type: 'uint32' },
          { internalType: 'uint32', name: 'nonce', type: 'uint32' },
          { internalType: 'uint16', name: 'emitterChainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
          { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
          { internalType: 'bytes', name: 'payload', type: 'bytes' },
          { internalType: 'uint32', name: 'guardianSetIndex', type: 'uint32' },
          {
            components: [
              { internalType: 'bytes32', name: 'r', type: 'bytes32' },
              { internalType: 'bytes32', name: 's', type: 'bytes32' },
              { internalType: 'uint8', name: 'v', type: 'uint8' },
              { internalType: 'uint8', name: 'guardianIndex', type: 'uint8' },
            ],
            internalType: 'struct Structs.Signature[]',
            name: 'signatures',
            type: 'tuple[]',
          },
          { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
        ],
        internalType: 'struct Structs.VM',
        name: 'vm',
        type: 'tuple',
      },
      { internalType: 'bool', name: 'valid', type: 'bool' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedUpgrade', type: 'bytes' }],
    name: 'parseContractUpgrade',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'module', type: 'bytes32' },
          { internalType: 'uint8', name: 'action', type: 'uint8' },
          { internalType: 'uint16', name: 'chain', type: 'uint16' },
          { internalType: 'address', name: 'newContract', type: 'address' },
        ],
        internalType: 'struct GovernanceStructs.ContractUpgrade',
        name: 'cu',
        type: 'tuple',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedUpgrade', type: 'bytes' }],
    name: 'parseGuardianSetUpgrade',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'module', type: 'bytes32' },
          { internalType: 'uint8', name: 'action', type: 'uint8' },
          { internalType: 'uint16', name: 'chain', type: 'uint16' },
          {
            components: [
              { internalType: 'address[]', name: 'keys', type: 'address[]' },
              {
                internalType: 'uint32',
                name: 'expirationTime',
                type: 'uint32',
              },
            ],
            internalType: 'struct Structs.GuardianSet',
            name: 'newGuardianSet',
            type: 'tuple',
          },
          {
            internalType: 'uint32',
            name: 'newGuardianSetIndex',
            type: 'uint32',
          },
        ],
        internalType: 'struct GovernanceStructs.GuardianSetUpgrade',
        name: 'gsu',
        type: 'tuple',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'encodedSetMessageFee', type: 'bytes' },
    ],
    name: 'parseSetMessageFee',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'module', type: 'bytes32' },
          { internalType: 'uint8', name: 'action', type: 'uint8' },
          { internalType: 'uint16', name: 'chain', type: 'uint16' },
          { internalType: 'uint256', name: 'messageFee', type: 'uint256' },
        ],
        internalType: 'struct GovernanceStructs.SetMessageFee',
        name: 'smf',
        type: 'tuple',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'encodedTransferFees', type: 'bytes' },
    ],
    name: 'parseTransferFees',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'module', type: 'bytes32' },
          { internalType: 'uint8', name: 'action', type: 'uint8' },
          { internalType: 'uint16', name: 'chain', type: 'uint16' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'bytes32', name: 'recipient', type: 'bytes32' },
        ],
        internalType: 'struct GovernanceStructs.TransferFees',
        name: 'tf',
        type: 'tuple',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedVM', type: 'bytes' }],
    name: 'parseVM',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'version', type: 'uint8' },
          { internalType: 'uint32', name: 'timestamp', type: 'uint32' },
          { internalType: 'uint32', name: 'nonce', type: 'uint32' },
          { internalType: 'uint16', name: 'emitterChainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
          { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
          { internalType: 'bytes', name: 'payload', type: 'bytes' },
          { internalType: 'uint32', name: 'guardianSetIndex', type: 'uint32' },
          {
            components: [
              { internalType: 'bytes32', name: 'r', type: 'bytes32' },
              { internalType: 'bytes32', name: 's', type: 'bytes32' },
              { internalType: 'uint8', name: 'v', type: 'uint8' },
              { internalType: 'uint8', name: 'guardianIndex', type: 'uint8' },
            ],
            internalType: 'struct Structs.Signature[]',
            name: 'signatures',
            type: 'tuple[]',
          },
          { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
        ],
        internalType: 'struct Structs.VM',
        name: 'vm',
        type: 'tuple',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: 'nonce', type: 'uint32' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'publishMessage',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '_vm', type: 'bytes' }],
    name: 'submitContractUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '_vm', type: 'bytes' }],
    name: 'submitNewGuardianSet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '_vm', type: 'bytes' }],
    name: 'submitSetMessageFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '_vm', type: 'bytes' }],
    name: 'submitTransferFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
      {
        components: [
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'uint8', name: 'guardianIndex', type: 'uint8' },
        ],
        internalType: 'struct Structs.Signature[]',
        name: 'signatures',
        type: 'tuple[]',
      },
      {
        components: [
          { internalType: 'address[]', name: 'keys', type: 'address[]' },
          { internalType: 'uint32', name: 'expirationTime', type: 'uint32' },
        ],
        internalType: 'struct Structs.GuardianSet',
        name: 'guardianSet',
        type: 'tuple',
      },
    ],
    name: 'verifySignatures',
    outputs: [
      { internalType: 'bool', name: 'valid', type: 'bool' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint8', name: 'version', type: 'uint8' },
          { internalType: 'uint32', name: 'timestamp', type: 'uint32' },
          { internalType: 'uint32', name: 'nonce', type: 'uint32' },
          { internalType: 'uint16', name: 'emitterChainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
          { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
          { internalType: 'bytes', name: 'payload', type: 'bytes' },
          { internalType: 'uint32', name: 'guardianSetIndex', type: 'uint32' },
          {
            components: [
              { internalType: 'bytes32', name: 'r', type: 'bytes32' },
              { internalType: 'bytes32', name: 's', type: 'bytes32' },
              { internalType: 'uint8', name: 'v', type: 'uint8' },
              { internalType: 'uint8', name: 'guardianIndex', type: 'uint8' },
            ],
            internalType: 'struct Structs.Signature[]',
            name: 'signatures',
            type: 'tuple[]',
          },
          { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
        ],
        internalType: 'struct Structs.VM',
        name: 'vm',
        type: 'tuple',
      },
    ],
    name: 'verifyVM',
    outputs: [
      { internalType: 'bool', name: 'valid', type: 'bool' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
