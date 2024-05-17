import { forwardRef } from "react";
import { Group, Image, Text, Avatar, Stack, AspectRatio, Box, Tooltip } from '@mantine/core';
import { IconLock, IconWorld } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Suggestion = forwardRef(({ group }, ref) => {
    const groupUrl = `/skupiny/${group._id}`;
    const profilePictureSize = 96;

    const suggestionContent = (
        <Link to={groupUrl} key={group._id}>
            <AspectRatio ratio={4 / 1}>
                {group.coverImage ?
                    <Image className="no-image" src={group.coverImage} />
                    : <Box className="no-image"></Box>
                }
            </AspectRatio>

            <div style={{ position: "relative" }}>
                <Avatar
                    className="profile-picture"
                    size={profilePictureSize}
                    src={group.profilePicture?.large}
                />
            </div>

            <Stack px="md" pb="sm" gap={0} className="border-bottom">
                <Group h={profilePictureSize / 2} ml={profilePictureSize + 12}>
                    <Stack gap={2}>
                        <Text fw={700} size="lg" style={{ lineHeight: 1.2 }}>
                            {group.name}
                        </Text>
                        <Group gap={2}>
                            {group.isPrivate ?
                                <IconLock color="var(--mantine-color-dimmed)" width={16} height={16} stroke={1.25} />
                                : <IconWorld color="var(--mantine-color-dimmed)" width={16} height={16} stroke={1.25} />
                            }
                            <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>{group.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                        </Group>
                    </Stack>
                </Group>

                {group.description && <Text mt={8}>{group.description}</Text>}

                <Group mt={8}>
                    <Text c="dimmed">Členovia: <Text component="span" c="white" fw={700}>{group.members.length}</Text></Text>
                    {group.members.length > 3 &&
                        <Box className="members-preview">
                            {group.members.slice(-12).map(member =>
                                <Tooltip label={`@${member.username}`} openDelay={200} withArrow>
                                    <Link to={`/${member.username}`} key={member._id}>
                                        <Avatar
                                            className="no-image"
                                            src={member.profilePicture?.thumbnail}
                                            style={{ outline: "var(--mantine-color-body) solid 2px" }}
                                        />
                                    </Link>
                                </Tooltip>
                            )}
                        </Box>
                    }
                </Group>
            </Stack>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last group is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{suggestionContent}</div> : suggestionContent
})

export default Suggestion