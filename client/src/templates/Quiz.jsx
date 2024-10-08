import { Progress, Radio, Text, Group, Button, Box } from "@mantine/core";
import { useState } from "react";

export default function Quiz({ data }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

    const handleChange = (value) => {
        setSelectedAnswer(value);
    };

    const handleSubmit = () => {
        setIsAnswerSubmitted(true);
        setCorrectAnswerIndex(data.questions[currentQuestion].correctAnswer);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < data.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null); // Reset selected answer for the next question
            setIsAnswerSubmitted(false); // Reset answer submission state
            setCorrectAnswerIndex(null); // Reset correct answer index
        }
    };

    const question = data.questions[currentQuestion];

    return (
        <>
            <Box m="md">
                <Group>
                    <Progress value={(currentQuestion + 1) / data.questions.length * 100} style={{ flex: 1 }} />
                    <Text>{currentQuestion + 1}/{data.questions.length}</Text>
                </Group>


                <Text mt="lg" mb="md">{question.question}</Text> {/* Maybe change the margin later */}
                {question.answers.map((answer, index) => {
                    let border
                    if (isAnswerSubmitted) {
                        if (index == correctAnswerIndex) {
                            border = "2px solid var(--mantine-color-green-5)"
                        }
                        if (selectedAnswer !== correctAnswerIndex && index === selectedAnswer) {
                            border = "2px solid var(--mantine-color-red-5)"
                        }
                    }

                    return (
                        <Group
                            key={index}
                            p="sm"
                            mb={4}
                            onClick={isAnswerSubmitted ? null : () => handleChange(index)}
                            className="pointer border"
                            style={{
                                outline: border,
                                borderRadius: 8,
                            }}
                        >
                            <Radio
                                label={answer}
                                checked={selectedAnswer === index}
                            />
                        </Group>
                    )
                })}
                {isAnswerSubmitted ? (

                    <>
                        <Group mt="md" p="sm" gap={6}>
                            <Text fw={600}>Vysvetlenie:</Text>
                            <Text >{question.explanation}</Text>
                        </Group>
                        <Button variant="filled" p="sm" onClick={handleNextQuestion} mt="lg">
                            Next
                        </Button>
                    </>
                ) : (
                    <Button variant="filled" mt="md" disabled={selectedAnswer === null} onClick={handleSubmit}>
                        Skontroluj
                    </Button>
                )}
            </Box>
        </>
    );
}