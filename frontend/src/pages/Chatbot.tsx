import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

interface ChatbotProps {
  userPortfolio: {
    stocks: { symbol: string; quantity: number; buy_price: number }[];
    investment_goal: string;
    risk_tolerance: string;
  };
}

const Chatbot: React.FC<ChatbotProps> = ({ userPortfolio }) => {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    socket.on("chat_response", (data) => {
      setLoading(false);
      if (data.error) {
        setResponse(`⚠️ Error: ${data.error}`);
      } else {
        setResponse(data.response);
      }
    });

    return () => {
      socket.off("chat_response");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse("");

    socket.emit("chat_message", { userPortfolio, message });
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg w-96">
      <h2 className="text-xl font-bold">AI Financial Advisor 💬</h2>
      <textarea
        className="w-full p-2 bg-gray-800 text-white rounded mt-2"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask AI about your portfolio..."
      />
      <button
        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Advice"}
      </button>
      {response && (
        <div className="mt-4 p-2 bg-gray-800 rounded">
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;