import { useState } from "react";
import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, ActionIcon, Text, Card, Modal, Tooltip, Button, Flex, Center } from "@mantine/core";
import { IconPlus, IconBrandDiscord, IconBrandInstagram, IconBrandYoutube, IconBrandGithub, IconCameraPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";
import ImagesModal from "templates/ImagesModal";
import axios from "axios";
import SmallHeader from "templates/SmallHeader";

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
    const [displaynameCount, setDisplaynameCount] = useState(user.displayName.length);
    const [bioCount, setBioCount] = useState(user.bio.length);
    const maxBioCharacterLenght = 160;
    const maxDisplaynameCharacterLimit = 64;


    const [isPublishing, setIsPublishing] = useState(false);

    const handleSocialTagClick = (platform) => {
        setSelectedSocialPlatform(platform)
        setSocialModalOpened(false)
        setUsernameModalOpened(true)
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
            <ImagesModal
                opened={coverImageModalOpened}
                close={coverImageModalHandlers.close}
                setImage={setCoverImage}
                columns={2}
                aspectRatio={6 / 2}
                qkey="coverImage"
            />
            <ImagesModal
                opened={profilePictureModalOpened}
                close={profilePictureModalHandlers.close}
                setImage={setProfilePicture}
                columns={3}
                aspectRatio={1 / 1}
                qkey="profilePicture"
            />

            {/* Username modal */}
            <Center>
                <Modal opened={usernameModalOpened} onClose={() => setUsernameModalOpened(false)} title="Pridať sociálnu sieť">

                    <TextInput placeholder="Používateľské meno" />
                    <Flex justify="flex-end">
                        <Button mt="sm">Pridať</Button>
                    </Flex>

                </Modal>
            </Center>


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

            <SmallHeader title="⚙️ Nastavenia profilu" />

            <Box pos="relative">
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

                <AspectRatio ratio={6 / 2}  >
                    <Image src={coverImage} />
                </AspectRatio>
            </Box>

            <Flex align="center">
                <Avatar
                    m="sm"
                    size="xl"
                    src={profilePicture}
                />
                <Button onClick={profilePictureModalHandlers.open}>Zmeniť</Button>
            </Flex>

            <Box px="sm" pb="sm">
                <TextInput
                    mt="sm"
                    label="Display name"
                    value={displayName}
                    maxLength={maxDisplaynameCharacterLimit}
                    onChange={event => {
                        setdisplayName(event.currentTarget.value)
                        setDisplaynameCount(event.currentTarget.value.length)
                    }}
                />
                <Text c="dimmed" size="sm">{displaynameCount}/{maxDisplaynameCharacterLimit}</Text>
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
                    maxLength={maxBioCharacterLenght}
                    onChange={event => {
                        setBio(event.currentTarget.value)
                        setBioCount(event.currentTarget.value.length)
                    }}

                />
                <Text c="dimmed" size="sm">{bioCount}/{maxBioCharacterLenght}</Text>

                <Text size="sm" mt="sm">Sociálne siete</Text>
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
