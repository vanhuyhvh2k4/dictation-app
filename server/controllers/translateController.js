import { translateText } from '../services/translateService.js';

const translate = async (req, res) => {
  try {
    const { text, targetLanguage = 'vietnamese' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Validate targetLanguage
    const supportedLanguages = [
      'vietnamese', 'english', 'french', 'german', 'spanish', 
      'italian', 'japanese', 'korean', 'chinese', 'russian'
    ];
    
    if (targetLanguage && !supportedLanguages.includes(targetLanguage.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Unsupported target language',
        supportedLanguages
      });
    }

    const translation = await translateText(text, targetLanguage.toLowerCase());
    res.json({ translation });
  } catch (error) {
    console.error('Translation controller error:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
};

export {
  translate
};