import axios from "axios";
import { useState } from "react";
import { Container, Image, FloatingLabel, Form } from "react-bootstrap";
import ChangePasswordModal from "../../components/Profile/ChangePasswordModal";
import TopicsModal from "../../components/Profile/TopicsModal";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import { useDispatch } from "react-redux";
import { profileActions } from "../../store/store";
import useEffectOnce from "../../hooks/use-effect-once";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const [oldUserData, setOldUerData] = useState({
        interested_in: []
    });
    const [userData, setUserData] = useState({
        interested_in: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isShowTopics, setIsShowTopics] = useState(false);

    const { id, email, name, url, birthday, interested_in } = userData;

    const openChangePasswordModalHandler = () => {
        setIsChangePassword(true);
    };

    const closeChangePasswordModalHandler = () => {
        setIsChangePassword(false);
    };

    const openTopicsModalHandler = () => {
        setIsShowTopics(true);
    };

    const closeTopicsModalHandler = () => {
        setIsShowTopics(false);
    };

    const fetchProfileHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/profile", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            const bd = new Date(data.birthday);
            setUserData({
                ...data,
                birthday: `${bd.getFullYear()}-${bd.getMonth() === 0 ? "01": bd.getMonth() < 10 ? "0"+bd.getMonth() : bd.getMonth()}-${bd.getDate() === 0 ? "01": bd.getDate() < 10 ? "0"+bd.getDate() : bd.getDate()}`
            });
            setOldUerData({
                ...data,
                birthday: `${bd.getFullYear()}-${bd.getMonth() === 0 ? "01": bd.getMonth() < 10 ? "0"+bd.getMonth() : bd.getMonth()}-${bd.getDate() === 0 ? "01": bd.getDate() < 10 ? "0"+bd.getDate() : bd.getDate()}`
            })
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchProfileHandler();
    });

    const removeAttentionHandler = async (topicId) => {
        const answer = window.confirm("คุณต้องการที่จะลบTopicนี้ออกไปหรือไม่");
        if (answer) {
            try {
                const { data } = await axios.delete(serverUrl + `/profile/attentions/remove/${topicId}`, {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                });
                const filtered = interested_in.filter((topic) => topic.id !== topicId);
                setUserData({
                    ...userData,
                    interested_in: filtered,
                });
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
    };

    const updateProfileHandler = async () => {
        try {
            const { data } = await axios.patch(serverUrl + `/profile`, userData, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            toast("Updated");
            setOldUerData(userData);
            dispatch(profileActions.updateProfile({name: userData.name}));
        } catch (e) {
            toast.error(e.response.data.message);
        }
        setIsEditing(false);
    };

    const userDataChangeHandler = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const addedNewTopics = (topics) => {
        console.log(topics);
        setUserData({
            ...userData,
            interested_in: topics,
        });
    };

    return (
        <Container className="px-5">
            <div className="px-5 py-3">
                <div className="row bg-light rounded-3 p-4 mx-5 mt-3">
                    <div className="col-4 p-4">
                        <div className="w-100 text-center">
                            <Image src={url} roundedCircle={true} style={{ width: "85%" }} />
                        </div>
                        <div className="mt-4">
                            <button
                                className="btn btn-outline-warning w-100 mb-2"
                                onClick={() => setIsEditing(true)}
                                disabled={isEditing}
                            >
                                แก้ไขโปรไฟล์
                            </button>
                            <button
                                className="btn btn-outline-danger w-100 mb-2"
                                onClick={openChangePasswordModalHandler}
                            >
                                เปลี่ยนรหัสผ่าน
                            </button>
                        </div>
                    </div>
                    <div className="col-8 mt-3">
                        <h1>Profile</h1>
                        <hr />
                        <div className="d-flex flex-column justify-content-between">
                            <div>
                                <FloatingLabel label="Email address" className="mb-3">
                                    <Form.Control type="email" placeholder="Email" value={email} disabled />
                                </FloatingLabel>
                                <FloatingLabel label="Username" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        name="name"
                                        onChange={userDataChangeHandler}
                                        readOnly={!isEditing}
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Birthday" className="mb-3">
                                    <Form.Control
                                        type="date"
                                        placeholder="Birthday"
                                        value={birthday}
                                        name="birthday"
                                        onChange={userDataChangeHandler}
                                        readOnly={!isEditing}
                                    />
                                </FloatingLabel>
                                <Form.Group className="mb-3">
                                    <Form.Label>Your attentions</Form.Label>
                                    <div>
                                        {interested_in.map((topic) => (
                                            <button
                                                className="btn btn-outline-success me-2"
                                                style={{ position: "relative" }}
                                                key={topic.id}
                                            >
                                                {topic.topic}
                                                <span
                                                    className="badge bg-danger"
                                                    style={{
                                                        position: "absolute",
                                                        right: -10,
                                                        top: -10,
                                                        borderRadius: "50%",
                                                    }}
                                                    onClick={() => removeAttentionHandler(topic.id)}
                                                >
                                                    X
                                                </span>
                                            </button>
                                        ))}
                                        <button className="btn btn-outline-success" onClick={openTopicsModalHandler}>
                                            +
                                        </button>
                                    </div>
                                </Form.Group>
                            </div>
                            {isEditing && (
                                <div className="text-end">
                                    <button
                                        className="btn btn-danger me-2"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setUserData(oldUserData);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary" onClick={updateProfileHandler}>
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isChangePassword && (
                <ChangePasswordModal
                    isChangePassword={isChangePassword}
                    onCloseChangePasswordModalHandler={closeChangePasswordModalHandler}
                />
            )}
            {isShowTopics && (
                <TopicsModal
                    onAddedNewTopics={addedNewTopics}
                    isShowTopics={isShowTopics}
                    onCloseTopicModalHandler={closeTopicsModalHandler}
                    interested_in={interested_in}
                />
            )}
        </Container>
    );
};

export default ProfilePage;
