import { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { serverUrl } from "../../utils/serverApi";
import { getTokenCookie } from "../../utils/cookies";
import axios from "axios";

const ChangePasswordModal = ({ isChangePassword, onCloseChangePasswordModalHandler }) => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const changePasswordHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if(password !== confirm) {
                return toast.error("รหัสผ่านไม่ตรงกัน")
            }
            const {data} = await axios.patch(serverUrl + "/profile/password/change", {
                password
            }, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            })
            toast("เปลี่ยนรหัสผ่านแล้ว")
            onCloseChangePasswordModalHandler();
        } catch (e) {
            toast.error("Error");
        }
        setIsLoading(false);
    };

    return (
        <Modal show={isChangePassword} onHide={onCloseChangePasswordModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>เปลี่ยนรหัสผ่าน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={changePasswordHandler}>
                    <Form.Group className="mb-3">
                        <Form.Label>รหัสผ่านใหม่</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="New password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            onChange={(e) => setConfirm(e.target.value)}
                            value={confirm}
                        />
                    </Form.Group>
                    <div className="text-end">
                        <Button variant="secondary" className="me-2" onClick={onCloseChangePasswordModalHandler}>
                            ยกเลิก
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? "กำลังเปลี่ยน..": "เปลี่ยนรหัสผ่าน"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal;
