import React from "react";
import { Navbar, Nav, Container, Dropdown, SplitButton, Badge } from "react-bootstrap";
import Link from "next/link";
import SearchBar from "../Searching/SearchBar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { profileActions } from "../../store/store";
import { getTokenCookie, removeTokenCookies } from "../../utils/cookies";
import { useRouter } from "next/router";
import { useState } from "react";
import useEffectOnce from "../../hooks/use-effect-once";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";

const AuthorizedNav = () => {
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
        <Link href="/profile">
            <div className="d-flex align-items-center">
                <img src={profileImageUrl} style={{ backgroundColor: "white", borderRadius: "50%", width: "35px" }} />
                <span className="text-light text-decoration-none ms-2">{name}</span>
            </div>
        </Link>
    );

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link href="/">
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
                            style={{ width: "14rem" }}
                            title={<ProfileComponent name={name} profileImageUrl={profileImageUrl} />}
                        >
                            <Dropdown.Item>
                                <Link href="/questions/create">
                                    <span className="text-dark text-decoration-none" role="button">
                                        สร้างคำถามใหม่
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link href="/questions/my-questions">
                                    <span className="text-dark text-decoration-none" role="button">
                                        คำถามของฉัน
                                    </span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link href="/assessment/history">
                                    <span className="text-dark text-decoration-none" role="button">
                                        ประวัติการทำแบบประเมิน
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

export default AuthorizedNav;
