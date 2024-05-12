import { AspectRatio, Box } from "@mantine/core";

export default function ImagesDisplay(props) {
    const { images } = props;

    return (
        <>
            {
                images.length === 4 &&
                <AspectRatio {...props} ratio={3 / 2}>
                    <Box style={{ display: "flex", width: "100%", height: "100%", borderRadius: "var(--mantine-radius-lg)" }} className="border">
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%", marginRight: 1 }}>
                            <a href={images[0].large} target="_blank" style={{ width: "100%", height: "50%", marginBottom: 1 }}>
                                <img
                                    key={images[0].thumbnail}
                                    src={images[0].thumbnail}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderTopLeftRadius: "var(--mantine-radius-lg)" }}
                                />
                            </a>
                            <a href={images[1].large} target="_blank" style={{ width: "100%", height: "50%", marginTop: 1 }}>
                                <img
                                    key={images[1].thumbnail}
                                    src={images[1].thumbnail}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderBottomLeftRadius: "var(--mantine-radius-lg)" }}
                                />
                            </a>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%", marginLeft: 1 }}>
                            <a href={images[2].large} target="_blank" style={{ width: "100%", height: "50%", marginBottom: 1 }}>
                                <img
                                    key={images[2].thumbnail}
                                    src={images[2].thumbnail}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderTopRightRadius: "var(--mantine-radius-lg)" }}
                                />
                            </a>
                            <a href={images[3].large} target="_blank" style={{ width: "100%", height: "50%", marginTop: 1 }}>
                                <img
                                    key={images[3].thumbnail}
                                    src={images[3].thumbnail}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderBottomRightRadius: "var(--mantine-radius-lg)" }}
                                />
                            </a>
                        </div>
                    </Box>
                </AspectRatio>
            }

            {
                images.length === 3 &&
                <AspectRatio {...props} ratio={3 / 2}>
                    <Box style={{ display: "flex", width: "100%", height: "100%", borderRadius: "var(--mantine-radius-lg)" }} className="border">
                        <a href={images[0].large} target="_blank" style={{ width: "50%", height: "100%", paddingRight: 1 }}>
                            <img
                                key={images[0].thumbnail}
                                src={images[0].thumbnail}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderTopLeftRadius: "var(--mantine-radius-lg)", borderBottomLeftRadius: "var(--mantine-radius-lg)" }}
                            />
                        </a>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%", paddingLeft: 1 }}>
                            <a href={images[1].large} target="_blank" style={{ width: "100%", height: "50%", paddingBottom: 1 }}>
                                <img
                                    key={images[1].thumbnail}
                                    src={images[1].thumbnail}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderTopRightRadius: "var(--mantine-radius-lg)" }}
                                />
                            </a>
                            <a href={images[2].large} target="_blank" style={{ width: "100%", height: "50%", paddingTop: 1 }}>
                                <img
                                    key={images[2].thumbnail}
                                    src={images[2].thumbnail}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderBottomRightRadius: "var(--mantine-radius-lg)" }}
                                />
                            </a>
                        </div>
                    </Box>
                </AspectRatio>
            }

            {
                images.length === 2 &&
                <AspectRatio {...props} ratio={3 / 2}>
                    <Box style={{ display: "flex", width: "100%", height: "100%", borderRadius: "var(--mantine-radius-lg)" }} className="border">
                        <a href={images[0].large} target="_blank" style={{ width: "50%", height: "100%", paddingRight: 1 }}>
                            <img
                                key={images[0].thumbnail}
                                src={images[0].thumbnail}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderTopLeftRadius: "var(--mantine-radius-lg)", borderBottomLeftRadius: "var(--mantine-radius-lg)" }}
                            />
                        </a>
                        <a href={images[1].large} target="_blank" style={{ width: "50%", height: "100%", paddingLeft: 1 }}>
                            <img
                                key={images[1].thumbnail}
                                src={images[1].thumbnail}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderTopRightRadius: "var(--mantine-radius-lg)", borderBottomRightRadius: "var(--mantine-radius-lg)" }}
                            />
                        </a>
                    </Box>
                </AspectRatio>
            }

            {
                images.length === 1 &&
                <Box {...props} style={{ borderRadius: "var(--mantine-radius-lg)" }} className="border">
                    <a href={images[0].large} target="_blank">
                        <img
                            key={images[0].thumbnail}
                            src={images[0].thumbnail}
                            style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", borderRadius: "var(--mantine-radius-lg)" }}
                        />
                    </a>
                </Box>
            }
        </>
    )
}