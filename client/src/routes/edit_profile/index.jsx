import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { unstable_usePrompt as Prompt } from "react-router-dom";
import { Avatar, Box, TextInput, Textarea, AspectRatio, Image, Group, Text, Modal, Button } from "@mantine/core";
import { IconPlus, IconCircleX, IconCamera, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import ImagesModal from "templates/ImagesModal";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";

const socialsData = [
    {
        platform: "YouTube",
        icon: "/images/logos/youtube.svg",
    },
    {
        platform: "Instagram",
        icon: "/images/logos/instagram.svg",
    },
    {
        platform: "Facebook",
        icon: "/images/logos/facebook.svg",
    },
    {
        platform: "LinkedIn",
        icon: "/images/logos/linkedin.svg",
    },
    {
        platform: "Discord",
        icon: "/images/logos/discord.svg",
    },
    {
        platform: "Github",
        icon: "/images/logos/github.svg",
    },
    {
        platform: "Twitter",
        icon: "/images/logos/twitter.svg",
    },
];

const maxUsernameCharacterLimit = 32;
const maxDisplaynameCharacterLimit = 32;
const maxBioCharacterLenght = 160;

export default function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);;
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState("");

    const [coverImage, setCoverImage] = useState(user.coverImage || "");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture?.large || "");
    const [profilePictureModalOpened, profilePictureModalHandlers] = useDisclosure(false);

    const [displayName, setDisplayName] = useState(user.displayName || "");
    const [username, setUsername] = useState(user.username || "");
    const [bio, setBio] = useState(user.bio || "");
    const [socials, setSocials] = useState(user.socials || []);

    const [modalType, setModalType] = useState(null);
    const [selectedSocial, setSelectedSocial] = useState(null);
    const [selectedSocialIndex, setSelectedSocialIndex] = useState(null);

    const validate = () => {
        if (selectedSocial.displayText.length === 0) return false
        if (selectedSocial.url.length === 0) return false
        if (!/^(?:(https):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i.test(selectedSocial.url)) return false
        return true
    }

    const closeModal = () => {
        setModalType(null)
        setSelectedSocial({})
    }

    const handleDisplayTextChange = event => {
        setSelectedSocial({
            ...selectedSocial,
            displayText: event.target.value
        })
    }

    const handleUrlChange = event => {
        setSelectedSocial({
            ...selectedSocial,
            url: event.target.value
        })
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const publish = async () => {
        setIsPublishing(true)

        try {
            const formData = new FormData();
            user.coverImage != coverImage && formData.append("coverImage", coverImage);
            user.profilePicture?.large != profilePicture && formData.append("profilePicture", profilePicture);
            user.username != username && formData.append("username", username);
            user.displayName != displayName && formData.append("displayName", displayName);
            user.bio != bio && formData.append("bio", bio);
            user.socials != socials && formData.append("socials", JSON.stringify(socials));

            const response = await axios.patch(
                `/api/user/${user._id}/update`, formData, { headers },
            )

            dispatch(setUser({ user: response.data }))

            navigate(`/${username}`)

            notifications.show({
                title: "Zmeny boli uložené",
            });
        } catch (err) {
            setError(err.response.data.message);
        }

        setIsPublishing(false)
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const shouldShowConfirmation = true; // Flag to control confirmation message

            if (shouldShowConfirmation) {
                // event.returnValue = 'Are you sure you want to leave?';

                modals.openConfirmModal({
                    title: "Uložiť zmeny",
                    children: <Text>Určite chceš odísť z tejto stránky? Zmeny, ktoré si urobil sa nemusia uložiť.</Text>,
                    centered: true,
                    labels: { confirm: "Uložiť", cancel: "Zrušiť" },
                    confirmProps: { color: "red" },
                    onConfirm: publish,
                })
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {

            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    //         modals.openConfirmModal({
    //             title: "Uložiť zmeny",
    //             children: <Text>Určite chceš odísť z tejto stránky? Zmeny, ktoré si urobil sa nemusia uložiť.</Text>,
    //             centered: true,
    //             labels: { confirm: "Uložiť", cancel: "Zrušiť" },
    //             confirmProps: { color: "red" },
    //             onConfirm: publish,
    //         })


    return (
        <>
            <ImagesModal
                opened={coverImageModalOpened}
                close={coverImageModalHandlers.close}
                setImage={setCoverImage}
                columns={2}
                aspectRatio={6 / 2}
                qkey="settingsCoverImage"
            />

            <ImagesModal
                opened={profilePictureModalOpened}
                close={profilePictureModalHandlers.close}
                setImage={setProfilePicture}
                columns={3}
                aspectRatio={1 / 1}
                qkey="settingsProfilePicture"
            />

            <Modal
                opened={modalType}
                onClose={closeModal}
                title={<Text fw={700} fz="lg">Pridať sociálnu sieť</Text>}
                radius="lg"
                centered
            >
                {modalType === "select" &&
                    <Group style={{ rowGap: 8, columnGap: 4 }}>
                        {socialsData.map(social =>
                            <div
                                className="icon-wrapper"
                                onClick={() => {
                                    setSelectedSocial({
                                        ...social,
                                        displayText: "",
                                        url: "",
                                    })
                                    setModalType("set")
                                }}
                            >
                                <img width={24} height={24} src={social.icon} />
                                <span>{social.platform}</span>
                            </div>
                        )}
                    </Group>
                }

                {modalType === "set" &&
                    <form onSubmit={() => {
                        closeModal()
                        socials ? setSocials([...socials, selectedSocial]) : setSocials([...user.socials, selectedSocial])
                    }}>
                        <Group>
                            <div className="icon-wrapper">
                                <img width={24} height={24} src={selectedSocial.icon} />
                                <span>{selectedSocial.platform}</span>
                            </div>
                        </Group>

                        <TextInput
                            mt="sm"
                            onChange={handleDisplayTextChange}
                            value={selectedSocial.displayText}
                            placeholder="Používateľské meno"
                        />

                        <TextInput
                            mt="sm"
                            onChange={handleUrlChange}
                            value={selectedSocial.url}
                            placeholder="URL"
                        />

                        <Group justify="flex-end">
                            <Button
                                mt="md"
                                type="submit"
                                disabled={!validate()}
                            >
                                Pridať
                            </Button>
                        </Group>
                    </form>
                }

                {modalType === "update" &&
                    <form onSubmit={() => {
                        closeModal()
                        const newSocials = socials ? [...socials] : [...user.socials]
                        newSocials[selectedSocialIndex] = selectedSocial
                        setSocials(newSocials)
                    }}>
                        <Group>
                            <div className="icon-wrapper">
                                <img width={24} height={24} src={selectedSocial.icon} />
                                <span>{selectedSocial.platform}</span>
                            </div>
                        </Group>

                        <TextInput
                            mt="sm"
                            onChange={handleDisplayTextChange}
                            value={selectedSocial.displayText}
                            placeholder="Používateľské meno"
                        />

                        <TextInput
                            mt="sm"
                            onChange={handleUrlChange}
                            value={selectedSocial.url}
                            placeholder="URL"
                        />

                        <Group justify="flex-end">
                            <Button
                                mt="md"
                                type="submit"
                                disabled={!validate()}
                            >
                                Uložiť
                            </Button>
                        </Group>
                    </form>
                }
            </Modal>

            {/* Your component content */}
            {/* <Modal open={isModalOpen} onClose={handleCloseModal}>
                <p>You are about to leave the page. Are you sure?</p>
                <Button onClick={handleCloseModal}>Stay</Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Leave</Button>
            </Modal> */}
            <>
                {/* {if (isLeaving) {event => {
                    modals.openConfirmModal({
                        title: "Uložiť zmeny",
                        children: <Text>Určite chceš odísť z tejto stránky? Zmeny, ktoré si urobil sa nemusia uložiť.</Text>,
                        centered: true,
                        labels: { confirm: "Uložiť", cancel: "Zrušiť" },
                        confirmProps: { color: "red" },
                        onConfirm: publish,
                    })
                }}} */}
            </>

            <SmallHeader withArrow title="Upraviť profil" />

            <Box pos="relative">
                <Group gap={8} className="bottom-right">
                    {coverImage &&
                        <Button
                            variant="default"
                            leftSection={<IconTrash stroke={1.25} />}
                            styles={{ section: { marginRight: 4 } }}
                            onClick={() => setCoverImage("")}
                            c="red"
                        >
                            Zmazať
                        </Button>
                    }

                    <Button
                        variant="default"
                        leftSection={<IconCamera stroke={1.25} />}
                        styles={{ section: { marginRight: 4 } }}
                        onClick={coverImageModalHandlers.open}
                    >
                        Pridať
                    </Button>
                </Group>

                <AspectRatio ratio={6 / 2}  >
                    {coverImage ?
                        <Image className="no-image" src={typeof coverImage === "string" ? coverImage : URL.createObjectURL(coverImage)} />
                        : <Box className="no-image"></Box>
                    }
                </AspectRatio>
            </Box>

            <Box py="sm" px="md">
                <Group align="center" gap="xs">
                    <Avatar
                        size="xl"
                        className="no-image"
                        src={typeof profilePicture === "string" ? profilePicture : URL.createObjectURL(profilePicture)}
                    />

                    <Button
                        variant="default"
                        leftSection={<IconCamera stroke={1.25} />}
                        styles={{ section: { marginRight: 4 } }}
                        onClick={profilePictureModalHandlers.open}
                    >
                        Zmeniť
                    </Button>

                    {profilePicture &&
                        <Button
                            variant="default"
                            leftSection={<IconTrash stroke={1.25} />}
                            styles={{ section: { marginRight: 4 } }}
                            onClick={() => setProfilePicture("")}
                            c="red"
                        >
                            Zmazať
                        </Button>
                    }
                </Group>

                <Box pos="relative">
                    <TextInput
                        mt="sm"
                        label="Display name"
                        description="Použi aj smajlíkov 🥳🤪"
                        styles={{ input: { paddingRight: 46 } }}
                        value={displayName}
                        maxLength={maxDisplaynameCharacterLimit}
                        onChange={event => {
                            setDisplayName(event.currentTarget.value)
                        }}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                        className="input-counter"
                    >
                        {displayName.length}/{maxDisplaynameCharacterLimit}
                    </Text>
                </Box>

                <Box pos="relative">
                    <TextInput
                        mt="sm"
                        label="Použivateľské meno"
                        styles={{ input: { paddingRight: 46 } }}
                        maxLength={maxUsernameCharacterLimit}
                        value={username}
                        onChange={event => {
                            setUsername(event.currentTarget.value)
                        }}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                        className="input-counter"
                    >
                        {username.length}/{maxUsernameCharacterLimit}
                    </Text>
                </Box>

                <Box pos="relative">
                    <Textarea
                        mt="sm"
                        label="Bio"
                        description="Tvoja krátka charakteristika"
                        styles={{ input: { paddingRight: 46 } }}
                        autosize
                        minRows={2}
                        value={bio}
                        maxLength={maxBioCharacterLenght}
                        onChange={event => {
                            setBio(event.currentTarget.value)
                        }}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                        className="input-counter"
                    >
                        {bio.length}/{maxBioCharacterLenght}
                    </Text>
                </Box>

                <Text mt="sm" size="sm" fw={500} style={{ lineHeight: 1.55 }}>Sociálne siete</Text>
                <Text c="dimmed" size="xs" style={{ flex: 1 }}>Môžeš mať maximálne 5 sociálnych sietí</Text>
                <Group mt={5} style={{ rowGap: 8, columnGap: 4 }}>
                    {socials.map((social, index) =>
                        <div
                            className="icon-wrapper"
                            onClick={() => {
                                setSelectedSocial(social)
                                setSelectedSocialIndex(index)
                                setModalType("update")
                            }}
                        >
                            <img width={24} height={24} src={social.icon} />
                            <span>{social.displayText}</span>
                            <IconCircleX
                                stroke={1.25}
                                onClick={event => {
                                    event.stopPropagation() // So the update onClick function won't get triggered
                                    setSocials(socials.filter(a => a !== social))
                                }}
                            />
                        </div>
                    )}

                    {socials.length < 5 &&
                        < div
                            className="icon-wrapper"
                            onClick={() => setModalType("select")}
                        >
                            <IconPlus stroke={1.25} />
                            <span>Pridať sociálnu sieť</span>
                        </div>
                    }
                </Group>

                {error && <Text mt="sm" c="red">{error}</Text>}

                <Group justify="flex-end" mt="sm">
                    <Button onClick={publish} loading={isPublishing}>
                        Uložiť zmeny
                    </Button>
                </Group>
            </Box >
        </>
    );
}
