import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//initializing 
dotenv.config();
// I'm created basic express backend server for frontend to communicate with the Google AI model.
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY); 


app.post("/gemini", async (req, res) => {
    // We are setting up our language model here.
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const chat = model.startChat({
        // We are fetching the history from the frontend, and it gets refreshed every time a connection is made.
        history: req.body.history
      });
    
      // Get request from frontend and send back it
      const result = await chat.sendMessage(req.body.prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      // We are sending the response back to the frontend.
      res.json({text});
});
app.listen(8090, () => {
    console.log("Server is running on port 8090");
});
