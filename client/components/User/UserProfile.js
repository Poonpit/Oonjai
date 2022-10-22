import { useState } from "react";
import { Form } from "react-bootstrap";
import { PersonCheckFill, PersonXFill } from "react-bootstrap-icons";
import moment from "moment";
import UserQuestionsModal from "./UserQuestionsModal";

const UserProfile = ({ user }) => {
    const [isShow, setIsShow] = useState(false);

    const showModalHandler = () => {
        setIsShow(true);
    };

    const closeModalHandler = () => {
        setIsShow(false);
    };

    return (
        <div className="px-3">
            <UserQuestionsModal isShow={isShow} onCloseModalHandler={closeModalHandler} />
            <div className="text-center">
                <img
                    src={user.profileImageUrl}
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
            </div>
            <div>
                <Form.Group className="mb-2">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={user.email} readOnly />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={user.username} readOnly />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control type="date" readOnly />
                </Form.Group>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                    {user.is_verified ? (
                        <div className="d-flex align-items-center">
                            <PersonCheckFill style={{ color: "green", fontSize: "40px" }} />
                            <span className="text-success ms-1">Verified</span>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <PersonXFill style={{ color: "red", fontSize: "40px" }} />
                            <span className="text-danger ms-1 fw-bold">Not verify</span>
                        </div>
                    )}
                </div>
                <div>
                    <span className="text-muted">{moment(user.created_at).format("DD/MM/yyyy HH:mm")}</span>
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <button className="btn btn-outline-primary px-2 py-1" onClick={showModalHandler}>
                    Show questions
                </button>
                <button className="btn btn-danger px-4 py-1">แบน</button>
            </div>
        </div>
    );
};

export default UserProfile;
