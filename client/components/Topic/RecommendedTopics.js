import { useState } from "react";
import { Hash, ArrowRightCircle } from "react-bootstrap-icons";
import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import useEffectOnce from "../../hooks/use-effect-once";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../../utils/serverApi";

const RecommendedTopics = () => {
    const [topics, setTopics] = useState([]);

    const fetchTopicsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/topics/popular");
            setTopics(data.topics);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchTopicsHandler();
    });

    return (
        <div className="py-3 px-3">
            <h3>Popular topics</h3>
            <hr />
            <div className="d-flex flex-column justify-content-between">
                <ListGroup>
                    {topics.map((topic) => (
                        <Link href={`/topics/${topic.id}`} key={topic.id}>
                            <ListGroup.Item action className="d-flex align-items-center my-1" role="button">
                                <Hash />
                                <span className="fs-5">{topic.topic}</span>
                            </ListGroup.Item>
                        </Link>
                    ))}
                </ListGroup>
                <div className="text-end">
                    <Link href="/topics">
                        <a className="text-primary" role="button">
                            ดูTopicทั้งหมด <ArrowRightCircle />
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecommendedTopics;
