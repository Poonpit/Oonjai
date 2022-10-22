import { useState } from "react";
import Answer from "./Answer";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";
import { useSelector } from "react-redux";
import { FloatingLabel, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Answers = ({ questionId, isDoctor, questionOwner }) => {
    const router = useRouter();
    const { userId, role } = useSelector((state) => state.profileSlice);
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");

    const fetchAnswersHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + `/questions/${questionId}/answers`);
            setAnswers(data.answers);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        if (questionId) {
            fetchAnswersHandler();
        }
    }, [questionId]);

    const repliedAnswerHandler = (newReply) => {
        setAnswers([...answers, newReply]);
    };

    const answerQuestionHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                serverUrl + `/questions/${router.query.question_id}/answers`,
                { content },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            setAnswers([...answers, data.answer]);
            setContent("");
        } catch (e) {
            toast.error(e.response.data.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="mt-2 bg-light rounded-3 p-3">
            <h4>{answers.length} คำตอบ</h4>
            <hr />
            <div>
                {isDoctor && (
                    <div className="my-3 w-100 mx-auto">
                        <FloatingLabel controlId="floatingTextarea" label="คำตอบของคุณ">
                            <Form.Control
                                as="textarea"
                                placeholder="Leave a comment here"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ height: "100px" }}
                            />
                        </FloatingLabel>
                        <div className="text-end">
                            <button
                                className="btn btn-outline-primary mt-2"
                                onClick={answerQuestionHandler}
                                disabled={isLoading}
                            >
                                {isLoading ? "กำลังตอบ.." : "ตอบคำถาม"}
                            </button>
                        </div>
                    </div>
                )}
                {answers.map((answer) => (
                    <Answer
                        answer={answer}
                        id={userId}
                        key={answer.id}
                        repliedAnswerHandler={repliedAnswerHandler}
                        isDoctor={isDoctor}
                        questionOwner={questionOwner}
                        onSetAnswers={setAnswers}
                        userId={userId}
                        role={role}
                    />
                ))}
            </div>
        </div>
    );
};

export default Answers;
