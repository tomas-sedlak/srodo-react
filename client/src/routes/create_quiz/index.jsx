import { Button, Box, AspectRatio, Image as MantineImage, Flex, Card, Checkbox, TextInput, Group, Textarea } from "@mantine/core";
import ImagesModal from "templates/ImagesModal";
import { useEffect, useState } from "react";
import { createClient } from 'pexels';
import { useDisclosure } from "@mantine/hooks";
import PostTitle from "templates/PostTitle";
import { TitleInput, SubjectSelect, TextEditor } from "templates/CreatePostWidgets";
import { IconPlus } from "@tabler/icons-react";
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
    const [selectedSubject, setSelectedSubject] = useState();
    const [title, setTitle] = useState("");


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


    const descriptionMaxCharacterLenght = 192;

    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />


            <Card>
                <Box pos="relative" pb="sm">
                    <AspectRatio ratio={2 / 1}>
                        <Box
                            className="lazy-image pointer"
                            style={{ backgroundImage: `url(${coverImage})` }}
                            onClick={coverImageModalHandlers.open}
                        ></Box>
                    </AspectRatio>
                </Box>
                <TitleInput
                    title={title}
                    setTitle={setTitle}
                />
                <SubjectSelect
                    setSelectedSubject={setSelectedSubject}
                />
                <Textarea
                    mt="sm"
                    autosize
                    placeholder="Description"
                    maxLength={descriptionMaxCharacterLenght}
                    onChange={event => {
                        setCount(event.target.value.length)
                    }}
                    onKeyDown={event => event.key === "Enter" && event.preventDefault()}
                />
            </Card>

            {questions.map((question, questionIndex) => (
                <Card key={questionIndex} mt={questionIndex > 0 ? 'sm' : 0} withBorder mb="md" radius={0} >

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
                    <Flex> {/* theres gotta be a better way of centering this */}
                        <Button
                            pr={70}
                            variant="subtle"
                            c="black"
                            color="gray"
                            onClick={() => handleAddOption(questionIndex)}
                            leftSection={<IconPlus stroke={1.25} />}
                            w="50%"
                        >
                            Add an answer
                        </Button>
                    </Flex>

                    <Group grow>
                        <Button
                            variant="subtle"
                            c="black"
                            color="gray"
                            mt="sm"
                            onClick={handleAddQuestion}
                            leftSection={<IconPlus stroke={1.25} />}
                        >
                            Add another question
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