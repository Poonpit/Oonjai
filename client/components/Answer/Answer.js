import moment from "moment";
import { useState } from "react";
import { CheckCircleFill, Trash3, PencilSquare, ReplyAllFill } from "react-bootstrap-icons";
import EditAnswerModal from "./EditAnswerModal";
import Link from "next/link";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import ReplyAnswerModal from "./ReplyAnswerModal";

const Answer = ({ answer, id, onSetAnswers, isDoctor, userId, role, questionOwner, repliedAnswerHandler }) => {
    const [isShow, setIsShow] = useState(false);
    const [show, setShow] = useState(false);
    
    const deleteAnswerHandler = async () => {
        const ans = window.confirm("คุณต้องการจะลบคำตอบนี้หรือไม่");
        if (ans) {
            try {
                const { data } = await axios.delete(
                    serverUrl + `/questions/${answer.question_id}/answers/${answer.id}`,
                    {
                        headers: {
                            Authorization: "Bearer " + getTokenCookie(),
                        },
                    }
                );
                toast("Deleted");
                onSetAnswers((prev) => prev.filter((a) => a.id !== answer.id));
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
    };

    const editAnswerHandler = async (e, newAnswer) => {
        e.preventDefault();
        try {
            await axios.patch(
                serverUrl + `/questions/${answer.question_id}/answers/${answer.id}/update`,
                {
                    content: newAnswer,
                },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            toast("Updated");
            onSetAnswers((prev) => {
                const answers = JSON.parse(JSON.stringify(prev));
                console.log(answers);
                const answerTemp = answers.find((ans) => ans.id === answer.id);
                answerTemp.content = newAnswer;
                return answers;
            });
            setIsShow(false);
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="my-1 rounded border py-2 px-2 position-relative">
            <ReplyAnswerModal
                handleClose={handleClose}
                repliedAnswerHandler={repliedAnswerHandler}
                selectedAnswerId={answer.id}
                show={show}
            />
            <EditAnswerModal
                isShow={isShow}
                onCloseModalHandler={setIsShow}
                onUserEditAnswerHandler={editAnswerHandler}
                oldContent={answer.content}
            />
            <div className="d-flex justify-content-between">
                {answer.role === "DOCTOR" ? (
                    <Link href={`/doctor/profile/${answer.user_id}`}>
                        <div className="d-flex align-items-center" role="button">
                            <img
                                src={answer.url}
                                style={{
                                    width: "35px",
                                    height: "35px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                            />
                            <span className="ms-1">{answer.name}</span>
                            {answer.role === "DOCTOR" && (
                                <CheckCircleFill className="ms-1" style={{ color: "green" }} />
                            )}
                        </div>
                    </Link>
                ) : (
                    <div className="d-flex align-items-center">
                        <img
                            src={answer.url}
                            style={{
                                width: "35px",
                                height: "35px",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />
                        <span className="ms-1">{answer.name}</span>
                        {answer.role === "DOCTOR" && <CheckCircleFill className="ms-1" style={{ color: "green" }} />}
                    </div>
                )}
                {answer.user_id === id && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {answer.user_id == id && (
                            <PencilSquare
                                style={{
                                    fontSize: "25px",
                                    cursor: "pointer",
                                    marginRight: "2px",
                                }}
                                onClick={() => setIsShow(true)}
                            />
                        )}
                        <Trash3
                            style={{
                                color: "red",
                                fontSize: "25px",
                                cursor: "pointer",
                            }}
                            onClick={deleteAnswerHandler}
                        />
                    </div>
                )}
            </div>
            <div className="px-3 mt-2">
                <span>{answer.content}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="ms-3 mt-2">
                    <span className="text-muted">{moment(answer.created_at).fromNow()}</span>
                </div>
                {(questionOwner === userId || role === "DOCTOR") && answer.user_id !== userId && (
                    <ReplyAllFill
                        style={{
                            color: "gray",
                            fontSize: "25px",
                            cursor: "pointer",
                        }}
                        onClick={handleShow}
                    />
                )}
            </div>
        </div>
    );
};

export default Answer;
