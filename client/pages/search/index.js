import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";
import { Container } from "react-bootstrap";
import Blogs from "../../components/Searching/Blogs";
import Questions from "../../components/Searching/Questions";

const SearchPage = () => {
    const router = useRouter();
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [relatedQuestions, setRelatedQuestions] = useState([]);

    const fetchRelatedBlogsHandler = async (key) => {
        try {
            const { data } = await axios.get(serverUrl + `/search/blogs?key=${key}`);
            setRelatedBlogs(data.blogs);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    const fetchRelatedQuestionsHandler = async (key) => {
        try {
            const { data } = await axios.get(serverUrl + `/search/questions?key=${key}`);
            setRelatedQuestions(data.questions);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        const key = router.query.key;
        if (key) {
            fetchRelatedBlogsHandler(key);
            fetchRelatedQuestionsHandler(key);
        }
    }, [router.query.key]);

    return (
        <Container className="text-light">
            <div
                className="mx-5 px-5 py-3 bg-light rounded-2 text-dark mt-3"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <div className="border rounded p-3 mt-3">
                    <h1 className="fs-4">
                        บล็อคที่เกี่ยวข้องกับ <b>{router.query.key ? router.query.key : ""}</b>
                    </h1>
                    <Blogs blogs={relatedBlogs} />
                </div>
                <div className="border rounded p-3 mt-3">
                    <h1 className="fs-4">
                        คำถามที่เกี่ยวข้องกับ <b>{router.query.key ? router.query.key : ""}</b>
                    </h1>
                    <Questions questions={relatedQuestions} />
                </div>
            </div>
        </Container>
    );
};

export default SearchPage;
