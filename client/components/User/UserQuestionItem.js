import React from "react";
import moment from "moment";

const UserQuestionItem = ({ question }) => {
    return (
        <a
            href={`/admin/questions/${question.question_id}`}
            style={{
                textDecoration: "none",
                color: "black",
            }}
            target="_blank"
            rel="noreferrer"
        >
            <div role="button" className="p-3 border border-bottom my-1">
                <h5>{question.title.length > 64 ? question.title.substring(0, 64) + "..." : question.title}</h5>
                <div>
                    <div className="mb-2">
                        <span className="text-muted">
                            {question.content.length > 128
                                ? question.content.substring(0, 128) + "..."
                                : question.content}
                        </span>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">{moment(question.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default UserQuestionItem;
