import { useState } from "react";
import { Button, Box, Flex, TextInput, Group, ActionIcon, Radio } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function QuizDisplay(props) {
    const [questions, setQuestions] = useState([{ question: '', options: ["", ""] }]);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleAddOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options.push('');
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ["", ""] }]);

    };

    const handleRemoveQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        if (newQuestions.length === 1) return;
        newQuestions.splice(questionIndex, 1);
        setQuestions(newQuestions);
    };

    // const handleRemoveOption = (questionIndex, optionIndex) => {
    //     const newQuestions = [...questions];
    //     newQuestions[questionIndex].options.splice(optionIndex, 1);
    //     setQuestions(newQuestions);
    // };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        const question = newQuestions[questionIndex];

        // Check if there are more than two options before removing
        if (question.options.length > 2) {
            question.options.splice(optionIndex, 1);
            setQuestions(newQuestions);
        }
    };

    return (
        <Box {...props}>
            {questions.map((question, questionIndex) => (
                <Box key={questionIndex} mt={questionIndex > 0 ? "sm" : 0}>
                    <Group gap={8} mb="sm">
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="Napíš otázku"
                            value={question.question}
                            onChange={(event) => handleQuestionChange(questionIndex, event.target.value)}
                        />
                    </Group>

                    <Radio.Group>
                        {question.options.map((option, optionIndex) => (
                            <Group gap={0} mt={optionIndex > 0 ? 8 : 0}>
                                <Radio mr="sm" value={`${optionIndex}`} />
                                <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="Pridať odpoveď"
                                    value={option}
                                    onChange={(event) =>
                                        handleOptionChange(questionIndex, optionIndex, event.target.value)
                                    }
                                />
                                <ActionIcon
                                    ml={4}
                                    variant="subtle"
                                    radius="xl"
                                    size="lg"
                                    c="dimmed"
                                    color="gray"
                                    onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                >
                                    <IconTrash stroke={1.25} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Radio.Group>

                    <Button
                        mt="sm"
                        justify="flex-start"
                        variant="default"
                        onClick={() => handleAddOption(questionIndex)}
                        leftSection={<IconPlus stroke={1.25} />}
                    >
                        Pridať odpoveď
                    </Button>
                </Box>
            ))
            }
        </Box>
    )
}