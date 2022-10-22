import React from "react";
import { PatchQuestionFill } from "react-bootstrap-icons";
import moment from "moment";
import Link from "next/link";
import { Alert } from "react-bootstrap";

const QuestionNotification = ({ notification, role }) => {
    return (
        <Link
            href={
                role === "DOCTOR"
                    ? `/doctor/questions/${notification.question_id}`
                    : `/questions/${notification.question_id}`
            }
        >
            <Alert variant="light" className="px-3 py-2 my-1 rounded border" role="button">
                <div>
                    <h5>
                        <PatchQuestionFill style={{ color: "blue" }} /> มีคำถามใหม่ในหัวข้อที่คุณสนใจ
                    </h5>
                </div>
                <div className="text-end">
                    <span className="text-muted">{moment(notification.created_at).fromNow()}</span>
                </div>
            </Alert>
        </Link>
    );
};

export default QuestionNotification;
