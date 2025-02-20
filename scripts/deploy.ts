import { AptosClient, AptosAccount, FaucetClient } from "aptos";
import * as fs from 'fs';

async function deployGateway() {
    const NODE_URL = process.env.APTOS_NODE_URL || "http://localhost:8080";
    const client = new AptosClient(NODE_URL);

    // Load or create admin account
    const adminKey = process.env.ADMIN_KEY || new AptosAccount().toPrivateKeyObject();
    const admin = new AptosAccount(adminKey);

    // Deploy gateway module
    const moduleHex = fs.readFileSync("./build/zetachain_gateway.mv").toString("hex");
    
    const payload = {
        type: "module_bundle_payload",
        modules: [
            {
                bytecode: `0x${moduleHex}`
            }
        ]
    };

    const txnRequest = await client.generateTransaction(admin.address(), payload);
    const signedTxn = await client.signTransaction(admin, txnRequest);
    const result = await client.submitTransaction(signedTxn);

    console.log("Gateway deployed:", result.hash);
    
    // Initialize gateway
    const initPayload = {
        function: "0x1::zetachain_gateway::initialize",
        type_arguments: [],
        arguments: []
    };

    const initTxnRequest = await client.generateTransaction(admin.address(), initPayload);
    const signedInitTxn = await client.signTransaction(admin, initTxnRequest);
    const initResult = await client.submitTransaction(signedInitTxn);

    console.log("Gateway initialized:", initResult.hash);
}

deployGateway().catch(console.error);
