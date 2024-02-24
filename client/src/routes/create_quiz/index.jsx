import { Button, Box, AspectRatio, Image as MantineImage, Flex, Card, Checkbox, TextInput, Group } from "@mantine/core";
import ImagesModal from "templates/ImagesModal";
import { useEffect, useState } from "react";
import { createClient } from 'pexels';
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";



export default function CreateQuiz() {

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    });

    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');

    const [coverImage, setCoverImage] = useState("");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);


    const [questions, setQuestions] = useState([{ question: '', options: [] }]);

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
        setQuestions([...questions, { question: '', options: [] }]);
    };


    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />

            {questions.map((question, questionIndex) => (
                <Card key={questionIndex} mt={questionIndex > 0 ? 'sm' : 0} withBorder mb="md">
                    <Box pos="relative" pb="sm">
                        <AspectRatio ratio={2 / 1}>
                            <Box
                                className="lazy-image pointer"
                                style={{ backgroundImage: `url(${coverImage})` }}
                                onClick={coverImageModalHandlers.open}
                            ></Box>
                        </AspectRatio>
                    </Box>
                    <TextInput
                        fw="bold"
                        placeholder="Ask a question"
                        value={question.question}
                        onChange={(event) => handleQuestionChange(questionIndex, event.target.value)}
                    />

                    {question.options.map((option, optionIndex) => (
                        <Flex key={optionIndex} align="center" gap="sm" p="sm">
                            <Checkbox />
                            <TextInput
                                placeholder="Add answer"
                                value={option}
                                onChange={(event) =>
                                    handleOptionChange(questionIndex, optionIndex, event.target.value)
                                }
                            />
                        </Flex>
                    ))}

                    <Button
                        variant="subtle"
                        c="black"
                        color="gray"
                        onClick={() => handleAddOption(questionIndex)}
                    >
                        Add an answer
                    </Button>
                    <Group grow>
                        <Button
                            mt="sm"
                            onClick={handleAddQuestion}
                        >
                            Add another question
                        </Button>
                        <Button
                            mt="sm"
                            onClick={imageModalHandlers.open}
                        >
                            Add a picture
                        </Button>
                        <Button
                            mt="sm"
                        >
                            Publish this quiz
                        </Button>
                    </Group>

                </Card>
            ))}


        </>
    )

}