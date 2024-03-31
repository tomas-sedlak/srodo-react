import { Button, Box, AspectRatio, Image as MantineImage, Flex, Card, Checkbox, TextInput, Group, Textarea, CloseButton, Badge, Tooltip, ActionIcon } from "@mantine/core";
import ImagesModal from "templates/ImagesModal";
import { useEffect, useState } from "react";
import { createClient } from 'pexels';
import { useDisclosure } from "@mantine/hooks";
import PostTitle from "templates/PostTitle";
import { TitleInput, SubjectSelect, TextEditor } from "templates/CreatePostWidgets";
import { IconCameraPlus, IconPlus, IconX } from "@tabler/icons-react";
import axios from "axios";



export default function CreateQuiz() {
    const client = createClient("prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1");

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    });


    const [coverImage, setCoverImage] = useState("");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);
    const [selectedSubject, setSelectedSubject] = useState();
    const [title, setTitle] = useState("");
    const descriptionMaxCharacterLenght = 192;
    const [text, setText] = useState("");
    const [searchValue, setSearchValue] = useState("");

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


    const handleRemoveQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        if (newQuestions.length === 1) return;
        newQuestions.splice(questionIndex, 1);
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.splice(optionIndex, 1);
        setQuestions(newQuestions);
    };

    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />

            <Box className="border-bottom" p="sm">
                <Box pos="relative">
                    <Badge fw={600} className="image-item-left">
                        Kvíz
                    </Badge>

                    <Tooltip label="Zmeniť obrázok" position="bottom">
                        <ActionIcon
                            className="image-item-right"
                            w={40}
                            h={40}
                            radius="xl"
                            onClick={coverImageModalHandlers.open}
                        >
                            <IconCameraPlus stroke={1.25} />
                        </ActionIcon>
                    </Tooltip>

                    <AspectRatio ratio={2 / 1}>
                        <Box
                            className="lazy-image pointer"
                            style={{ backgroundImage: `url(${coverImage})` }}
                            onClick={coverImageModalHandlers.open}
                        />
                    </AspectRatio>
                </Box>

                <TitleInput
                    placeholder="Názov kvízu..."
                    title={title}
                    setTitle={setTitle}
                />

                <SubjectSelect
                    setSelectedSubject={setSelectedSubject}
                />

                <TextEditor
                    setText={setText}
                    placeholder="Krátky popis kvízu..."
                />
            </Box>

            {questions.map((question, questionIndex) => (
                <Box key={questionIndex} mt={questionIndex > 0 ? 'sm' : 0} className="border-bottom" p="sm">
                    <TextInput
                        fw="bold"
                        placeholder="Pridať otázku"
                        value={question.question}
                        onChange={(event) => handleQuestionChange(questionIndex, event.target.value)}
                    />

                    {question.options.map((option, optionIndex) => (
                        <Flex key={optionIndex} align="center" gap="sm" p="sm">
                            <Checkbox />
                            <TextInput
                                style={{ width: '100%' }}
                                placeholder="Pridať odpoveď"
                                value={option}
                                onChange={(event) =>
                                    handleOptionChange(questionIndex, optionIndex, event.target.value)
                                }
                                rightSection={
                                    <CloseButton
                                        variant="subtle"
                                        radius="lg"
                                        c="gray"
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                    />
                                }
                            />
                        </Flex>
                    ))}

                    <Flex mt="sm" flexDirection="column" gap="sm"> {/* Changed to column */}
                        <Button
                            variant="subtle"
                            onClick={() => handleAddOption(questionIndex)}
                            leftSection={<IconPlus stroke={1.25} />}
                        >
                            Pridať odpoveď
                        </Button>
                        <Group>
                            <Button
                                variant="subtle"
                                onClick={handleAddQuestion}
                                leftSection={<IconPlus stroke={1.25} />}
                            >
                                Pridať otázku
                            </Button>
                            <Button
                                variant="subtle"
                                onClick={() => handleRemoveQuestion(questionIndex)}
                                leftSection={<IconX stroke={1.25} />}
                            >
                                Odstrániť túto otázku
                            </Button>
                        </Group>
                    </Flex>
                </Box>
            ))}

            <Box p="sm">
                <Button fullWidth>Publikovať</Button>
            </Box>
        </>
    )
}