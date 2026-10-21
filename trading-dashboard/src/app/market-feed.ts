import { Service, signal } from '@angular/core';

export interface Ticker {
    symbol: string;
    price: number;
    change: number;
}

@Service()
export class MarketFeed {
    private readonly _tickers = signal<Ticker[]>([]);
    // Keep the writable signal private; consumers can read tickers without changing its state.
    readonly tickers = this._tickers.asReadonly();

    constructor() {
        this.startSimulation();
    }


    private startSimulation(): void {
        setInterval(() => {
            this._tickers.update(prev => {
                if (prev.length === 0) {
                    return ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'].map(s => ({
                        symbol: s,
                        price: 100 + Math.random() * 200,
                        change: 0,
                    }));
                }
                const idx = Math.floor(Math.random() * prev.length);
                const updated = [...prev];
                const old = updated[idx];
                const newPrice = old.price * (1 + (Math.random() - 0.5) * 0.01);
                updated[idx] = { ...old, price: newPrice, change: newPrice - old.price };
                return updated;
            });
        }, 100);
    }
}
