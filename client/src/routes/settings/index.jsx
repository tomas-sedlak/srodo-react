import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, ActionIcon, Text, Card } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { IconBrandDiscord, IconBrandYoutube } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { createClient } from 'pexels';
import axios from "axios";

export default function Settings() {
    const user = useSelector(state => state.user);
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');

    const [coverImage, setCoverImage] = useState("");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    }, []);

    return (

        <>

            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />

            <AspectRatio ratio={1000 / 280}>
                <Image src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?w=600" onClick={coverImageModalHandlers.open} />
            </AspectRatio>

            <Box px="sm" pb="sm" className="border-bottom">
                <div style={{ position: "relative" }}>
                    <Avatar
                        className="profile-picture"
                        size={100}
                        src={user.profilePicture}
                        onClick={coverImageModalHandlers.open}
                    />
                </div>                
                    <TextInput mt="sm" label="Display name" value={user.displayName} />
                    <TextInput mt="sm" label="Použivateľské meno" value={user.username} />
                    <Textarea mt="sm" label="Bio" />


                    <Text fw={600} size="sm" mt="sm"> {/* Remake of TextInput label lol */}
                        Tags
                    </Text>
                    <Card withBorder mt={4}>
                        <Group mt="sm" gap={8} >
                            <div className="icon-wrapper">
                                <IconBrandDiscord stroke={1.25} />
                                <span>username</span>
                            </div>

                            <div className="icon-wrapper">
                                <IconBrandYoutube stroke={1.25} />
                                <span>username</span>
                            </div>

                            <ActionIcon variant="subtle" c="gray" color="gray" size="md" radius="lg"> {/* note: Change the color for another gray later */}
                                <IconPlus />
                            </ActionIcon>

                        </Group>
                    </Card>
                


            </Box>
        </>
    )
}