import { Modal, Button } from "react-bootstrap";
import { EyeFill, CheckCircle } from "react-bootstrap-icons";
import moment from "moment";

const RelatedQuestionsAlert = ({
    relatedQuestions,
    isAlert,
    onCloseModalHandler,
    onConfirmCreateNewQuestionHandler,
}) => {
    return (
        <Modal show={isAlert} onHide={onCloseModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>คำถามเหล่านี้คือคำถามที่คุณต้องการจะถามหรือไม่</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {relatedQuestions.map((question) => (
                    <div className="border my-1 rounded-2 p-2" key={question.id}>
                        <a href={`/questions/${question.id}`} target="_blank" rel="noreferrer">
                            <h6>{question.title}</h6>
                        </a>
                        <div className="mt-3 d-flex align-items-center justify-content-between text-dark">
                            <div className="d-flex align-items-center">
                                <EyeFill />
                                <span className="ms-1">{question.views}</span>
                            </div>
                            <div>
                                <CheckCircle style={{
                                    color: "green",
                                    fontSize: "20px"
                                }} title="ตอบกลับแล้วโดยแพทย์" />
                            </div>
                            <span className="text-muted">{moment(question.created_at).fromNow()}</span>
                        </div>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onConfirmCreateNewQuestionHandler}>
                    ถามต่อไป
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RelatedQuestionsAlert;
