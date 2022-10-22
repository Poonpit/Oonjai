import { Container, Badge } from "react-bootstrap";
import Link from "next/link";
import moment from "moment";
import { ArrowRightCircle, EyeFill } from "react-bootstrap-icons";
import RelateBlog from "../../components/blog/RelateBlog";
import LatestQuestions from "../../components/Question/LatestQuestions";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import renderHTML from "react-render-html";

const BlogPage = () => {
    const [blog, setblog] = useState({});
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    let isFetched = false;
    const router = useRouter();

    const fetchblogHandler = async (blogId) => {
        try {
            const { data } = await axios.get(serverUrl + `/blogs/${blogId}`);
            setblog(data.blog);
            fetchRelatedBlogs(data.blog.topic_id);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    const fetchRelatedBlogs = async (topic_id) => {
        try {
            const { data } = await axios.get(serverUrl + `/blogs/topics/${topic_id}/related-blogs`);
            setRelatedBlogs(data.blogs);
            await axios.patch(serverUrl + `/blogs/${router.query.blog_id}/increase/views`);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffect(() => {
        if (router.query.blog_id && !isFetched) {
            fetchblogHandler(router.query.blog_id);
        }
    }, [router.query.blog_id]);

    return (
        <Container>
            <div className="d-flex mt-3 mx-5">
                <div className="w-75 px-5 mb-4 py-3 bg-light rounded-3 position-relative">
                    <Badge
                        pill
                        bg="warning"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: -10,
                        }}
                        className="px-3 py-2"
                    >
                        <Link href={`/topics/${blog.topic_id}`}>
                            <span role="button">{blog.topic}</span>
                        </Link>
                    </Badge>
                    <h4>{blog.title}</h4>
                    <hr />
                    <div>
                        <div className="w-100 text-center">
                            <img
                                src={blog.blog_url}
                                style={{
                                    width: "500px",
                                    height: "300px",
                                    objectFit: "cover",
                                }}
                                className="mx-auto"
                            />
                        </div>
                        <div className="mt-3">{renderHTML(blog.content || "")}</div>
                        <hr />
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                            <Link href={`/doctor/profile/${blog.doctor_id}`}>
                                <div className="d-flex align-items-center" role="button">
                                    <img
                                        src={blog.profile_url}
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <span className="ms-1">{blog.name}</span>
                                </div>
                            </Link>

                            <div className="d-flex align-items-center">
                                <EyeFill style={{ fontSize: "25px", cursor: "pointer" }} />
                                <span className="ms-1">{blog.views}</span>
                            </div>
                            <div>
                                <span className="text-muted">{moment(blog.created_at).format("DD/MM/yyy HH:mm")}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-25 ms-3 mb-4 rounded bg-light py-3 px-2 h-100">
                    <h5>blogที่เกี่ยวข้อง</h5>
                    <hr />
                    <div>
                        {relatedBlogs.map((blog) => (
                            <RelateBlog blog={blog} key={blog.id} />
                        ))}
                        <div>
                            <Link href={`/topics/${blog.topic_id}`}>
                                <a className="d-flex align-items-center justify-content-end">
                                    <span>ดูบล็อคเพิ่มเติมในหัวข้อนี้</span>
                                    <ArrowRightCircle className="ms-1" />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default BlogPage;
