import { useState } from "react";
import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, ActionIcon, Text, Card, Modal, Tooltip, Button, Flex } from "@mantine/core";
import { IconPlus, IconBrandDiscord, IconBrandInstagram, IconBrandYoutube, IconBrandGithub, IconCameraPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";
import ImagesModal from "templates/ImagesModal";
import axios from "axios";

export default function Settings() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const [coverImage, setCoverImage] = useState(user.coverImage);
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [profilePictureModalOpened, profilePictureModalHandlers] = useDisclosure(false);

    const [displayName, setdisplayName] = useState(user.displayName);
    const [bio, setBio] = useState(user.bio);

    const [socialModalOpened, setSocialModalOpened] = useState(false);
    const [usernameModalOpened, setUsernameModalOpened] = useState(false);
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState(null);
    const [count, setCount] = useState(0);
    const maxCharacterLenght = 160;

    const [isPublishing, setIsPublishing] = useState(false);

    const handleSocialTagClick = (platform) => {
        setSelectedSocialPlatform(platform);
        setSocialModalOpened(false);
        setUsernameModalOpened(true);
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const publish = async () => {
        setIsPublishing(true)

        const response = await axios.patch(
            `/api/user/${user._id}/update`,
            { coverImage, profilePicture, displayName, bio },
            { headers },
        )

        dispatch(
            setUser({
                user: response.data,
            })
        )

        setIsPublishing(false)
    }

    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={profilePictureModalOpened} close={profilePictureModalHandlers.close} setImage={setProfilePicture} />

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
                <Tooltip label="Zmeniť obrázok" position="bottom">
                    <ActionIcon
                        className="image-item-right"
                        color="rgba(0, 0, 0, 0.4)"
                        c="white"
                        w={40}
                        h={40}
                        radius="xl"
                        onClick={coverImageModalHandlers.open}
                    >
                        <IconCameraPlus stroke={1.25} />
                    </ActionIcon>
                </Tooltip>

                <AspectRatio ratio={6 / 2}  >
                    <Image src={coverImage} />
                </AspectRatio>
            </Box>

            <Flex align="center">
                <Avatar
                    m="sm"
                    size={100}
                    src={profilePicture}
                />
                <Button onClick={profilePictureModalHandlers.open}>Zmeniť</Button>
            </Flex>

            <Box px="sm" pb="sm" className="border-bottom">

                <TextInput
                    mt="sm"
                    label="Display name"
                    value={displayName}
                    onChange={event => setdisplayName(event.currentTarget.value)}
                />

                <TextInput
                    mt="sm"
                    label="Použivateľské meno"
                    value={user.username}
                    disabled
                />

                <Textarea
                    mt="sm"
                    label="Bio"
                    autosize
                    minRows={2}
                    value={bio}
                    maxLength={maxCharacterLenght}
                    onChange={event => {
                        setBio(event.currentTarget.value)
                        setCount(event.currentTarget.value.length)
                    }}

                />

                <Text size="sm" mt="sm">Tags</Text>
                <Group mt={8} gap={8}>
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

                <Group justify="flex-end" mt="sm">
                    <Button onClick={publish} loading={isPublishing}>
                        Uložiť zmeny
                    </Button>
                </Group>
            </Box>

        </>
    );
}
