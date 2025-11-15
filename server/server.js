require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5000;

let chatHistory = [];

app.post("/chat", async (req, res) => {
    const { message, file } = req.body;

    // Gemini format for user message
    const userEntry = {
        role: "user",
        parts: [{ text: message }]
    };

    if (file?.data) {
        userEntry.parts.push({
            inline_data: {
                data: file.data,
                mime_type: file.mime_type
            }
        });
    }

    chatHistory.push(userEntry);
    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                contents: chatHistory   // ✔ FIXED — must use contents
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.API_KEY
                }
            }
        );

        const botText =
            response.data.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ||
            "No response";

        // Save bot message
        chatHistory.push({
            role: "model",
            parts: [{ text: botText }]
        });

        if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

        res.json({ reply: botText });
    } catch (error) {
        console.error("Google API error:", error.response?.data || error.message);

        res.status(500).json({
            error:
                error.response?.data?.error?.message ||
                "Failed to get response from Gemini API"
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
