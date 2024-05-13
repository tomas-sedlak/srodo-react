import { ActionIcon, AspectRatio, Box } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

export default function ImagesDisplay(props) {
    const { images, setImages } = props;

    return (
        <>
            {
                images.length === 4 &&
                <AspectRatio {...props} ratio={3 / 2}>
                    <Box style={{ display: "flex", width: "100%", height: "100%", borderRadius: "var(--mantine-radius-lg)" }} className="border">
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%", marginRight: 1 }}>
                            <CustomImage images={images} setImages={setImages} index={0} width="100%" height="50%" paddingBottom={1} inner={{ borderTopLeftRadius: "var(--mantine-radius-lg)" }} />
                            <CustomImage images={images} setImages={setImages} index={1} width="100%" height="50%" paddingTop={1} inner={{ borderBottomLeftRadius: "var(--mantine-radius-lg)" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%", marginLeft: 1 }}>
                            <CustomImage images={images} setImages={setImages} index={2} width="100%" height="50%" paddingBottom={1} inner={{ borderTopRightRadius: "var(--mantine-radius-lg)" }} />
                            <CustomImage images={images} setImages={setImages} index={3} width="100%" height="50%" paddingTop={1} inner={{ borderBottomRightRadius: "var(--mantine-radius-lg)" }} />
                        </div>
                    </Box>
                </AspectRatio>
            }

            {
                images.length === 3 &&
                <AspectRatio {...props} ratio={3 / 2}>
                    <Box style={{ display: "flex", width: "100%", height: "100%", borderRadius: "var(--mantine-radius-lg)" }} className="border">
                        <CustomImage images={images} setImages={setImages} index={0} width="50%" height="100%" paddingRight={1} inner={{ borderTopLeftRadius: "var(--mantine-radius-lg)", borderBottomLeftRadius: "var(--mantine-radius-lg)" }} />
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%", paddingLeft: 1 }}>
                            <CustomImage images={images} setImages={setImages} index={1} width="100%" height="50%" paddingBottom={1} inner={{ borderTopRightRadius: "var(--mantine-radius-lg)" }} />
                            <CustomImage images={images} setImages={setImages} index={2} width="100%" height="50%" paddingTop={1} inner={{ borderBottomRightRadius: "var(--mantine-radius-lg)" }} />
                        </div>
                    </Box>
                </AspectRatio>
            }

            {
                images.length === 2 &&
                <AspectRatio {...props} ratio={3 / 2}>
                    <Box style={{ display: "flex", width: "100%", height: "100%", borderRadius: "var(--mantine-radius-lg)" }} className="border">
                        <CustomImage images={images} setImages={setImages} index={0} width="50%" height="100%" paddingRight={1} inner={{ borderTopLeftRadius: "var(--mantine-radius-lg)", borderBottomLeftRadius: "var(--mantine-radius-lg)" }} />
                        <CustomImage images={images} setImages={setImages} index={1} width="50%" height="100%" paddingLeft={1} inner={{ borderTopRightRadius: "var(--mantine-radius-lg)", borderBottomRightRadius: "var(--mantine-radius-lg)" }} />
                    </Box>
                </AspectRatio>
            }

            {
                images.length === 1 &&
                <Box {...props} style={{ borderRadius: "var(--mantine-radius-lg)" }} className="border">
                    <CustomImage images={images} setImages={setImages} index={0} width="100%" height="100%" paddingRight={1} inner={{ borderRadius: "var(--mantine-radius-lg)" }} />
                </Box>
            }
        </>
    )
}

function CustomImage(props) {
    const { images, setImages, index } = props;

    return (
        <a key={index} href={!setImages && images[index].large} target="_blank" style={{ display: "block", position: "relative", borderRadius: "var(--mantine-radius-lg)", ...props }}>
            {setImages &&
                <ActionIcon
                variant="default"
                pos="absolute"
                    top={4}
                    right={4}
                    style={{ borderRadius: "var(--mantine-radius-xl)" }}
                    onClick={() => setImages(images => images.filter(a => a !== images[index]))}
                >
                    <IconX stroke={1.25} />
                </ActionIcon>
            }
            <img
                src={setImages ? URL.createObjectURL(images[index]) : images[index].thumbnail}
                style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", ...props.inner }}
            />
        </a>
    )
}