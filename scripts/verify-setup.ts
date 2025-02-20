import { AptosClient } from "aptos";
import { ZetaObserver } from "./zeta-observer";

async function verifySetup() {
    // Verify Aptos node
    const aptosClient = new AptosClient("http://localhost:8080");
    const nodeInfo = await aptosClient.getNodeInfo();
    console.log("Aptos node status:", nodeInfo.status);

    // Verify observers
    const observers = OBSERVER_ENDPOINTS.map(endpoint => 
        new ZetaObserver(endpoint)
    );

    for (const observer of observers) {
        const status = await observer.getStatus();
        console.log(`Observer status (${observer.endpoint}):`, status);
    }

    // Verify gateway contract
    const gatewayAddress = process.env.GATEWAY_ADDRESS;
    const gatewayState = await aptosClient.getAccountResource(
        gatewayAddress,
        "0x1::zetachain_gateway::GatewayState"
    );
    console.log("Gateway state:", gatewayState);
}

verifySetup().catch(console.error);
