import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import DoctorBlogItem from "./DoctorBlogItem";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import axios from "axios";
import useEffectOnce from "../../hooks/use-effect-once";
import { getTokenCookie } from "../../utils/cookies";

const DoctorBlogsModal = ({ isShow, onCloseBlogsModalHandler, doctorId }) => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + `/admin/doctors/${doctorId}/blogs`, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setBlogs(data.blogs);
        } catch (e) {
            toast.error(e);
        }
    };

    useEffect(() => {
        fetchBlogsHandler();
    }, [doctorId]);

    return (
        <Modal show={isShow} onHide={onCloseBlogsModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Blogs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="px-3">
                    {blogs.map((blog) => (
                        <DoctorBlogItem blog={blog} key={blog.id} />
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DoctorBlogsModal;
