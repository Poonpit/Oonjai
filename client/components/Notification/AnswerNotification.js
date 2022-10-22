import React from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import moment from "moment";
import Link from "next/link";
import { Alert } from "react-bootstrap";

const AnswerNotification = ({ notification }) => {
    return (
        <Link href={`/questions/${notification.question_id}`}>
            <Alert variant="light" className="px-3 py-2 my-1 rounded border" role="button">
                <div>
                    <h5>
                        <CheckCircleFill style={{color: "green"}} /> แพทย์ได้ตอบคำถามของคุณแล้ว{" "}
                    </h5>
                </div>
                <div className="text-end">
                    <span className="text-muted">{moment(notification.created_at).fromNow()}</span>
                </div>
            </Alert>
        </Link>
    );
};

export default AnswerNotification;
