export interface Message {
    type: 'user' | 'bot';
    content: string;
}

export interface Portfolio {
    holdings: {
        symbol: string;
        quantity: number;
        avgPrice: number;
        currentPrice: number;
    }[];
    totalValue: number;
    profitLoss: number;
}

export interface ChatBotProps {
    portfolio: Portfolio;
}