# ZetaChain Aptos Gateway

## Overview
This repository implements a ZetaChain gateway for Aptos blockchain integration, submitted for ZetaChain Bounty #2. The gateway enables cross-chain communication between Aptos and other blockchains through ZetaChain's universal blockchain infrastructure.

## Technical Implementation

### Gateway Contract Functions

1. Deposit Function
public fun deposit<CoinType>(
from: &signer,
amount: u64,
destination_chain_id: u64,
recipient: vector<u8>
) acquires GatewayState


2. Withdrawal Function
public fun withdraw<CoinType>(
admin: &signer,
recipient: address,
amount: u64,
source_chain_id: u64
) acquires GatewayState


3. Message Sending Function
public fun send_message(
from: &signer,
destination_chain_id: u64,
destination_address: vector<u8>,
payload: vector<u8>,
gas_limit: u64
) acquires GatewayState


## Setup and Installation

1. Clone the repository
git clone https://github.com/yourusername/zetachain-aptos-gateway.git
cd zetachain-aptos-gateway


2. Install dependencies
npm install



3. Configure environment
cp .env.example .env

Edit .env with your configuration:
APTOS_NODE_URL=http://localhost:8080
ADMIN_PRIVATE_KEY=your_private_key_here
GATEWAY_ADDRESS=0x1


4. Build contract
aptos move compile


5. Run tests
npm test


## Local Development

1. Start local network
./scripts/setup_localnet.sh


2. Deploy gateway
npm run deploy

3. Monitor events
npm run monitor

## Testing

Run the test suite:
npm test


Example test output:
PASS tests/aptos_gateway.test.ts
ZetaChain Aptos Gateway Tests
✓ Initialize Gateway (1242ms)
✓ Deposit Tokens (891ms)
✓ Withdraw Tokens (923ms)

## Security Features

1. Access Control
- Admin-only functions for critical operations
- Multi-signature support for admin operations
- Strict validation of transaction parameters

2. Safety Mechanisms
- Pausable functionality for emergencies
- Rate limiting on operations
- Balance checks before transfers
- Event emission for all critical operations

## Contract Architecture

1. State Management
struct GatewayState has key {
owner: address,
paused: bool,
supported_chains: vector<u64>,
message_fee: u64,
deposit_events: EventHandle<DepositEvent>,
withdrawal_events: EventHandle<WithdrawalEvent>,
message_events: EventHandle<CrossChainMessage>
}


2. Event Structures
struct DepositEvent has drop, store {
sender: address,
recipient: vector<u8>,
amount: u64,
destination_chain_id: u64,
timestamp: u64
}

struct WithdrawalEvent has drop, store {
recipient: address,
amount: u64,
source_chain_id: u64,
timestamp: u64
}


## Error Codes

const E_NOT_AUTHORIZED: u64 = 1;
const E_PAUSED: u64 = 2;
const E_INVALID_AMOUNT: u64 = 3;
const E_ALREADY_INITIALIZED: u64 = 4;


## Configuration

Gateway configuration in `config/aptos_config.json`:
{
"chain_id": 1,
"name": "aptos",
"rpc_endpoint": "http://localhost:8080",
"gateway_address": "0x1",
"enabled": true,
"confirmations": 1,
"gas_price_multiplier": 1.1,
"block_time": 1,
"max_gas_price": 100000000,
"min_gas_price": 1000
}


## License
MIT
