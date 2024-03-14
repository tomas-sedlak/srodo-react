import { Button, Box, AspectRatio, Image as MantineImage, Flex, Card, Checkbox, TextInput, Group, Textarea, CloseButton } from "@mantine/core";
import ImagesModal from "templates/ImagesModal";
import { useEffect, useState } from "react";
import { createClient } from 'pexels';
import { useDisclosure } from "@mantine/hooks";
import PostTitle from "templates/PostTitle";
import { TitleInput, SubjectSelect, TextEditor } from "templates/CreatePostWidgets";
import { IconPlus, IconX } from "@tabler/icons-react";
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

    const handleRemoveOption = (questionIndex, optionIndex) => {
                const newQuestions = [...questions];
                newQuestions[questionIndex].options.splice(optionIndex, 1);
                setQuestions(newQuestions);
            };


    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />


            <Box className="border-bottom" p="sm" >
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
                    placeholder="Názov quizu"
                    title={title}
                    setTitle={setTitle}
                />
                <SubjectSelect
                    setSelectedSubject={setSelectedSubject}
                />
                {/* <Textarea
                    mt="sm"
                    autosize
                    placeholder="Description"
                    maxLength={descriptionMaxCharacterLenght}
                    onChange={event => {
                        setCount(event.target.value.length)
                    }}
                    onKeyDown={event => event.key === "Enter" && event.preventDefault()}
                /> */}
                <TextEditor
                    setText={setText}
                    placeholder="Description"

                />
            </Box>

            {questions.map((question, questionIndex) => (
                // <Card key={questionIndex} mt={questionIndex > 0 ? 'sm' : 0} withBorder mb="md" radius={0} >
                <Box key={questionIndex} mt={questionIndex > 0 ? 'sm' : 0} className="border-bottom" p="sm" >

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
                                rightSection={
                                    // Close btn to remove answer, add the same thing to the question as well
                                        <CloseButton
                                            variant="subtle"
                                            radius="lg"
                                            c="gray"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => handleRemoveOption(questionIndex, optionIndex)} 
                                        />}
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
                            variant="subtle"
                            c="black"
                            color="gray"
                            mt="sm"
                            onClick={handleAddQuestion}
                            leftSection={<IconX stroke={1.25} />}
                        >
                            Remove this question
                        </Button>
                    </Group>
                </Box>
                // </Card>
            ))}
            <Box p="sm" >
                <Button fullWidth >
                    Publish this quiz
                </Button>
            </Box>

        </>
    )

//     // import { Button, Box, AspectRatio, TextInput, Flex, CloseButton } from "@mantine/core";
// import { IconPlus, IconX } from "@tabler/icons-react";
// import { useState } from "react";

// export default function CreateQuiz() {
//     const [questions, setQuestions] = useState([{ question: '', options: [''] }]);

//     const handleQuestionChange = (index, value) => {
//         const newQuestions = [...questions];
//         newQuestions[index].question = value;
//         setQuestions(newQuestions);
//     };

//     const handleOptionChange = (questionIndex, optionIndex, value) => {
//         const newQuestions = [...questions];
//         newQuestions[questionIndex].options[optionIndex] = value;
//         setQuestions(newQuestions);
//     };

//     const handleAddOption = (index) => {
//         const newQuestions = [...questions];
//         newQuestions[index].options.push('');
//         setQuestions(newQuestions);
//     };

//     const handleAddQuestion = () => {
//         setQuestions([...questions, { question: '', options: [] }]);
//     };

//     const handleRemoveOption = (questionIndex, optionIndex) => {
//         const newQuestions = [...questions];
//         newQuestions[questionIndex].options.splice(optionIndex, 1);
//         setQuestions(newQuestions);
//     };

//     return (
//         <>
//             {questions.map((question, questionIndex) => (
//                 <Box key={questionIndex} mt={questionIndex > 0 ? 'sm' : 0} className="border-bottom" p="sm" >
//                     <TextInput
//                         fw="bold"
//                         placeholder="Ask a question"
//                         value={question.question}
//                         onChange={(event) => handleQuestionChange(questionIndex, event.target.value)}
//                     />

//                     {question.options.map((option, optionIndex) => (
//                         <Flex key={optionIndex} align="center" gap="sm" p="sm">
//                             <TextInput
//                                 placeholder="Add answer"
//                                 value={option}
//                                 onChange={(event) => handleOptionChange(questionIndex, optionIndex, event.target.value)}
//                                 rightSection={
//                                     <CloseButton
//                                         variant="subtle"
//                                         radius="lg"
//                                         c="gray"
//                                         onMouseDown={(event) => event.preventDefault()}
//                                         onClick={() => handleRemoveOption(questionIndex, optionIndex)} // Call handleRemoveOption
//                                     />
//                                 }
//                             />
//                         </Flex>
//                     ))}

//                     {/* Your JSX for adding/removing questions goes here */}
//                 </Box>
//             ))}

//             <Box p="sm">
//                 <Button fullWidth>
//                     Publish this quiz
//                 </Button>
//             </Box>
//         </>
//     );
// }


}