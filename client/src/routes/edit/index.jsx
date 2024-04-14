import { useState } from "react";
import { Box, Group, Button, AspectRatio, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { Loader } from "@mantine/core";
import { SubjectSelect, TextEditor, TitleInput } from "templates/CreatePostWidgets";
import { useSelector } from "react-redux";
import ImagesModal from "templates/ImagesModal";
import axios from "axios"

export default function Edit() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const token = useSelector(state => state.token);

    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [coverImage, setCoverImage] = useState();
    const [title, setTitle] = useState();
    const [selectedSubject, setSelectedSubject] = useState();
    const [text, setText] = useState();
    const [error, setError] = useState();
    const [isPublishing, setIsPublishing] = useState(false);

    const fetchPost = async () => {
        const result = await axios.get(`/api/post/${postId}`)
        const data = result.data;

        setCoverImage(data.coverImage)
        setSelectedSubject(data.subject._id)
        setTitle(data.title)
        setText(data.content)

        return data
    }

    const { data, status } = useQuery({
        queryKey: ["editPost", postId],
        queryFn: fetchPost,
    })

    const publish = async () => {
        setIsPublishing(true)

        if (!title) {
            setError("Nadpis je povinný")
            return setIsPublishing(false)
        }

        if (!selectedSubject) {
            setError("Predmet je povinný")
            return setIsPublishing(false)
        }

        if (!text) {
            setError("Text je povinný")
            return setIsPublishing(false)
        }

        const data = {
            subject: selectedSubject,
            coverImage: coverImage,
            title: title,
            content: text,
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        }

        await axios.patch(`/api/post/${postId}/edit`, data, { headers })
        navigate("/")
    }

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />

            <Box px="md" py="sm">
                <Box pos="relative">
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
                    selectedSubject={selectedSubject}
                />

                <TextEditor
                    setText={setText}
                    content={data.content}
                    placeholder="Tu začni písať svoj článok..."
                />

                <Text c="red">{error}</Text>

                <Group gap="sm" mt="sm" justify="flex-end">
                    <Button onClick={publish} loading={isPublishing}>
                        Upraviť článok
                    </Button>
                </Group>
            </Box>
        </>
    )
}