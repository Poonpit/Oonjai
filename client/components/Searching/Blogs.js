import React from "react";
import Link from "next/link";
import moment from "moment";
import { EyeFill } from "react-bootstrap-icons";

const Blogs = ({ blogs }) => {
    return (
        <div>
            {blogs.map((blog) => (
                <Link href={`/blogs/${blog.id}`} key={blog.id}>
                    <div className="relate-blog-item d-flex border my-1 p-2 position-relative" role="button">
                        <span
                            className="badge bg-warning px-2"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        >
                            {blog.topic}
                        </span>
                        <div>
                            <img
                                src={blog.url}
                                style={{
                                    width: "180px",
                                    height: "120px",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <div className="d-flex flex-column justify-content-between ms-2 w-100 text-break">
                            <div>
                                <h6>{blog.title}</h6>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <EyeFill style={{ fontSize: "20px" }} />
                                    <span className="ms-1">{blog.views}</span>
                                </div>
                                <div>
                                    <span className="text-muted">{moment(blog.created_at).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Blogs;
