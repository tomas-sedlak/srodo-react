import { useEffect } from 'react';

export default function AdSenseAd({ adClient, adSlot, style = {}, className }) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("Adsense error", e);
        }
    }, []);

    return (
        <ins
            className={`adsbygoogle ${className || ''}`}
            style={{ display: "block", textAlign: "center", ...style }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={adClient}
            data-ad-slot={adSlot}
        ></ins>
    );
};