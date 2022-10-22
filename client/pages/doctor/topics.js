import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";
import EditTopicModal from "../../components/Topic/EditTopicModal";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";

const DUMMY_TOPICS = [
    {
        id: 1,
        topic: "โรคA",
    },
    {
        id: 2,
        topic: "สุขภาพจิต",
    },
    {
        id: 3,
        topic: "โรคA",
    },
    {
        id: 4,
        topic: "สุขภาพจิต",
    },
    {
        id: 5,
        topic: "โรคA",
    },
    {
        id: 6,
        topic: "สุขภาพจิต",
    },
];

const TopicPage = () => {
    const [newTopic, setNewTopic] = useState("");
    const [topics, setTopics] = useState(DUMMY_TOPICS);
    const [isShow, setIsShow] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const fetchTopicsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/topics");
            setTopics(data.topics);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    const createTopicHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.post(
                serverUrl + "/topics/create",
                {
                    topic: newTopic,
                },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            setTopics([...topics, data.topic]);
            setNewTopic("");
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchTopicsHandler();
    });

    const showModalHandler = (topic_id) => {
        const topic = topics.find((topic) => topic.id === topic_id);
        setSelectedTopic(topic);
        setIsShow(true);
    };

    const closeModalHandler = () => {
        setIsShow(false);
    };

    const deleteTopicHandler = async (id) => {
        const answer = window.confirm("คุณต้องการที่จะลบTopicนี้หรือไม่");
        if (answer) {
            try {
                const { data } = await axios.delete(serverUrl + `/topics/${id}`, {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                });
                const filtered = topics.filter((topic) => topic.id !== id);
                setTopics(filtered);
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
    };

    return (
        <Container>
            {selectedTopic && (
                <EditTopicModal
                    isShow={isShow}
                    onSetSelectedTopic={setSelectedTopic}
                    selectedTopic={selectedTopic}
                    onSetTopics={setTopics}
                    onCloseModalHandler={closeModalHandler}
                />
            )}
            <div
                className="mt-3 px-5 mx-5 py-3 rounded-3 bg-light d-flex"
                style={{
                    height: "39rem",
                }}
            >
                <div
                    className="w-75 p-3 border rounded-2 mt-4"
                    style={{
                        height: "34rem",
                        overflowY: "scroll",
                    }}
                >
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between"
                        >
                            <span>{topic.topic}</span>
                            <div className="d-flex align-items-center">
                                <PencilSquare
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "26px",
                                        marginRight: "3px",
                                    }}
                                    onClick={() => showModalHandler(topic.id)}
                                />
                                <Trash3
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "26px",
                                        color: "red",
                                    }}
                                    onClick={() => deleteTopicHandler(topic.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className="w-25 ms-2 border rounded-2 mt-4 p-3"
                    style={{
                        height: "11rem",
                    }}
                >
                    <h5>เพิ่มTopicใหม่</h5>
                    <hr />
                    <Form onSubmit={createTopicHandler}>
                        <input
                            type="text"
                            className="form-control"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                        />
                        <div className="text-end">
                            <button className="btn btn-primary mt-2 px-4">เพิ่ม</button>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    );
};

export default TopicPage;
