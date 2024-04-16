import { useState } from "react";
import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, ActionIcon, Text, Modal, Tooltip, Button } from "@mantine/core";
import { IconPlus, IconCameraPlus, IconCircleX } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";
import ImagesModal from "templates/ImagesModal";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";

const allSocials = [
    {
        name: "YouTube",
        icon: "/socials/youtube.svg",
        url: "https://youtube.com/"
    },
    {
        name: "Instagram",
        icon: "/socials/instagram.svg",
        url: "https://instagram.com/"
    },
    {
        name: "Facebook",
        icon: "/socials/facebook.svg",
        url: "https://facebook.com/"
    },
    {
        name: "LinkedIn",
        icon: "/socials/linkedin.svg",
        url: "https://linkedin.com/"
    },
    {
        name: "Discord",
        icon: "/socials/discord.svg",
        url: "https://discord.com/"
    },
    {
        name: "Github",
        icon: "/socials/github.svg",
        url: "https://github.com/"
    },
    {
        name: "Twitter",
        icon: "/socials/twitter.svg",
        url: "https://twitter.com/"
    },
]

export default function Settings() {
    const maxDisplaynameCharacterLimit = 64;
    const maxBioCharacterLenght = 160;

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isPublishing, setIsPublishing] = useState(false);

    const [coverImage, setCoverImage] = useState(user.coverImage);
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [profilePictureModalOpened, profilePictureModalHandlers] = useDisclosure(false);

    const [displayName, setdisplayName] = useState(user.displayName);
    const [displaynameCount, setDisplaynameCount] = useState(user.displayName.length);
    const [bio, setBio] = useState(user.bio);
    const [bioCount, setBioCount] = useState(user.bio.length);
    const [socials, setSocials] = useState(user.socials);

    const [modalType, setModalType] = useState(null);
    const [selectedSocial, setSelectedSocial] = useState(null);
    const [socialDisplayText, setSocialDisplayText] = useState("");
    const [socialUrl, setSocialUrl] = useState("");
    const isSocialEmpty = socialDisplayText === "" && socialUrl === "";

    const validate = () => {
        if (socialDisplayText === "") return false
        if (socialUrl === "") return false
        return true
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const publish = async () => {
        setIsPublishing(true)

        const response = await axios.patch(
            `/api/user/${user._id}/update`,
            { coverImage, profilePicture, displayName, bio, socials },
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

            <Modal
                opened={modalType}
                onClose={() => {
                    setModalType(null)
                    setSocialDisplayText("")
                    setSocialUrl("")
                }}
                title={<Text fw={700} fz="lg">Pridať sociálnu sieť</Text>}
                radius={isMobile ? 0 : "lg"}
                fullScreen={isMobile}
                centered
            >
                {modalType === "select-platform" &&
                    <Group gap={4}>
                        {allSocials.map(social =>
                            <div
                                className="icon-wrapper"
                                onClick={() => {
                                    setSelectedSocial(social)
                                    setModalType("set-url")
                                }}
                            >
                                <img width={24} height={24} src={social.icon} />
                                <span>{social.name}</span>
                            </div>
                        )}
                    </Group>
                }

                {modalType === "set-url" &&
                    <>
                        <Group>
                            <div className="icon-wrapper" onClick={() => setModalType("select-platform")}>
                                <img width={24} height={24} src={selectedSocial.icon} />
                                <span>{selectedSocial.name}</span>
                            </div>
                        </Group>

                        <TextInput
                            mt="sm"
                            onChange={event => setSocialDisplayText(event.target.value)}
                            value={socialDisplayText}
                            placeholder="Používateľské meno"
                        />

                        <TextInput
                            mt="sm"
                            onChange={event => setSocialUrl(event.target.value)}
                            value={socialUrl}
                            placeholder="URL"
                        />

                        <Group justify="flex-end">
                            <Button
                                mt="md"
                                onClick={() => {
                                    setModalType(null)
                                    setSocials([...socials, {
                                        icon: selectedSocial.icon,
                                        name: socialDisplayText,
                                        url: socialUrl,
                                    }])
                                    setSocialDisplayText("")
                                    setSocialUrl("")
                                }}
                                disabled={!validate()}
                            >
                                Pridať
                            </Button>
                        </Group>
                    </>
                }
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

            <Box py="sm" px="md">
                <Group align="center" gap="xs">
                    <Avatar
                        size="xl"
                        src={profilePicture}
                    />

                    <Button onClick={profilePictureModalHandlers.open}>Zmeniť</Button>
                </Group>

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
                <Group mt={4}>
                    <Text c="dimmed" size="xs" style={{ flex: 1 }}>Použi aj smajlíkov 🥳🤪</Text>
                    <Text c="dimmed" size="xs">{displaynameCount}/{maxDisplaynameCharacterLimit}</Text>
                </Group>

                <TextInput
                    mt="sm"
                    label="Použivateľské meno"
                    value={user.username}
                    disabled
                />
                <Text mt={4} c="dimmed" size="xs">Použivateľské meno sa momentálne nedá zmeniť</Text>

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
                <Group mt={4}>
                    <Text c="dimmed" size="xs" style={{ flex: 1 }}>Tvoja krátka charakteristika</Text>
                    <Text c="dimmed" size="xs">{bioCount}/{maxBioCharacterLenght}</Text>
                </Group>

                <Text mt="sm" mb={4} size="sm" fw={600}>Sociálne siete</Text>
                <Group gap={4}>
                    {socials.map(social =>
                        <div
                            className="icon-wrapper"
                            onClick={() => {
                                setSelectedSocial(social)
                                setModalType("set-url")
                            }}
                        >
                            <img width={24} height={24} src={social.icon} />
                            <span>{social.name}</span>
                            <IconCircleX stroke={1.25} onClick={() => setSocials(socials.filter(a => a !== social))} />
                        </div>
                    )}

                    <div
                        className="icon-wrapper"
                        onClick={() => {
                            if (socials.length >= 5) return
                            setModalType("select-platform")
                        }}
                    >
                        <IconPlus stroke={1.25} />
                        <span>Pridať sociálnu sieť</span>
                    </div>
                </Group>
                <Text mt={4} c="dimmed" size="xs" style={{ flex: 1 }}>Môžeš mať maximálne 5 sociálnych sietí</Text>

                <Group justify="flex-end" mt="sm">
                    <Button onClick={publish} loading={isPublishing}>
                        Uložiť zmeny
                    </Button>
                </Group>
            </Box>

        </>
    );
}
