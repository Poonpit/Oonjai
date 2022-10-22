import { Badge, Container } from "react-bootstrap";
import moment from "moment";
import Answers from "../../components/Answer/Answers";
import Link from "next/link";
import LatestQuestions from "../../components/Question/LatestQuestions";
import { EyeFill } from "react-bootstrap-icons";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const QuestionPage = () => {
    const [question, setQuestion] = useState({
        topic_id: "1",
    });
    const router = useRouter();
    let isFetched = false;

    const fetchQuestionHandler = async (questionId) => {
        try {
            const { data } = await axios.get(serverUrl + `/questions/${questionId}`);
            setQuestion(data.question);

            await axios.patch(serverUrl + `/questions/${data.question.id}/views/increase`, {});

            isFetched = true;
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        if (router.query.question_id && !isFetched) {
            fetchQuestionHandler(router.query.question_id);
        }
    }, [router.query.question_id]);

    return (
        <Container>
            <div
                className="mt-3 mx-5 px-5 py-3 bg-light rounded-3 position-relative"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <Badge
                    pill
                    bg="warning"
                    style={{
                        position: "absolute",
                        right: 7,
                        top: 7,
                    }}
                    className="px-3 py-2"
                >
                    <Link href={`/topics/${question.topic_id}`}>
                        <span role="button">{question.topic}</span>
                    </Link>
                </Badge>

                <div>
                    <h5>{question.title}</h5>
                    <p>{question.content}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <img
                            src={question.url}
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />
                        <span className="ms-1">{question.name}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <EyeFill
                            style={{
                                fontSize: "20px",
                            }}
                        />
                        <span className="ms-1">{question.views}</span>
                    </div>
                    <div>
                        <span className="text-muted">{moment(question.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
                <Answers questionId={question.id} questionOwner={question.user_id} />
                <hr />
            </div>
        </Container>
    );
};

export default QuestionPage;
