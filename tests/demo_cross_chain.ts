async function demonstrateCrossChainFlow() {
    console.log("Starting Cross-Chain Flow Demonstration");

    // 1. Setup accounts
    const sender = new AptosAccount();
    await fundAccount(sender.address());
    console.log("Sender account funded");

    // 2. Deploy test tokens if needed
    const tokenAddress = await deployTestToken();
    console.log("Test token deployed at:", tokenAddress);

    // 3. Demonstrate deposit flow
    console.log("\nInitiating Deposit Flow:");
    const depositResult = await demonstrateDeposit(sender);
    console.log("Deposit completed:", depositResult);

    // 4. Demonstrate withdrawal flow
    console.log("\nInitiating Withdrawal Flow:");
    const withdrawalResult = await demonstrateWithdrawal(sender);
    console.log("Withdrawal completed:", withdrawalResult);

    // 5. Show observer validations
    console.log("\nObserver Validations:");
    await demonstrateObserverValidations();
}

async function demonstrateDeposit(sender: AptosAccount) {
    const amount = 1000000;
    const destinationChainId = 2;
    const destinationAddress = "0x123..."; // Example destination address

    // 1. Prepare deposit transaction
    const depositTx = {
        function: "0x1::zetachain_gateway::deposit",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [amount, destinationChainId, destinationAddress]
    };

    // 2. Execute deposit
    const txResult = await aptosClient.generateSignSubmitTransaction(
        sender,
        depositTx
    );

    // 3. Wait for observer confirmations
    const observerConfirmations = await waitForObserverConfirmations(txResult.hash);
    
    return {
        txHash: txResult.hash,
        confirmations: observerConfirmations
    };
}

async function demonstrateWithdrawal(receiver: AptosAccount) {
    // 1. Simulate incoming ZetaChain message
    const incomingMessage = {
        sourceChainId: 2,
        amount: 500000,
        recipient: receiver.address()
    };

    // 2. Process withdrawal through gateway
    const withdrawalTx = await processIncomingMessage(incomingMessage);

    // 3. Verify completion
    const receipt = await aptosClient.waitForTransactionWithResult(
        withdrawalTx.hash
    );

    return {
        txHash: withdrawalTx.hash,
        status: receipt.success ? "completed" : "failed"
    };
}

async function demonstrateObserverValidations() {
    for (const observer of observers) {
        const status = await observer.getStatus();
        console.log(`Observer ${observer.endpoint} status:`, status);
        
        const recentValidations = await observer.getRecentValidations();
        console.log(`Recent validations:`, recentValidations);
    }
}

// Helper functions
async function fundAccount(address: string) {
    // Implementation for funding test accounts
}

async function deployTestToken() {
    // Implementation for deploying test tokens
}

async function waitForObserverConfirmations(txHash: string) {
    // Implementation for waiting for observer confirmations
}

async function processIncomingMessage(message: any) {
    // Implementation for processing incoming messages
}

// Run demonstration if called directly
if (require.main === module) {
    demonstrateCrossChainFlow()
        .then(() => console.log("Demonstration completed successfully"))
        .catch(console.error);
}
