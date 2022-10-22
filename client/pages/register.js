import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../utils/serverApi";
import { useState } from "react";

const RegisterPage = () => {
    const [enteredData, setEnteredData] = useState({
        email: "",
        name: "",
        password: "",
        birthday: "",
    });
    const { email, name, password, birthday } = enteredData;
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(serverUrl + "/auth/signup", enteredData);
            toast(data.message);
            setEnteredData({
                email: "",
                name: "",
                password: "",
                birthday: "",
            });
        } catch (e) {
            toast.error(e.response.data.message);
        }
        setIsLoading(false);
    };

    const enteredDataChangeHandler = (e) => {
        const { name, value } = e.target;
        setEnteredData({
            ...enteredData,
            [name]: value,
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div
                className="d-flex align-items-center bg-light mt-4 overflow-hidden"
                style={{
                    width: "60rem",
                    height: "30rem",
                    borderRadius: "8px",
                }}
            >
                <div className="w-50 bg-primary" style={{ height: "30rem" }}>
                    <img src="/doctor-bg.jpg" style={{ width: "100%", height: "30rem" }} />
                </div>
                <div className="w-50 h-100 p-4">
                    <h1>Register</h1>
                    <div className="my-4 px-4">
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-1">
                                <Form.Label>อีเมล</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="อีเมล"
                                    name="email"
                                    value={email}
                                    onChange={enteredDataChangeHandler}
                                />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>ชื่อ</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="ชื่อ"
                                    name="name"
                                    value={name}
                                    onChange={enteredDataChangeHandler}
                                />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>รหัสผ่าน</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="รหัสผ่าน"
                                    name="password"
                                    value={password}
                                    onChange={enteredDataChangeHandler}
                                />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>วัน/เดือน/ปี เกิด</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birthday"
                                    value={birthday}
                                    onChange={enteredDataChangeHandler}
                                />
                            </Form.Group>
                            <div className="py-4">
                                <div className="d-flex align-items-center justify-content-end">
                                    <Link href="/login">
                                        <span className="text-primary me-3" role="button">
                                            ← Login page
                                        </span>
                                    </Link>
                                    <Button valiant="outline-primary" type="submit" disabled={isLoading}>
                                        {isLoading ? "Registering.." : "Register"}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
