import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Message, ChatBotProps } from '../types/chat';

const ChatBot: React.FC<ChatBotProps> = ({ portfolio }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async (): Promise<void> => {
        if (!input.trim()) return;
        
        setLoading(true);
        setMessages(prev => [...prev, { type: 'user', content: input }]);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: input,
                    portfolio: portfolio
                }),
            });
            
            const data = await response.json();
            setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: 'Sorry, I encountered an error. Please try again.' 
            }]);
        }
        
        setLoading(false);
        setInput('');
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    return (
        <div className="flex flex-col h-[600px] bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} 
                         className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-lg p-3 
                            ${msg.type === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-800'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg p-3">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your investments..."
                    className="flex-1 p-2 rounded-lg bg-white/20 backdrop-blur-sm"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;