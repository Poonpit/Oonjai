import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LatestTopicBlogs from "../../components/Topic/LatestTopicBlogs";
import { Hash } from "react-bootstrap-icons";
import LatestTopicQuestions from "../../components/Topic/LatestTopicQuestions";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import {toast} from "react-toastify"

const TopicPage = () => {
    const router = useRouter();
    const [topicId, setTopicId] = useState(null);
    const [topic, setTopic] = useState(null);

    const fetchTopicInfoHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + `/topics/${router.query.topicId}`);
            setTopic(data.topic.topic);
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        if (router.query.topicId) {
            setTopicId(router.query.topicId);
            fetchTopicInfoHandler();
        }
    }, [router.query.topicId]);

    return (
        <Container>
            <div
                className="bg-light rounded-3 mx-5 px-5 py-3 mt-3"
                style={{
                    height: "45rem",
                    overflowY: "scroll"
                }}
            >
                <h3 className="d-flex align-items-center">
                    <Hash />
                    {topic}
                </h3>
                <hr />
                {topicId && (
                    <div>
                        <LatestTopicBlogs topicId={topicId} />
                        <br />
                        <LatestTopicQuestions topicId={topicId} />
                    </div>
                )}
            </div>
        </Container>
    );
};

export default TopicPage;
