import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { profileActions } from "../store/store";
import { useRouter } from "next/router";
import { setTokenCookie } from "../utils/cookies";
import { toast } from "react-toastify";
import { serverUrl } from "../utils/serverApi";

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch((state) => state.profileSlice);
    const [enteredData, setEnteredData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = enteredData;

    const enteredDataChangeHandler = (e) => {
        setEnteredData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(serverUrl + "/auth/signin", enteredData);
            dispatch(profileActions.setInitialProfile(data.user));
            setTokenCookie(data.token);
            switch (data.user.role) {
                case "PATIENT":
                    router.replace("/");
                    break;
                case "DOCTOR":
                    router.replace("/doctor/home");
                    break;
                case "ADMIN":
                    router.replace("/admin/dashboard");
            }
            window.localStorage.setItem("user", JSON.stringify(data.user));
        } catch (e) {
            toast.error(e.response.data.message);
        }
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
                <div className="w-50" style={{ height: "30rem" }}>
                    <img src="/doctor-bg.jpg" style={{ width: "100%", height: "30rem" }} />
                </div>
                <div className="w-50 h-100 p-5">
                    <h1>Login</h1>
                    <div className="my-4 px-4">
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    onChange={enteredDataChangeHandler}
                                    value={email}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={enteredDataChangeHandler}
                                    value={password}
                                />
                            </Form.Group>
                            <div className="py-4">
                                <div className="d-flex align-items-center justify-content-end">
                                    <Link href="/register">
                                        <span className="text-primary me-3" role="button">
                                            ← Register page
                                        </span>
                                    </Link>
                                    <Button valiant="outline-primary" type="submit">
                                        Login
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

export default LoginPage;
