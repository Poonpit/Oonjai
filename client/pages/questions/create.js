import { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import RelatedQuestionsAlert from "../../components/Question/RelatedQuestionsAlert";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";

const CreateQuestionPage = () => {
    const [enteredData, setEnteredData] = useState({
        title: "",
        content: "",
        topicId: "",
    });
    const [topics, setTopics] = useState([]);
    const [isAlert, setIsAlert] = useState(false);
    const [relatedQuestions, setRelatedQuestions] = useState([]);

    const { title, content, topicId } = enteredData;

    const dataChangeHandler = (e) => {
        const { name, value } = e.target;
        setEnteredData({
            ...enteredData,
            [name]: value,
        });
    };

    const fetchTopicsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/topics");
            setTopics(data.topics);
            setEnteredData({
                ...enteredData,
                topicId: data.topics[0].id
            })
        } catch (e) {
            console.log(e);
        }
    };

    useEffectOnce(() => {
        fetchTopicsHandler();
    });

    const closeModalHandler = () => {
        setIsAlert(false);
    };

    const createNewQuestionHandler = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.get(serverUrl + "/questions/related/" + topicId, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            });
            console.log(data);
            if(data.questions) {
                if(data.questions.length > 0) {
                    setRelatedQuestions(data.questions);
                    setIsAlert(true);
                } else {
                    confirmCreateNewQuestionHandler();
                }
            } else {
                confirmCreateNewQuestionHandler();
            }
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    const confirmCreateNewQuestionHandler = async () => {
        try {
            const {data} = await axios.post(serverUrl + "/questions/create", enteredData, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            })
            toast("Created");
            setIsAlert(false);
            setEnteredData({
                title: "",
                content: "",
                topicId: topics[0].id || null
            })
        }catch(e) {
            toast.error(e.response.data.error);
        }
    };

    return (
        <Container>
            <RelatedQuestionsAlert
                isAlert={isAlert}
                onCloseModalHandler={closeModalHandler}
                onConfirmCreateNewQuestionHandler={confirmCreateNewQuestionHandler}
                relatedQuestions={relatedQuestions}
            />
            <div className="mx-5 px-5 py-3 bg-light rounded-3 mt-3">
                <h1>สร้างคำถามใหม่</h1>
                <hr className="bg-dark" />
                <Form onSubmit={createNewQuestionHandler}>
                    <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" onChange={dataChangeHandler} value={title} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="4"
                            name="content"
                            onChange={dataChangeHandler}
                            value={content}
                        />
                    </Form.Group>
                    <div className="w-50">
                        <Form.Group className="mb-2">
                            <Form.Label>Select topic</Form.Label>
                            <Form.Select
                                value={topicId}
                                onChange={(e) =>
                                    setEnteredData({
                                        ...enteredData,
                                        topicId: e.target.value,
                                    })
                                }
                            >
                                {topics.map((topic) => (
                                    <option
                                        value={topic.id}
                                        key={topic.id}
                                        onClick={() =>
                                            setEnteredData({
                                                ...enteredData,
                                                topicId: topic.id,
                                            })
                                        }
                                    >
                                        {topic.topic}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="text-end">
                        <Button variant="primary" className="px-5 py-2" type="submit">
                            Create
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default CreateQuestionPage;
