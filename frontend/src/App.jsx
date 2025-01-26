import { useState } from "react";
import "./index.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const backendURL = "http://localhost:8090/gemini";

  const sendChat = async () => {
    setLoading(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ prompt, history }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(backendURL, options);
      const data = await response.json();
      
      setHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "You",
          parts: [{ text: prompt }],
        },
        {
          role: "Gemini",
          parts: [{ text: data.text }],
        },
      ]);
      
      setPrompt("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
   
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-10 h-10" />
        <div>
          <h2 className="font-semibold text-gray-800">Chat Assistant</h2>
          <p className="text-sm text-gray-600">Available</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <input
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Type your message..."
          />
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendChat}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto">
          {history.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${chat.role === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                <p>{chat.parts[0].text}</p>
                <p className={`text-xs mt-1 opacity-70 ${chat.role === 'You' ? 'text-blue-100' : 'text-gray-600'}`}>
                  {chat.timestamp || new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
