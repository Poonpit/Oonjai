import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import Link from "next/link";
import { CardList } from "react-bootstrap-icons";
import useEffectOnce from "../../hooks/use-effect-once";
import { toast } from "react-toastify";
import { serverUrl } from "../../utils/serverApi";
import axios from "axios";

const TopicsPage = () => {
    const [keyword, setKeyword] = useState("");
    const [topics, setTopics] = useState([]);

    const searchingHandler = (e) => {
        setKeyword(e.target.value);
    };

    const fetchTopicsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/topics");
            setTopics(data.topics);
        } catch (e) {
            toast.error(e.response.error.message);
        }
    };

    useEffectOnce(() => {
        fetchTopicsHandler();
    });

    return (
        <Container>
            <div
                className="bg-light rounded-3 mx-5 px-5 py-3 mt-3"
                style={{
                    height: "38rem",
                    overflowY: "scroll",
                }}
            >
                <h2>All topics</h2>
                <hr />
                <div className="px-5">
                    <Form.Control
                        type="text"
                        className="mx-auto w-75 mb-3"
                        placeholder="Search..."
                        onChange={searchingHandler}
                        value={keyword}
                        style={{
                            borderRadius: "2rem",
                        }}
                    />
                    <div className="w-100 py-2">
                        {topics.map((topic) => (
                            <Link href={`/topics/${topic.id}`} key={topic.id}>
                                <div
                                    className="rounded p-3 border mb-1 w-75 mx-auto d-flex align-items-center"
                                    style={{
                                        backgroundColor: "white",
                                    }}
                                >
                                    <CardList
                                        style={{
                                            fontSize: "24px",
                                            marginRight: "3px",
                                        }}
                                    />
                                    <span role="button" className="ms-1">
                                        {topic.topic}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default TopicsPage;
