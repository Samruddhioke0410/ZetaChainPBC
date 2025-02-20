# ZetaChain Aptos Gateway API Reference

## Core Functions

### deposit()
Initiates a cross-chain token transfer from Aptos.

public fun deposit<CoinType>(
from: &signer,
amount: u64,
destination_chain_id: u64,
recipient: vector<u8>
) acquires GatewayState

**Parameters:**
- from: Transaction signer
- amount: Token amount to transfer
- destination_chain_id: Target blockchain identifier
- recipient: Recipient address on destination chain

**Events Emitted:**
- DepositEvent
- ObserverEvent

**Error Codes:**
- E_PAUSED (2): Gateway is paused
- E_INVALID_AMOUNT (3): Amount is zero
- E_INVALID_CHAIN_ID (5): Unsupported chain

**Example:**
const deposit = await gateway.deposit({
tokenType: "0x1::aptos_coin::AptosCoin",
amount: 1000000,
destinationChain: 2,
recipient: "0x123..."
});


### withdraw()
Processes incoming cross-chain transfers.

public fun withdraw<CoinType>(
admin: &signer,
recipient: address,
amount: u64,
source_chain_id: u64
) acquires GatewayState


**Parameters:**
- admin: Gateway administrator signer
- recipient: Receiving address on Aptos
- amount: Token amount
- source_chain_id: Origin chain identifier

**Events Emitted:**
- WithdrawalEvent
- ObserverEvent

**Error Codes:**
- E_NOT_AUTHORIZED (1): Caller not authorized
- E_PAUSED (2): Gateway is paused

**Example:**
const withdrawal = await gateway.withdraw({
recipient: "0x456...",
amount: 500000,
sourceChain: 2
});


### send_message()
Sends cross-chain messages through ZetaChain.

public fun send_message(
from: &signer,
destination_chain_id: u64,
destination_address: vector<u8>,
payload: vector<u8>,
gas_limit: u64
) acquires GatewayState


**Parameters:**
- from: Message sender
- destination_chain_id: Target chain ID
- destination_address: Recipient address
- payload: Message data
- gas_limit: Maximum gas for execution

**Events Emitted:**
- CrossChainMessage
- ObserverEvent

**Example:**
const message = await gateway.sendMessage({
destinationChain: 2,
recipient: "0x789...",
payload: "0x...",
gasLimit: 100000
});


## Observer Functions

### register_observer()
Registers a new observer node.

public fun register_observer(
admin: &signer,
observer_address: address,
voting_power: u64
) acquires GatewayState


**Parameters:**
- admin: Gateway administrator
- observer_address: Observer node address
- voting_power: Observer voting weight

**Example:**
await gateway.registerObserver({
address: "0x...",
votingPower: 1
});


## Event Structures

### DepositEvent
struct DepositEvent has drop, store {
sender: address,
recipient: vector<u8>,
amount: u64,
destination_chain_id: u64,
timestamp: u64
}


### WithdrawalEvent
struct WithdrawalEvent has drop, store {
recipient: address,
amount: u64,
source_chain_id: u64,
timestamp: u64
}


### ObserverEvent
struct ObserverEvent has drop, store {
chain_id: u64,
message_hash: vector<u8>,
signatures: vector<vector<u8>>,
timestamp: u64
}

## Helper Functions

### verify_signatures()
Verifies observer signatures for cross-chain messages.

async function verifySignatures(
messageHash: string,
signatures: string[]
): Promise<boolean>

**Example:**
const isValid = await gateway.verifySignatures(
messageHash,
signatures
);


### get_transaction_status()
Checks cross-chain transaction status.

async function getTransactionStatus(
txHash: string
): Promise<TransactionStatus>


**Example:**
const status = await gateway.getTransactionStatus(
"0x123..."
);


## Monitoring API

### get_observer_status()
Retrieves observer node status.

async function getObserverStatus(
observerId: string
): Promise<ObserverStatus>


### get_pending_transactions()
Lists pending cross-chain transactions.

async function getPendingTransactions(): Promise<Transaction[]>


## Error Handling

All functions can throw the following errors:
- E_NOT_AUTHORIZED (1): Unauthorized access
- E_PAUSED (2): Gateway paused
- E_INVALID_AMOUNT (3): Invalid amount
- E_ALREADY_INITIALIZED (4): Already initialized
- E_INVALID_CHAIN_ID (5): Invalid chain ID
- E_INSUFFICIENT_VALIDATORS (6): Not enough validators
- E_INVALID_SIGNATURE (7): Invalid signature

## Best Practices

1. Always wait for observer confirmations:
const tx = await gateway.deposit(...);
await tx.waitForConfirmation(3); // Wait for 3 observers


2. Implement proper error handling:
try {
await gateway.deposit(...);
} catch (e) {
if (e.code === 'E_PAUSED') {
// Handle paused gateway
}
}


3. Monitor transaction status:
const status = await gateway.getTransactionStatus(txHash);
while (status.pending) {
await new Promise(r => setTimeout(r, 1000));
status = await gateway.getTransactionStatus(txHash);
}


## Testing Utilities

### mock_observer()
Creates mock observer for testing.

function mockObserver(
config: ObserverConfig
): Observer


### simulate_cross_chain_tx()
Simulates cross-chain transaction flow.

async function simulateCrossChainTx(
config: SimulationConfig
): Promise<SimulationResult>
