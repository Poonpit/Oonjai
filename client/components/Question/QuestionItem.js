import Link from "next/link";
import { ChatLeftTextFill, CheckCircle, ExclamationDiamondFill } from "react-bootstrap-icons";
import moment from "moment";

const QuestionItem = ({ question, isDoctor, onBanQuestionHandler }) => {
    return (
        <div className="latest-question-item border rounded p-2 my-1 position-relative">
            {isDoctor && (
                <ExclamationDiamondFill
                    style={{
                        fontSize: "24px",
                        color: "red",
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 10,
                        cursor: "pointer",
                    }}
                    onClick={() => onBanQuestionHandler(question.id)}
                    title="แบนคำถาม"
                />
            )}
            <div role="button">
                <Link href={isDoctor ? `/doctor/questions/${question.id}` : `/questions/${question.id}`}>
                    <h5 className="admin-question-item d-flex mb-0">
                        {question.title.length > 64 ? question.title.substring(0, 64) + "..." : question.title}
                    </h5>
                </Link>
                <span className="badge bg-warning px-2 me-1 mb-1">{question.topic}</span>
            </div>
            <div>
                <span>
                    {question.content.length > 128 ? question.content.substring(0, 128) + "..." : question.content}
                </span>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="d-flex align-items-center">
                    <img
                        src={question.url}
                        style={{
                            width: "32px",
                            borderRadius: "50%",
                        }}
                    />
                    <span className="ms-1">{question.name}</span>
                </div>
                <div className="d-flex align-items-center">
                    <ChatLeftTextFill />
                    <span className="mx-1">{question.number_of_answers}</span>
                    {!isDoctor && <CheckCircle style={{ color: "green", fontSize: "25px" }} title="ได้รับการตอบกลับโดยแพทย์" />}
                </div>
                <div>
                    <span className="text-muted">{moment(question.created_at).fromNow()}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionItem;
