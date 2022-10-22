import React from "react";
import { ChatDotsFill } from "react-bootstrap-icons";
import moment from "moment";
import Link from "next/link";
import { Alert } from "react-bootstrap";

const ReplyNotification = ({ notification }) => {
    return (
        <Link href={`/questions/${notification.question_id}`}>
            <Alert variant="light" className="px-3 py-2 my-1 rounded border" role="button">
                <div>
                    <h5>
                        <ChatDotsFill style={{color: "skyblue"}} /> มีผู้ใช้ตอบกลับคำตอบของคุณ
                    </h5>
                </div>
                <div className="text-end">
                    <span className="text-muted">{moment(notification.created_at).fromNow()}</span>
                </div>
            </Alert>
        </Link>
    );
};

export default ReplyNotification;
