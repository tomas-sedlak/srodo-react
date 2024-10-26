import OpenAI from "openai";
import path from "path";
import officeParser from "officeparser";
import Quiz from "../models/Quiz.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateQuizFromText = async (text, language) => {
    if (text.length > 5000) {
        throw new Error("Text je príliš dlhý.");
    }
    
    const prompt = `
    Based on the following text, generate quiz:

    Text: ${text}

    Use ${language} language.

    Generate at least 10 questions.

    Please return the response as JSON object:
    {
    "title": string,
    "questions": [
            {
                "question": string,
                "answers": [string, string, string, string],
                "correctAnswer": index of the correct answer, try not to repeat the same numbers,
                "explanation": string
            },
            ...
        ]
    }
    `;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: {
            type: 'json_object',
        },
    })

    return JSON.parse(chatCompletion.choices[0].message.content);
}

const generateQuizFromFile = async (file, language) => {
    const allowedExtensions = [".docx", ".pptx", ".xlsx", ".odt", ".odp", ".ods", ".pdf"];
    const maxSize = 1 * 1024 * 1024; // 5MB

    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        throw new Error("Nesprávny typ súboru.");
    }

    if (file.size > maxSize) {
        console.log("error")
        throw new Error("Súbor je väčší ako 5MB.");
    }

    const text = await officeParser.parseOfficeAsync(file.buffer);

    const prompt = `
    Based on the following text, generate quiz:

    Text: ${text}

    Use ${language} language.

    Generate at least 10 questions.

    Please return the response as JSON object:
    {
    "title": string,
    "questions": [
            {
                "question": string,
                "answers": [string, string, string, string],
                "correctAnswer": index of the correct answer, try not to repeat the same numbers,
                "explanation": string
            },
            ...
        ]
    }
    `;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: {
            type: 'json_object',
        },
    })

    return JSON.parse(chatCompletion.choices[0].message.content);
}

const generateQuizFromImage = async (image, language) => {
    const allowedExtensions = [".jpeg", ".jpg", ".gif", ".png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const fileExt = path.extname(image.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        throw new Error("Nesprávny typ obrázka.");
    }

    if (image.size > maxSize) {
        throw new Error("Obrázok je väčší ako 5MB.");
    }

    const prompt = `
    Based on the attached image, generate quiz.

    Use ${language} language.

    Generate at least 10 questions.

    Please return the response as JSON object:
    {
    "title": string,
    "questions": [
            {
                "question": string,
                "answers": [string, string, string, string],
                "correctAnswer": index of the correct answer, try not to repeat the same numbers,
                "explanation": string
            },
            ...
        ]
    }
    `;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
                        }
                    },
                ]
            }
        ],
        response_format: {
            type: 'json_object',
        },
    })

    return JSON.parse(chatCompletion.choices[0].message.content);
}

export const generateQuiz = async (req, res) => {
    try {
        const { language = "Slovak" } = req.params;

        let quizContent;
        if (req.body.text) {
            quizContent = await generateQuizFromText(req.body.text, language);
        } else if (req.files.file) {
            quizContent = await generateQuizFromFile(req.files.file[0], language);
        } else if (req.files.image) {
            quizContent = await generateQuizFromImage(req.files.image[0], language);
        } else {
            return res.status(400).json({ message: "Nebol nahratý žiaden obsah." });
        }

        const quiz = await Quiz.create(quizContent);
        res.status(201).json({ id: quiz._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}