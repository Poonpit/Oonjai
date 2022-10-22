import React from "react";
import Link from "next/link";

const RelateBlog = ({blog}) => {
    return (
        <Link href={`/blogs/${blog.id}`}>
            <div className="relate-blog-item my-2 d-flex" role="button">
                <div>
                    <img
                        src={blog.url}
                        style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                        }}
                    />
                </div>
                <div className="text-break ms-1">
                    <span className="badge rounded bg-warning">{blog.topic}</span>
                    <p>{blog.title}</p>
                </div>
            </div>
        </Link>
    );
};

export default RelateBlog;
