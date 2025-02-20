import express from 'express';
import { AptosClient } from "aptos";
import { ZetaObserver } from "../zeta-observer";

const app = express();

class MonitoringDashboard {
    private client: AptosClient;
    private observers: ZetaObserver[];
    private metrics: Map<string, any>;

    constructor() {
        this.client = new AptosClient("http://localhost:8080");
        this.observers = this.initializeObservers();
        this.metrics = new Map();
    }

    async startMonitoring() {
        // Update metrics every 5 seconds
        setInterval(async () => {
            await this.updateMetrics();
        }, 5000);

        // Setup API endpoints
        this.setupEndpoints();
    }

    private async updateMetrics() {
        // Update Gateway Status
        this.metrics.set('gateway', await this.getGatewayMetrics());
        
        // Update Observer Status
        this.metrics.set('observers', await this.getObserverMetrics());
        
        // Update Transaction Metrics
        this.metrics.set('transactions', await this.getTransactionMetrics());
    }

    private async getGatewayMetrics() {
        return {
            status: await this.client.getGatewayStatus(),
            totalTransactions: await this.getTotalTransactions(),
            activeValidators: await this.getActiveValidators(),
            performance: await this.getPerformanceMetrics()
        };
    }

    private async getObserverMetrics() {
        const metrics = [];
        for (const observer of this.observers) {
            metrics.push({
                id: observer.getId(),
                status: await observer.getStatus(),
                latency: await observer.getLatency(),
                lastBlock: await observer.getLastProcessedBlock(),
                validations: await observer.getValidationCount()
            });
        }
        return metrics;
    }

    private async getTransactionMetrics() {
        return {
            pending: await this.getPendingTransactions(),
            completed: await this.getCompletedTransactions(),
            failed: await this.getFailedTransactions(),
            averageConfirmationTime: await this.getAverageConfirmationTime()
        };
    }

    private setupEndpoints() {
        // API endpoints for monitoring
        app.get('/api/status', (req, res) => {
            res.json(this.metrics);
        });

        app.get('/api/transactions', (req, res) => {
            res.json(this.metrics.get('transactions'));
        });

        app.get('/api/observers', (req, res) => {
            res.json(this.metrics.get('observers'));
        });

        app.get('/api/alerts', (req, res) => {
            res.json(this.getActiveAlerts());
        });
    }
}
