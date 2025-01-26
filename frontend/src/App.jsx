// eslint-disable-next-line no-undef
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
      console.log(data);
    } catch (error) {
      console.error(error);
    }
   
  };
  return (
    <div className="w-[960px] text-xl flex flex-col">
      <input
        className="h-[40px]  m-5"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        className="w-[960px] h-[40px] m-5"
        disabled={loading}
        onClick={sendChat}
      >
        {loading ? "Loading..." : "Send"}
      </button>
      <div className="m-5 w-[960px] ">
        {history.map((chat, index) => (
          <div key={index}>
            <p>{chat.role}:</p>
            <p>{chat.parts[0].text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
