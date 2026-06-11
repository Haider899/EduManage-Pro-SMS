import express, { Response } from "express";
import OpenAI from "openai";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * POST /api/ai/chat
 * Authenticated AI chat endpoint — requires valid JWT.
 * Rate-limited by requiring auth so only logged-in users can consume credits.
 */
router.post("/chat", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "Message too long. Maximum 2000 characters.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: "AI service is not configured",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an NexduManage Pro assistant — a helpful AI for school/college administrators, teachers, and students. Answer concisely and professionally.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 1024,
    });

    const reply = response.choices[0]?.message?.content ?? "No response generated.";

    return res.json({ success: true, reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[AI Route Error]:", message);
    return res.status(500).json({
      success: false,
      error: "AI service temporarily unavailable",
    });
  }
});

export default router;
