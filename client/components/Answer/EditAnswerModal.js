import { Modal, Form, FloatingLabel } from "react-bootstrap";
import { useState } from "react";

const EditAnswerModal = ({ isShow, onCloseModalHandler, onUserEditAnswerHandler, oldContent }) => {
    const [content, setContent] = useState(oldContent);

    return (
        <Modal show={isShow} onHide={onCloseModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>แก้ไขคำตอบ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="px-3">
                    <Form onSubmit={(e) => onUserEditAnswerHandler(e, content)}>
                        <FloatingLabel controlId="floatingTextarea" label="คำตอบของคุณ">
                            <Form.Control
                                as="textarea"
                                placeholder="Leave a comment here"
                                style={{ height: "120px" }}
                                onChange={(e) => setContent(e.target.value)}
                                value={content}
                            />
                        </FloatingLabel>
                        <div className="mt-3">
                            <button className="btn btn-outline-primary">แก้ไข</button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditAnswerModal;
