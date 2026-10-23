import { Router, Request, Response } from 'express';
import { queryAiTutor, checkOllamaHealth } from '../services/aiTutor.js';

const router = Router();

// Check AI Service Health and Models
router.get('/status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const health = await checkOllamaHealth();
    res.json({
      success: true,
      ollamaAvailable: health.available,
      models: health.models,
      fallbackEngine: 'AlgoVortex Heuristic DSA Tutor v2.0',
      activeEngine: health.available ? 'Ollama Local LLM' : 'AlgoVortex Smart DSA Engine',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'AI status check failed.' });
  }
});

// Chat with AI Tutor
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { problemTitle, problemTopic, problemDescription, currentCode, language, mode, message, chatHistory } = req.body;

    if (!message && !mode) {
      res.status(400).json({ success: false, message: 'Message or mode is required.' });
      return;
    }

    const tutorResponse = await queryAiTutor({
      problemTitle,
      problemTopic,
      problemDescription,
      currentCode,
      language,
      mode,
      message: message || '',
      chatHistory,
    });

    res.json({
      success: true,
      ...tutorResponse,
    });
  } catch (error: any) {
    console.error('[AI Tutor] Chat error:', error);
    res.status(500).json({ success: false, message: 'AI Tutor service encountered an error.' });
  }
});

export default router;
