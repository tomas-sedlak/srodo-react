import { Progress, Radio, Text, Group, Button, Box, Stack } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";
import { useState } from "react";
import SmallHeader from "./SmallHeader";

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
            <SmallHeader withArrow title={data.title} />

            <Box mx="md" my="sm">
                <Group>
                    <Progress value={(currentQuestion + 1) / data.questions.length * 100} style={{ flex: 1 }} />
                    <Text c="dimmed">{currentQuestion + 1}/{data.questions.length}</Text>
                </Group>

                <Text mt="sm" mb="md" size="lg">{question.question}</Text> {/* Maybe change the margin later */}

                <Stack gap={8}>
                    {question.answers.map((answer, index) => {
                        let border
                        if (isAnswerSubmitted) {
                            if (index == correctAnswerIndex) {
                                border = "2px solid var(--mantine-color-green-9)"
                            }
                            if (selectedAnswer !== correctAnswerIndex && index === selectedAnswer) {
                                border = "2px solid var(--mantine-color-red-9)"
                            }
                        }

                        return (
                            <Group
                                px="sm"
                                py={8}
                                key={index}
                                onClick={isAnswerSubmitted ? null : () => handleChange(index)}
                                className="pointer border background-light"
                                style={{
                                    outline: border,
                                    borderRadius: 8,
                                }}
                            >
                                <Radio checked={selectedAnswer === index} />
                                <Text>{answer}</Text>
                            </Group>
                        )
                    })}
                </Stack>

                {isAnswerSubmitted ? (
                    <>
                        <Group
                            mt="sm"
                            px="sm"
                            py={8}
                            className="pointer border background-light"
                            style={{ borderRadius: 8 }}
                        >
                            <IconMessage stroke={1.25} />
                            <Text style={{ flex: 1 }}>{question.explanation}</Text>
                        </Group>
                        <Button mt="md" variant="filled" onClick={handleNextQuestion}>
                            Ďalej
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