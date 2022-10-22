import { useState } from "react";
import { Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import { resizeImage } from "../../utils/imageResizer";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { getTokenCookie } from "../../utils/cookies";

const AddDoctorModal = ({ isShowAddDoctorModal, onCloseAddDoctorModal, onSetDoctors }) => {
    const [data, setData] = useState({
        email: "",
        name: "",
        password: "",
        image: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const { email, name, password, image } = data;

    const dataChangeHandler = async (e) => {
        const { name, value } = e.target;
        if (name === "image") {
            const file = e.target.files[0];
            const base64Image = await resizeImage(file);
            setData({
                ...data,
                image: base64Image,
            });
        } else {
            setData({
                ...data,
                [name]: value,
            });
        }
    };

    const createNewDoctorHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await axios.post(serverUrl + "/admin/doctors/create", data, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            onSetDoctors(prev => [...prev, res.data.user])
            setData({
                email: "",
                name: "",
                password: "",
                image: "",
            })
            onCloseAddDoctorModal()
        } catch (e) {
            toast.error(e.response.data.message);
        }
        setIsLoading(false)
    };

    return (
        <Modal show={isShowAddDoctorModal} onHide={onCloseAddDoctorModal}>
            <Modal.Header closeButton>
                <Modal.Title>เพิ่มแพทย์</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="px-3">
                    <Form onSubmit={createNewDoctorHandler}>
                        <FloatingLabel label="Email address" className="mb-2">
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                name="email"
                                value={email}
                                onChange={dataChangeHandler}
                            />
                        </FloatingLabel>
                        <div className="mb-3">
                            <span>รูปภาพโปรไฟล์</span>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name="image"
                                placeholder="Profile image"
                                onChange={dataChangeHandler}
                            />
                        </div>
                        <FloatingLabel label="Name" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={name}
                                onChange={dataChangeHandler}
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Password" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={dataChangeHandler}
                            />
                        </FloatingLabel>
                        <div className="text-end">
                            <button className="btn btn-primary px-4" type="submit" disabled={isLoading}>
                                {isLoading ? "Adding..": "Add"}
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AddDoctorModal;
