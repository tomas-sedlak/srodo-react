import OpenAI from "openai";
import path from "path";
import officeParser from "officeparser";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateQuizFromText = async (text, language) => {
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

    return JSON.parse(chatCompletion.choices[0].message.content);
}

const generateQuizFromFile = async (file, language) => {
    const allowedExtensions = [".docx", ".pptx", ".xlsx", ".odt", ".odp", ".ods", ".pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        return new Error("Invalid file type.");
    }

    if (file.size > maxSize) {
        return new Error("File size exceeds the 5MB limit.");
    }

    const text = await officeParser.parseOfficeAsync(file.buffer);

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

    return JSON.parse(chatCompletion.choices[0].message.content);
}

export const generateQuiz = async (req, res) => {
    try {
        const { language = "Slovak" } = req.params;

        if (req.body.text) {
            const quiz = await generateQuizFromText(req.body.text, language);
            res.json(quiz);
        } else if (req.files.file) {
            const quiz = await generateQuizFromFile(req.files.file, language);
            res.json(quiz);
        } else if (req.files.images) {
            // TODO
        } else {
            return res.status(400).json({ message: "Invalid input. Please provide text, file or image." });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}