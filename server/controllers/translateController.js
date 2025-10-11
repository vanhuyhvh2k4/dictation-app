import { translateText } from '../services/translateService.js';

const translate = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const translation = await translateText(text);
    res.json({ translation });
  } catch (error) {
    console.error('Translation controller error:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
};

export {
  translate
};