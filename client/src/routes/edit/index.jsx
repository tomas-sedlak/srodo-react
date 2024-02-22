import { useState } from "react";
import { Box, Group, Button, AspectRatio } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { Loader } from "@mantine/core";
import { SubjectSelect, TextEditor, TitleInput } from "templates/CreatePostWidgets";
import axios from "axios"

export default function Edit() {
    const { postId } = useParams();
    const [coverImage, setCoverImage] = useState("");
    const [title, setTitle] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [text, setText] = useState("");

    const fetchPost = async () => {
        const result = await axios.get(`/api/post/${postId}`)
        return result.data
    }

    const { data, status } = useQuery({
        queryKey: ["editPost"],
        queryFn: fetchPost,
    })

    return status === "pending" ? (
        <div className="loader-center-x">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <Box p="sm">
            <Box pos="relative">
                <AspectRatio ratio={2 / 1}>
                    <Box
                        className="lazy-image pointer"
                        style={{ backgroundImage: `url(${coverImage ? coverImage : data.coverImage})` }}
                    ></Box>
                </AspectRatio>
            </Box>

            <TitleInput
                title={title ? title : data.title}
                setTitle={setTitle}
            />

            <SubjectSelect
                setSelectedSubject={setSelectedSubject}
                selectedSubject={selectedSubject ? selectedSubject : data.subject._id}
            />

            <TextEditor
                setText={setText}
                content={data.content}
                placeholder="Tu začni písať svoj článok..."
            />

            <Group gap="sm" mt="sm" justify="flex-end">
                <Button>
                    Upraviť článok
                </Button>
            </Group>
        </Box>
    )
}