import { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchBar from "../Searching/SearchBar";

const UnauthorizedNav = () => {
    const router = useRouter();
    const [pathname, setPathname] = useState("/");

    useEffect(() => {
        setPathname(router.pathname);
    }, [router.pathname]);

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
                    <div className="d-flex align-items-center justify-content-between">
                        <Link href="/login">
                            <span
                                className={`text-light text-decoration-none ${pathname === "/login" && "fw-bolder"}`}
                                role="button"
                            >
                                Login
                            </span>
                        </Link>
                        <Link href="/register">
                            <span
                                className={`text-light text-decoration-none ms-3 ${
                                    pathname === "/register" && "fw-bolder"
                                }`}
                                role="button"
                            >
                                Register
                            </span>
                        </Link>
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default UnauthorizedNav;
