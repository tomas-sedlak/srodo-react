import { useState, useEffect } from 'react';
import Post from "../templates/post";

export default function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/")
            .then(response => response.json())
            .then(posts => setPosts(posts))
    }, [])

    return (
        <>
            {posts.map((post) => <Post post={post} />)} 
        </>
    )
}