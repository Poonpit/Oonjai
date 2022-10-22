import axios from "axios";
import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import { serverUrl } from "../../utils/serverApi";

const EditTopicModal = ({ isShow, selectedTopic, onCloseModalHandler, onSetSelectedTopic, onSetTopics }) => {
    const [topic, setTopic] = useState(selectedTopic.topic);

    const editTopicHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.patch(serverUrl + `/topics/${selectedTopic.id}/update`, {topic}, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            onSetSelectedTopic(null);
            onSetTopics(prev => {
                const topics = JSON.parse(JSON.stringify(prev));
                const top = topics.find(t => t.id === selectedTopic.id);
                top.topic = topic;
                return topics;
            })
            toast("Updated");
            onCloseModalHandler()
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    return (
        <Modal show={isShow} onHide={onCloseModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>แก้ไขTopic</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-end px-4 py-4">
                <Form onSubmit={editTopicHandler}>
                    <Form.Control type="text" value={topic} onChange={(e) => setTopic(e.target.value)} />
                    <button className="btn btn-outline-warning px-4 mt-3" type="submit">
                        แก้ไข
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditTopicModal;
