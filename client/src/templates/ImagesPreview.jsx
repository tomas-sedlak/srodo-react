import React, { useState } from 'react';
import { ActionIcon, Button, Center, Image } from '@mantine/core';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

export default function ImagesPreview() {

    const data = [{
        url: "https://srodo.s3.eu-north-1.amazonaws.com/b7a9ed65fd8e979ca20e62b4f7e0ebc06eadb211e647b40423ebf948a44ee00a"
    },
    {
        url: "https://srodo.s3.eu-north-1.amazonaws.com/b7a9ed65fd8e979ca20e62b4f7e0ebc06eadb211e647b40423ebf948a44ee00a"
    }];

    const renderArrowPrev = (clickHandler, hasPrev) => {
        return (
            <button onClick={clickHandler} disabled={hasPrev ? (false) : (true)} className="carousel-arrow prev-arrow">
                <IconChevronLeft stroke={1.25} />
            </button>
        );
    };

    const renderArrowNext = (clickHandler, hasNext) => {
        return (
            <button onClick={clickHandler} disabled={hasNext ? (false) : (true)} className="carousel-arrow next-arrow"> {/* disable prop needs a better fix */}
                <IconChevronRight stroke={1.25} />
            </button>
        );
    };

    return (
        <div style={{ position: 'relative' }}>
            <Center h="100vh">
                <ActionIcon 
                    variant='subtle'
                    size='lg'
                    mt='sm'
                    color='--mantine-color-gray-0'
                    radius='lg'
                    style={{ position: 'absolute', left: 20, top: 0, zIndex: 999 }}>
                        {/* There are issues with the left - arrow has 20px as well but the button is not in the smae position */}
                        {/* IMPORTANT - NEEDS ONCLICK FUNCTION TO CLOSE */}
                    <IconX stroke={1.25} />
                </ActionIcon>
                <Carousel
                    showArrows
                    showStatus={false}
                    showThumbs={false}
                    showIndicators={false}
                    useKeyboardArrows
                    renderArrowNext={renderArrowNext}
                    renderArrowPrev={renderArrowPrev}
                >
                    {data.map((item, index) => {
                        return (
                            <div key={index} className='carousel-container'>
                                <Image src={item.url} className='carousel-image' />
                            </div>
                        )
                    })}
                </Carousel>
            </Center>
        </div>
    );
};