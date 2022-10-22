import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { useRouter } from "next/router";
import { getTokenCookie } from "../../utils/cookies";

const ReplyAnswerModal = ({ handleClose, show, selectedAnswerId, repliedAnswerHandler }) => {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const replyHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const {data} = await axios.post(serverUrl + `/questions/${router.query.question_id}/answers/${selectedAnswerId}/reply`, {content}, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            });
            toast("ตอบกลับแล้ว");
            repliedAnswerHandler(data.answer);
            handleClose();
        }catch(e) {
            toast.error(e.response.data.message);
        }
        setIsLoading(false);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>ตอบกลับ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={replyHandler}>
                    <div className="mb-2">
                        <Form.Control as="textarea" style={{
                            height: "6rem"
                        }} placeholder="ตอบกลับ..." value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    <Button variant="primary" type="submit">{isLoading ? "กำลังตอบกลับ.." : "ตอบกลับ"}</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReplyAnswerModal;
