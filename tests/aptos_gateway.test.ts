import { 
    AptosClient,
    AptosAccount,
    CoinClient,
    FaucetClient
} from "aptos";

const NODE_URL = "http://localhost:8080";
const FAUCET_URL = "http://localhost:8081";

describe("ZetaChain Aptos Gateway Tests", () => {
    let client: AptosClient;
    let faucetClient: FaucetClient;
    let coinClient: CoinClient;
    let admin: AptosAccount;
    let user: AptosAccount;

    beforeAll(async () => {
        client = new AptosClient(NODE_URL);
        faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
        coinClient = new CoinClient(client);
        
        admin = new AptosAccount();
        user = new AptosAccount();
        
        // Fund accounts
        await faucetClient.fundAccount(admin.address(), 100_000_000);
        await faucetClient.fundAccount(user.address(), 100_000_000);
    });

    test("Initialize Gateway", async () => {
        const payload = {
            function: "0x1::zetachain_gateway::initialize",
            type_arguments: [],
            arguments: []
        };

        const txnRequest = await client.generateTransaction(admin.address(), payload);
        const signedTxn = await client.signTransaction(admin, txnRequest);
        const result = await client.submitTransaction(signedTxn);
        
        expect(result.success).toBe(true);
    });

    test("Deposit Tokens", async () => {
        const amount = 1000000;
        const destinationChainId = 2; // Example chain ID
        const recipient = "0x123..."; // Example recipient address

        const payload = {
            function: "0x1::zetachain_gateway::deposit",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [amount, destinationChainId, recipient]
        };

        const txnRequest = await client.generateTransaction(user.address(), payload);
        const signedTxn = await client.signTransaction(user, txnRequest);
        const result = await client.submitTransaction(signedTxn);
        
        expect(result.success).toBe(true);
    });
});
