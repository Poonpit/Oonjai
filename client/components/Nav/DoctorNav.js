import React from "react";
import { Navbar, Nav, Container, Dropdown, SplitButton, Badge } from "react-bootstrap";
import Link from "next/link";
import SearchBar from "../Searching/SearchBar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { profileActions } from "../../store/store";
import { removeTokenCookies, getTokenCookie } from "../../utils/cookies";
import { useRouter } from "next/router";
import axios from "axios";
import useEffectOnce from "../../hooks/use-effect-once";
import { serverUrl } from "../../utils/serverApi";

const DoctorNav = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { name, profileImageUrl, unreadNotifications } = useSelector((state) => state.profileSlice);

    const logoutHandler = () => {
        dispatch(profileActions.removeProfileState());
        removeTokenCookies();
        window.localStorage.removeItem("user");
        router.replace("/login");
    };

    const fetchUnreadNotification = async () => {
        try {
            const {data} = await axios.get(serverUrl + "/notifications/unread", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            })
            dispatch(profileActions.setUnreadNotification(data.unreadNotification))
        }catch(e) {
            console.log(e)
        }
    }

    useEffectOnce(() => {
        fetchUnreadNotification();
    })

    const ProfileComponent = ({ name, profileImageUrl }) => (
        <Link href="/doctor/profile">
            <div className="d-flex align-items-center">
                <img src={profileImageUrl} style={{ borderRadius: "50%", width: "35px" }} />
                <span
                    className="text-light text-decoration-none ms-2"
                    style={{
                        overflow: "auto",
                        whiteSpace: "nowrap",
                    }}
                >
                    {name}
                </span>
            </div>
        </Link>
    );

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link href="/doctor/home">
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
                <div className="w-100">
                    <SearchBar />
                </div>
                <Nav className="ms-auto">
                    <div className="d-flex align-items-center">
                        <SplitButton
                            variant="dark"
                            title={<ProfileComponent name={name} profileImageUrl={profileImageUrl} />}
                        >
                            <Dropdown.Item>
                                <Link href="/blogs/create">
                                    <span className="text-dark text-decoration-none" role="button">
                                        สร้างบล็อคใหม่
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link href="/blogs/my-blogs">
                                    <span className="text-dark text-decoration-none" role="button">
                                        บล็อคของฉัน
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link href="/doctor/topics">
                                    <span className="text-dark text-decoration-none" role="button">
                                        จัดการTopics
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link href="/notifications">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="text-dark text-decoration-none" role="button">
                                            การแจ้งเตือน
                                        </span>
                                        {unreadNotifications > 0 && (
                                            <Badge pill bg="danger">
                                                {unreadNotifications}
                                            </Badge>
                                        )}
                                    </div>
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

export default DoctorNav;
