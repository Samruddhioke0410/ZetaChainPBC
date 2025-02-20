import { AptosClient } from "aptos";
import { EventStream } from "./eventStream";

const NODE_URL = process.env.APTOS_NODE_URL || "http://localhost:8080";
const GATEWAY_ADDRESS = process.env.GATEWAY_ADDRESS || "0x1";

async function monitorGatewayEvents() {
    const client = new AptosClient(NODE_URL);
    const eventStream = new EventStream(client);

    // Monitor deposit events
    eventStream.subscribeToEvents(
        GATEWAY_ADDRESS,
        "zetachain_gateway::main::DepositEvent",
        (event) => {
            console.log("New deposit:", event);
        }
    );

    // Monitor withdrawal events
    eventStream.subscribeToEvents(
        GATEWAY_ADDRESS,
        "zetachain_gateway::main::WithdrawalEvent",
        (event) => {
            console.log("New withdrawal:", event);
        }
    );
}

monitorGatewayEvents().catch(console.error);
