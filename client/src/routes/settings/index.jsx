import React, { useState, useEffect } from "react";
import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, ActionIcon, Text, Card, Modal, CloseButton, Center, Flex, Button } from "@mantine/core";
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
    const [title, setTitle] = useState("");
    const [error, setError] = useState({});
    const [count, setCount] = useState(0);
    const maxCharacterLenght = 160;
    
    let errors = {}
    let isError = false

    if (count == maxCharacterLenght) {
        isError = true
        errors.bio = `Bio môže mať maximálne ${maxCharacterLenght} znakov`
    }

    if (isError) {
        setError(errors)
    }

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

            <Box pos="relative"> {/* Make this later, the btn is not displaying properly */}
                <div style={{ position: "absolute" }}>
                    <Button onClick={coverImageModalHandlers.open}>Zmeniť</Button>
                </div>
                <AspectRatio ratio={1000 / 280}  >
                    <Image src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?w=600"/> {/* add src variable later */}
                </AspectRatio>
            </Box>

            <Flex align="center">
                <Avatar
                    m="sm"
                    size={100}
                    src={
                        <>
                            <IconCamera />
                            <Text>.......</Text>
                        </>
                    }
                />
                <Button onClick={coverImageModalHandlers.open}>Zmeniť</Button>
            </Flex>

            <Box px="sm" pb="sm" className="border-bottom">

                <TextInput mt="sm" label="Display name" value={user.displayName} />
                <TextInput mt="sm" label="Použivateľské meno" value={user.username} disabled />
                <Textarea
                    mt="sm"
                    label="Bio"
                    autosize
                    minRows={2}
                    value={title}
                    maxLength={maxCharacterLenght}
                    onChange={event => {
                        setTitle(event.target.value)
                        setCount(event.target.value.length)
                    }} 
                    // error={`Bio môže mať maximálne ${maxCharacterLenght} znakov`}
                    error={() => error.bio}
                    />
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
