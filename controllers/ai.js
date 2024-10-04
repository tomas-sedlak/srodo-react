import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuiz = async (req, res) => {
    try {
        const { text } = req.body;
        const { language = "Slovak" } = req.params;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ message: 'Invalid input. Please provide text.' });
        }

        const prompt = `
        Based on the following text, generate quiz:

        Text: ${text}

        Use ${language} language.

        Please return the response as JSON object:
        {
           "title": string,
           "questions": [
                {
                    "question": string,
                    "answers": [string, string, string, string],
                    "correctAnswer": number,
                    "explanation": string
                },
                ...
            ]
        }
        `;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: {
                type: 'json_object',
            },
        })

        console.log(typeof chatCompletion.choices[0].message.content)
        res.json(JSON.parse(chatCompletion.choices[0].message.content));
    } catch (err) {
        res.status(500).send(err.message);
    }
}