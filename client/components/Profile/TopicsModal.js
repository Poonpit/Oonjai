import { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";

const TopicsModal = ({ isShowTopics, onCloseTopicModalHandler, interested_in, onAddedNewTopics }) => {
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);

    const fetchTopicsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/topics");
            const mapping = interested_in.map((topic) => topic.id);
            const filtered = data.topics.filter((topic) => !mapping.includes(topic.id));
            setTopics(filtered);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchTopicsHandler()
    });

    const selectTopicsHandler = (topicId) => {
        if (selectedTopics.includes(topicId)) {
            const filtered = selectedTopics.filter((selectedTopicId) => selectedTopicId !== topicId);
            setSelectedTopics(filtered);
        } else {
            setSelectedTopics((prev) => [...prev, topicId]);
        }
    };

    const addNewTopicHandler = async (e) => {
        try {
            const { data } = await axios.patch(
                serverUrl + "/profile/attentions/add",
                {
                    topics: selectedTopics,
                },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            onAddedNewTopics(data.interested_in);
            onCloseTopicModalHandler();
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    return (
        <Modal show={isShowTopics} onHide={onCloseTopicModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>เลือกหัวข้อที่สนใจ</Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    height: "25rem",
                    overflowY: "scroll",
                }}
            >
                <div className="py-3 d-flex flex-wrap">
                    {topics.map((topic, index) => (
                        <div className="m-1" key={topic.id}>
                            <input
                                type="checkbox"
                                className="btn-check"
                                id={`success-outlined_${topic.id}`}
                                onChange={(e) => selectTopicsHandler(topic.id)}
                                checked={selectedTopics.includes(topic.id)}
                            />
                            <label className="btn btn-outline-success px-3" htmlFor={`success-outlined_${topic.id}`}>
                                {topic.topic}
                            </label>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={addNewTopicHandler}>
                    เพิ่มไปยังความสนใจ
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default TopicsModal;
