module zetachain_gateway::main {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_PAUSED: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_ALREADY_INITIALIZED: u64 = 4;

    struct ZetaMessage has drop, store {
        source_chain_id: u64,
        destination_chain_id: u64,
        destination_address: vector<u8>,
        payload: vector<u8>,
        gas_limit: u64,
    }

    struct GatewayState has key {
        owner: address,
        paused: bool,
        supported_chains: vector<u64>,
        message_fee: u64,
        deposit_events: EventHandle<DepositEvent>,
        withdrawal_events: EventHandle<WithdrawalEvent>,
        message_events: EventHandle<CrossChainMessage>
    }

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

    struct CrossChainMessage has drop, store {
        message: ZetaMessage,
        timestamp: u64
    }

    public fun initialize(account: &signer) {
        let sender = signer::address_of(account);
        assert!(!exists<GatewayState>(sender), E_ALREADY_INITIALIZED);

        move_to(account, GatewayState {
            owner: sender,
            paused: false,
            supported_chains: vector::empty(),
            message_fee: 0,
            deposit_events: event::new_event_handle<DepositEvent>(account),
            withdrawal_events: event::new_event_handle<WithdrawalEvent>(account),
            message_events: event::new_event_handle<CrossChainMessage>(account)
        });
    }

    public fun deposit<CoinType>(
        from: &signer,
        amount: u64,
        destination_chain_id: u64,
        recipient: vector<u8>
    ) acquires GatewayState {
        let state = borrow_global_mut<GatewayState>(@zetachain_gateway);
        assert!(!state.paused, E_PAUSED);
        assert!(amount > 0, E_INVALID_AMOUNT);

        let sender = signer::address_of(from);
        let coins = coin::withdraw<CoinType>(from, amount);
        coin::deposit(@zetachain_gateway, coins);

        event::emit_event(
            &mut state.deposit_events,
            DepositEvent {
                sender,
                recipient,
                amount,
                destination_chain_id,
                timestamp: timestamp::now_seconds()
            }
        );
    }

    public fun withdraw<CoinType>(
        admin: &signer,
        recipient: address,
        amount: u64,
        source_chain_id: u64
    ) acquires GatewayState {
        let state = borrow_global_mut<GatewayState>(@zetachain_gateway);
        assert!(signer::address_of(admin) == state.owner, E_NOT_AUTHORIZED);
        assert!(!state.paused, E_PAUSED);

        let coins = coin::withdraw<CoinType>(&state.owner, amount);
        coin::deposit(recipient, coins);

        event::emit_event(
            &mut state.withdrawal_events,
            WithdrawalEvent {
                recipient,
                amount,
                source_chain_id,
                timestamp: timestamp::now_seconds()
            }
        );
    }

    public fun send_message(
        from: &signer,
        destination_chain_id: u64,
        destination_address: vector<u8>,
        payload: vector<u8>,
        gas_limit: u64
    ) acquires GatewayState {
        let state = borrow_global_mut<GatewayState>(@zetachain_gateway);
        assert!(!state.paused, E_PAUSED);

        let message = ZetaMessage {
            source_chain_id: 1, // Aptos chain ID
            destination_chain_id,
            destination_address,
            payload,
            gas_limit
        };

        event::emit_event(
            &mut state.message_events,
            CrossChainMessage {
                message,
                timestamp: timestamp::now_seconds()
            }
        );
    }
}
