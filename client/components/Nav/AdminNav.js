import React from "react";
import { Navbar, Nav, Container, Dropdown, SplitButton } from "react-bootstrap";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { profileActions } from "../../store/store";
import { removeTokenCookies } from "../../utils/cookies";
import { useRouter } from "next/router";

const AdminNav = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(profileActions.removeProfileState());
        removeTokenCookies();
        window.localStorage.removeItem("user");
        router.replace("/login");
    };

    const ProfileComponent = () => (
        <div className="d-flex align-items-center">
            <img
                src="/admin-profile-image.png"
                style={{ backgroundColor: "white", borderRadius: "50%", width: "35px" }}
            />
            <span className="text-light text-decoration-none ms-2">Admin</span>
        </div>
    );

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link href="/admin/dashboard">
                        <div className="d-flex align-items-center" role="button">
                            <h1
                                style={{
                                    fontFamily: "Dancing Script",
                                    fontSize: "38px",
                                }}
                            >
                                Oonjai
                            </h1>
                        </div>
                    </Link>
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <div className="d-flex align-items-center">
                        <SplitButton variant="dark" title={<ProfileComponent />}>
                            <Dropdown.Item>
                                <Link href="/admin/dashboard">
                                    <span className="text-dark text-decoration-none" role="button">
                                        Dashboard
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link href="/admin/doctors">
                                    <span className="text-dark text-decoration-none" role="button">
                                        จัดการหมอ
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={logoutHandler}>
                                <span className="text-dark text-decoration-none" role="button">
                                    ออกจากระบบ
                                </span>
                            </Dropdown.Item>
                        </SplitButton>
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default AdminNav;
