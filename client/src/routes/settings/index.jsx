import React, { useState, useEffect } from "react";
import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, ActionIcon, Text, Card, Modal, CloseButton, Center, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { IconBrandDiscord, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconCamera, IconPhoto } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { createClient } from 'pexels';
import axios from "axios";
import { IconBrandGithub } from "@tabler/icons-react";

export default function Settings() {
    const user = useSelector(state => state.user);
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');

    const [coverImage, setCoverImage] = useState("");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);
    const [socialModalOpened, setSocialModalOpened] = useState(false);
    const [usernameModalOpened, setUsernameModalOpened] = useState(false);
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState(null);

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    }, []);


    const handleSocialTagClick = (platform) => {
        setSelectedSocialPlatform(platform);
        setSocialModalOpened(false);
        setUsernameModalOpened(true);
    };

    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />

            {/* Username modal */}
            <Modal opened={usernameModalOpened} onClose={() => setUsernameModalOpened(false)} title="Pridať sociálnu sieť">
                <TextInput placeholder={`Enter your ${selectedSocialPlatform} username`} />
            </Modal>

            {/* Social modal */}
            <Modal opened={socialModalOpened} onClose={() => setSocialModalOpened(false)} title="Pridať sociálnu sieť">
                <Group>
                    <div className="icon-wrapper" onClick={() => handleSocialTagClick("Discord")}>
                        <IconBrandDiscord stroke={1.25} />
                        <span>Discord</span>
                    </div>
                    <div className="icon-wrapper" onClick={() => handleSocialTagClick("Youtube")}>
                        <IconBrandYoutube stroke={1.25} />
                        <span>Youtube</span>
                    </div>
                    <div className="icon-wrapper" onClick={() => handleSocialTagClick("Github")}>
                        <IconBrandGithub stroke={1.25} />
                        <span>Github</span>
                    </div>
                    <div className="icon-wrapper" onClick={() => handleSocialTagClick("Instagram")}>
                        <IconBrandInstagram stroke={1.25} />
                        <span>Instagram</span>
                    </div>
                    {/* More socials here */}
                </Group>

            </Modal>
            <Flex mt="sm" p="sm" gap="sm">
                {/* <AspectRatio ratio={1000 / 280}> */}
                {/* <Image src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?w=600" onClick={coverImageModalHandlers.open} /> */}
                {/* </AspectRatio> */}
                {/* <Avatar
                    m="sm"
                    size={100}
                    src={
                        <>
                            <IconCamera />
                            <Text>.......</Text>
                        </>
                    }
                    onClick={coverImageModalHandlers.open}
                /> */}
                <Box
                    onClick={coverImageModalHandlers.open}
                    bg="gray.3"
                    p="md"
                    style={{ borderRadius: 12, borderStyle: "dashed", borderColor: "gray", cursor: "pointer", aspectRatio: 3 / 2 }}
                    w="30%">

                    <Center mt="sm"> {/* This isn't exactly in the center but I think it looks ok */}
                        <IconCamera stroke={1.25} />
                    </Center>
                    <Center>
                        <Text>.......</Text>
                    </Center>
                </Box>
                <Box
                    onClick={coverImageModalHandlers.open}
                    bg="gray.3"
                    p="md"
                    style={{ borderRadius: 12, borderStyle: "dashed", borderColor: "gray", cursor: "pointer" }}
                    w="70%">

                    <Center mt="sm">
                        <IconPhoto stroke={1.25} />
                    </Center>
                    <Center>
                        <Text>.......</Text>
                    </Center>
                </Box>
            </Flex>






            <Box px="sm" pb="sm" className="border-bottom">

                <TextInput mt="sm" label="Display name" value={user.displayName} />
                <TextInput mt="sm" label="Použivateľské meno" value={user.username} />
                <Textarea mt="sm" label="Bio" autosize minRows={2} />
                <Text fw={600} size="sm" mt="sm">
                    Tags
                </Text>
                <Card withBorder mt={4}>
                    <Group mt="sm" gap={8}>
                        <div className="icon-wrapper" >
                            <IconBrandDiscord stroke={1.25} />
                            <span>username</span>
                        </div>
                        <div className="icon-wrapper">
                            <IconBrandYoutube stroke={1.25} />
                            <span>username</span>
                        </div>
                        <ActionIcon variant="subtle" c="gray" color="gray" size="md" radius="lg" onClick={() => setSocialModalOpened(true)}>
                            <IconPlus />
                        </ActionIcon>
                    </Group>
                </Card>
            </Box>

        </>
    );
}
