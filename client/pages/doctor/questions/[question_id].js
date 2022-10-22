import { Badge, Container } from "react-bootstrap";
import moment from "moment";
import Answers from "../../../components/Answer/Answers";
import Link from "next/link";
import { FloatingLabel, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserProfileModal from "../../../components/Question/UserProfileModal";
import { EyeFill } from "react-bootstrap-icons";
import axios from "axios";
import { serverUrl } from "../../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../../utils/cookies";
import useEffectOnce from "../../../hooks/use-effect-once";

const DoctorQuestionPage = () => {
    const router = useRouter();
    const [question, setQuestion] = useState({url: ""});
    const [isShow, setIsShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");

    const fetchQuestionHandler = async (id) => {
        try {
            const { data } = await axios.get(serverUrl + `/questions/${id}`, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            });
            setQuestion(data.question);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        if (router.query.question_id) {
            fetchQuestionHandler(router.query.question_id);
        }
    }, [router.query.question_id]);

    return (
        <Container>
            <UserProfileModal
                isShow={isShow}
                onSetIsShow={setIsShow}
                user={{ name: question.name, birthday: question.birthday }}
            />
            <div className="mt-3 mx-5 px-5 py-3 bg-light rounded-3 position-relative" style={{
                height: "45rem",
                overflowY: "scroll"
            }}>
                <Badge
                    pill
                    bg="warning"
                    style={{
                        position: "absolute",
                        right: 1,
                        top: 1,
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
                <div className="d-flex justify-content-between align-items-center">
                    <div
                        className="d-flex align-items-center"
                        role="button"
                        onClick={() => setIsShow(true)}
                        title="View profile"
                    >
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
                {question && <Answers questionId={question.id} isDoctor={true} />}
            </div>
        </Container>
    );
};

export default DoctorQuestionPage;
