import { Progress, Radio, Text, Group, Button, Box } from "@mantine/core";
import { useState } from "react";

const data = [
    {
        question: "Do you know the first question?",
        answers: [
            { answer: "First answer" },
            { answer: "Second answer" },
            { answer: "Third answer" },
            { answer: "Fourth answer" },
        ],
        correctAnswer: 2,
    },
    {
        question: "Do you know the first question?",
        answers: [
            { answer: "First answer" },
            { answer: "Second answer" },
            { answer: "Third answer" },
            { answer: "Fourth answer" },
        ],
        correctAnswer: 2,
    },
];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

    const handleChange = (value) => {
        setSelectedAnswer(value);
    };

    const handleSubmit = () => {
        setIsAnswerSubmitted(true);
        setCorrectAnswerIndex(data[currentQuestion].correctAnswer);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < data.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null); // Reset selected answer for the next question
            setIsAnswerSubmitted(false); // Reset answer submission state
            setCorrectAnswerIndex(null); // Reset correct answer index
        }
    };

    const question = data[currentQuestion];

    return (
        <>
            <Box m="sm">
                <Group>
                    <Progress value={(currentQuestion + 1) / data.length * 100} mt="lg" />
                    <Text>{}</Text>

                </Group>
                <Text mt="lg" mb="sm">{question.question}</Text> {/* Maybe change the margin later */}
                {question.answers.map((answer, index) => {
                    let border
                    if (isAnswerSubmitted) {
                        if (index == correctAnswerIndex) {
                            border = "2px solid green"
                        }
                        if (selectedAnswer !== correctAnswerIndex && index === selectedAnswer) {
                            border = "2px solid red"
                        }
                    }

                    return (
                        <Group
                            key={index}
                            p="sm"
                            mb="sm"
                            onClick={() => handleChange(index)}
                            className="pointer border"
                            style={{
                                // border: isAnswerSubmitted ? (
                                //     index == correctAnswerIndex
                                //         ? "2px solid green"
                                //         : isIncorrectAnswer && index === selectedAnswer
                                //             ? "2px solid red"
                                //             : "1px solid #424242"
                                // ) : "1px solid #424242",
                                outline: border,
                                borderRadius: 8,
                            }}
                        >
                            <Radio
                                label={answer.answer}
                                checked={selectedAnswer === index}
                            />
                        </Group>
                    )
                })}
                {isAnswerSubmitted ? (
                    <Button variant="filled" p="sm" onClick={handleNextQuestion}>
                        Next
                    </Button>
                ) : (
                    <Button variant="filled" p="sm" disabled={selectedAnswer === null} onClick={handleSubmit}>
                        Skontroluj
                    </Button>
                )}
            </Box>
        </>
    );
}