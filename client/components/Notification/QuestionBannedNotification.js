import React from "react";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import moment from "moment";
import { Alert } from "react-bootstrap";

const QuestionBannedNotification = ({ notification }) => {
    return <Alert variant="light" className="px-3 py-2 my-1 rounded border">
        <div>
            <h5>
                <ExclamationCircleFill style={{color: "red"}} /> คำถามของคุณถูกลบ เนื่องจากคำถามละเมิดกฏของเว็ปไซต์เรา
            </h5>
        </div>
        <div className="text-end">
            <span className="text-muted">{moment(notification.created_at).fromNow()}</span>
        </div>
    </Alert>;
};

export default QuestionBannedNotification;
