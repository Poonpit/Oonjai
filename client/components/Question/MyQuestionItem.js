import React from "react";
import Link from "next/link";
import moment from "moment";
import { CheckCircle, PencilSquare, Trash3, ChatLeftTextFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { getTokenCookie } from "../../utils/cookies";

const MyQuestionItem = ({ question, onDeleteQuestionHandler }) => {

    return (
        <div className="p-2 my-1 bg-light border rounded">
            <div className="d-flex justify-content-between align-items-center">
                <div className="text-break">
                    <Link href={`/questions/${question.id}`}>
                        <h5 role="button" className="text-primary">
                            {question.title}
                        </h5>
                    </Link>
                </div>
                <div className="d-flex align-items-center">
                    <Link href={`/questions/edit/${question.id}`}>
                        <PencilSquare
                            style={{
                                fontSize: "25px",
                                cursor: "pointer",
                            }}
                        />
                    </Link>
                    <Trash3
                        style={{
                            fontSize: "25px",
                            marginLeft: "4px",
                            cursor: "pointer",
                        }}
                        onClick={() => onDeleteQuestionHandler(question.id)}
                    />
                </div>
            </div>
            <div>
                <span>
                    {question.content.length > 256 ? question.content.substring(0, 256) + "..." : question.content}
                </span>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
                <span className="badge bg-warning px-2">{question.topic}</span>
                <div className="d-flex align-items-center">
                    <ChatLeftTextFill />
                    <span className="ms-1">{question.number_of_answers}</span>
                    {question.status === 1 && (
                        <CheckCircle
                            style={{ color: "green", fontSize: "25px" }}
                            className="ms-1"
                            title="ได้รับการตอบกลับโดยแพทย์"
                        />
                    )}
                </div>
                <span className="text-muted">{moment(question.created_at).format("DD/MM/yyyy HH:mm")}</span>
            </div>
        </div>
    );
};

export default MyQuestionItem;
