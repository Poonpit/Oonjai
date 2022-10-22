import { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useEffectOnce from "../hooks/use-effect-once";
import { serverUrl } from "../utils/serverApi";
import axios from "axios";
import { getTokenCookie } from "../utils/cookies";
import { toast } from "react-toastify";
import BlogNotification from "../components/Notification/BlogNotification";
import QuestionNotification from "../components/Notification/QuestionNotification";
import AnswerNotification from "../components/Notification/AnswerNotification";
import ReplyNotification from "../components/Notification/ReplyNotification";
import QuestionBannedNotification from "../components/Notification/QuestionBannedNotification";
import { useDispatch } from "react-redux";
import { profileActions } from "../store/store";

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { role } = useSelector((state) => state.profileSlice);

    const [notifications, setNotifications] = useState([]);

    const fetchNotificationsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/notifications", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setNotifications(data.notifications);
            await axios.patch(serverUrl + "/notifications/read", {}, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie()
                }
            })
            dispatch(profileActions.readNotification());
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchNotificationsHandler();
    });

    return (
        <Container className="px-5 mt-3 pb-3">
            <div
                className="mx-5 bg-light rounded-3 p-3"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <h3>Notifications</h3>
                <hr />
                <div className="px-4 py-2">
                    {notifications.map((notification) => {
                        if (notification.type === "BLOG") {
                            return <BlogNotification notification={notification} key={notification.id} />;
                        } else if (notification.type === "QUESTION") {
                            return <QuestionNotification notification={notification} role={role} key={notification.id} />;
                        } else if (notification.type === "ANSWER") {
                            return <AnswerNotification notification={notification} key={notification.id} />;
                        } else if (notification.type === "REPLY") {
                            return <ReplyNotification notification={notification} role={role} key={notification.id} />;
                        } else if (notification.type === "QUESTION_BANNED") {
                            return <QuestionBannedNotification notification={notification} key={notification.id} />;
                        }
                    })}
                </div>
            </div>
        </Container>
    );
};

export default NotificationsPage;
