import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/submit", async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !fullName.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: "Full name, email, and message are required.",
    });
  }

  try {
    const backendUrl =
      process.env.FLASK_BACKEND_URL || "http://127.0.0.1:5000";

    const response = await fetch(`${backendUrl}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: typeof phone === "string" ? phone.trim() : "",
        message: message.trim(),
      }),
      signal: AbortSignal.timeout(10000),
    });

    const result = await response.json();

    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Flask backend request failed:", error.message);

    return res.status(502).json({
      error: "Unable to connect to the Flask backend.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});