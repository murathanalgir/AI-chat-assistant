import { useState } from "react";
import "./index.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
  const theme = {
    light: {
      bgContainer: "bg-white",
      input: "bg-gray-100",
      button: "bg-blue-500",
      messageBubble: {
        user: "bg-blue-100",
        bot: "bg-gray-100",
      },
      text: "text-gray-800",
    },
    dark: {
      bgContainer: "bg-gray-900",
      input: "bg-gray-700",
      button: "bg-blue-600",
      messageBubble: {
        user: "bg-blue-900",
        bot: "bg-gray-800",
      },
      text: "text-gray-200",
    },
  };

  return (
    <div
      className={`w-full min-h-screen p-4 flex flex-col ${
        darkMode ? theme.dark.bgContainer : theme.light.bgContainer
      }`}
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-10 h-10" />
        <div>
          <h2 className="font-semibold text-gray-800">Chat Assistant</h2>
          <p className="text-sm text-gray-600">Available</p>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={darkMode ? "text-yellow-400" : "text-blue-600"}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
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
            <div
              key={index}
              className={`flex ${
                chat.role === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${darkMode ? (chat.role === 'You' ? theme.dark.messageBubble.user : theme.dark.messageBubble.bot) : (chat.role === 'You' ? theme.light.messageBubble.user : theme.light.messageBubble.bot)}`}
              >
                <p>{chat.parts[0].text}</p>
                <p
                  className={`text-xs mt-1 opacity-70 ${
                    chat.role === "You" ? "text-blue-100" : "text-gray-600"
                  }`}
                >
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
