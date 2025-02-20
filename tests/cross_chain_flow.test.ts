import { AptosClient, AptosAccount, CoinClient } from "aptos";
import { ZetaObserver } from "../scripts/zeta-observer";
import { expect } from 'chai';

describe("Cross-Chain Transaction Flow Tests", () => {
    let aptosClient: AptosClient;
    let coinClient: CoinClient;
    let sender: AptosAccount;
    let receiver: AptosAccount;
    let observers: ZetaObserver[];

    before(async () => {
        aptosClient = new AptosClient("http://localhost:8080");
        coinClient = new CoinClient(aptosClient);
        sender = new AptosAccount();
        receiver = new AptosAccount();
        
        // Initialize observers
        observers = [
            new ZetaObserver("http://localhost:8081"),
            new ZetaObserver("http://localhost:8082"),
            new ZetaObserver("http://localhost:8083")
        ];

        // Fund test accounts
        await fundAccount(sender.address());
        await fundAccount(receiver.address());
    });

    it("should complete full cross-chain deposit flow", async () => {
        const amount = 1000000;
        const destinationChainId = 2; // Example destination chain
        
        // 1. Initial balance check
        const initialBalance = await coinClient.checkBalance(sender);
        
        // 2. Initiate deposit
        const depositTx = await initiateDeposit(sender, amount, destinationChainId);
        expect(depositTx.success).to.be.true;

        // 3. Verify observer signatures
        const signatures = await collectObserverSignatures(depositTx.hash);
        expect(signatures.length).to.be.greaterThanOrEqual(2);

        // 4. Verify event emission
        const events = await aptosClient.getEventsByEventHandle(
            process.env.GATEWAY_ADDRESS!,
            "zetachain_gateway::main::GatewayState",
            "deposit_events"
        );
        expect(events[0].data.amount).to.equal(amount);
    });

    it("should complete full cross-chain withdrawal flow", async () => {
        const amount = 500000;
        const sourceChainId = 2;

        // 1. Initial balance check
        const initialBalance = await coinClient.checkBalance(receiver);

        // 2. Simulate incoming ZetaChain message
        const incomingMessage = await simulateIncomingMessage(
            sourceChainId,
            receiver.address(),
            amount
        );
        expect(incomingMessage.success).to.be.true;

        // 3. Process withdrawal
        const withdrawalTx = await processWithdrawal(
            receiver.address(),
            amount,
            sourceChainId
        );
        expect(withdrawalTx.success).to.be.true;

        // 4. Verify final balance
        const finalBalance = await coinClient.checkBalance(receiver);
        expect(finalBalance).to.equal(initialBalance + amount);
    });
});
