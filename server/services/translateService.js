import axios from 'axios';

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const translateText = async (text) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `let translate this sentence to vietnamese: '${text}'. Just return answer`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the translation from the response
    const translation = response.data.choices[0].message.content;
    return translation;
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    throw new Error('Failed to translate text');
  }
};

export {
  translateText
};