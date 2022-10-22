import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { serverUrl } from "../../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../../utils/cookies";
import useEffectOnce from "../../../hooks/use-effect-once";
import { useRouter } from "next/router";

const EditQuestionPage = () => {
    const router = useRouter();
    const [question, setQuestion] = useState({
        id: "",
        title: "",
        content: "",
        topic_id: "",
    });
    const [topics, setTopics] = useState([{id: ""}]);
    const { id, title, content, topic_id } = question;

    const fetchTopics = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/topics");
            setTopics(data.topics);
        } catch (e) {
            toast.error(e.response.error.message);
        }
    };

    const fetchQuestion = async (id) => {
        try {
            const { data } = await axios.get(serverUrl + `/questions/${id}`);
            setQuestion(data.question);
            console.log(data.question)
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        if (router.query.question_id) {
            fetchTopics();
            fetchQuestion(router.query.question_id);
        }
    }, [router.query.question_id]);

    const selectTopicHandler = (e) => {
        setQuestion({
            ...question,
            topic_id: e.target.value,
        });
    };

    const updateQuestionHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.patch(serverUrl + `/questions/${id}/update`, question, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            toast("Updated");
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    const questionChangeHandler = (e) => {
        const { name, value } = e.target;
        setQuestion({
            ...question,
            [name]: value,
        });
    };

    return (
        <div className="bg-dark vh-100">
            <Container>
                <div className="mx-5 px-5 bg-light rounded-2 py-3">
                    <h2>แก้ไขคำถาม</h2>
                    <hr />
                    <div className="px-3">
                        <Form onSubmit={updateQuestionHandler}>
                            <Form.Group className="mb-2">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={title} onChange={questionChangeHandler} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Content</Form.Label>
                                <Form.Control as="textarea" rows="4" name="content" value={content} onChange={questionChangeHandler} />
                            </Form.Group>
                            <div className="w-50">
                                <Form.Group className="mb-2">
                                    <Form.Label>Select topic</Form.Label>
                                    <Form.Select defaultValue={question.topic_id} onChange={selectTopicHandler}>
                                        {topics.map((topic) => (
                                            <option
                                                value={topic.id}
                                                key={topic.id}
                                                selected={topic.id === topic_id}
                                            >
                                                {topic.topic}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="text-end">
                                <Button variant="warning" className="px-5 py-2" type="submit">
                                    Edit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default EditQuestionPage;
