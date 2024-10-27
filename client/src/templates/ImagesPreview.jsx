import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Image, Loader } from '@mantine/core';
import { Carousel } from 'react-responsive-carousel';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ImagesPreview() {
    const { postId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`)
        return post.data
    }

    const { data, status } = useQuery({
        queryFn: fetchPost,
        queryKey: ["images-preview", postId],
    })

    const renderArrowPrev = (clickHandler, hasPrev) => {
        if (hasPrev) return (
            <button onClick={clickHandler} className="carousel-arrow prev-arrow">
                <IconChevronLeft display="block" stroke={1.25} />
            </button>
        )
    };

    const renderArrowNext = (clickHandler, hasNext) => {
        if (hasNext) return (
            <button onClick={clickHandler} className="carousel-arrow next-arrow">
                <IconChevronRight display="block" stroke={1.25} />
            </button>
        );
    };

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <button
                onClick={() => navigate(-1)}
                className="carousel-arrow"
                style={{ position: "absolute", left: 16, top: 16 }}
            >
                <IconX display="block" stroke={1.25} />
            </button>

            <Carousel
                showArrows
                showStatus={false}
                showThumbs={false}
                showIndicators={false}
                useKeyboardArrows
                renderArrowNext={renderArrowNext}
                renderArrowPrev={renderArrowPrev}
                selectedItem={parseInt(searchParams.get("index")) || 0}
            >
                {data.images.map((image) => {
                    return (
                        <Image key={image._id} src={image.large} className="carousel-image" />
                    )
                })}
            </Carousel>
        </>
    );
};