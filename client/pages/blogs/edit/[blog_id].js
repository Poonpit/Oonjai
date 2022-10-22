import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import RichTextEditor from "../../../components/Blog/RichTextEditor";
import useEffectOnce from "../../../hooks/use-effect-once";
import { serverUrl } from "../../../utils/serverApi";
import axios from "axios";
import { getTokenCookie } from "../../../utils/cookies";
import { useRouter } from "next/router";
import { resizeImage } from "../../../utils/imageResizer";
import { toast } from "react-toastify";

const EditBlogPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [blogData, setBlogData] = useState({
        title: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [content, setContent] = useState("");

    const editBlogHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.patch(
                serverUrl + `/blogs/${router.query.blog_id}/update`,
                { ...blogData, content },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            toast(data.message);
            if (data.url) {
                setImagePreview(data.url);
            }
            setBlogData({
                ...blogData,
                image: "",
            });
        } catch (e) {
            toast.error(e.response.data.message);
        }
        setIsLoading(false);
    };

    const fetchBlogHandler = async (id) => {
        try {
            const { data } = await axios.get(serverUrl + `/blogs/${id}`, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setBlogData({
                title: data.blog.title,
                image: "",
            });
            setContent(data.blog.content);
            setImagePreview(data.blog.blog_url);
        } catch (e) {
            console.log(e);
        }
    };

    const titleChangeHandler = (e) => {
        setBlogData({
            ...blogData,
            title: e.target.value,
        });
    };

    const imageChangeHandler = async (e) => {
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(file));
        const base64 = await resizeImage(file);
        setBlogData({
            ...blogData,
            image: base64,
        });
    };

    useEffect(() => {
        if (router.query.blog_id) {
            fetchBlogHandler(router.query.blog_id);
        }
    }, [router.query.blog_id]);

    return (
        <Container>
            <div
                className="px-5 mt-3 bg-light rounded-2 mx-5 py-5"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <h2>แก้ไขบล็อค</h2>
                <hr />
                <div className="mb-2">
                    <span>Title</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        onChange={titleChangeHandler}
                        value={blogData.title}
                    />
                </div>
                <div className="mb-3">
                    <span>รูปภาพ</span>
                    <input type="file" className="form-control w-50" accept="image/*" onChange={imageChangeHandler} />
                    <div>
                        <img
                            src={imagePreview}
                            style={{
                                width: "550px",
                                height: "320px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <span>เนื้อหา</span>
                    <RichTextEditor content={content} setContent={setContent} />
                </div>
                <div className="text-end">
                    <button className="btn btn-outline-primary px-5" onClick={editBlogHandler} disabled={isLoading}>
                        {isLoading ? "Editing.." : "Edit"}
                    </button>
                </div>
            </div>
        </Container>
    );
};

export default EditBlogPage;
