import React from "react";
import Link from "next/link";
import moment from "moment";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";

const MyBlogItem = ({ blog, onDeleteBlogHandler }) => {
    return (
        <div className="d-flex p-2 rounded border my-1">
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
            <div className="ms-2 d-flex flex-column justify-content-between text-break w-100">
                <div className="d-flex align-items-center justify-content-between">
                    <Link href={`/blogs/${blog.id}`}>
                        <h5 role="button">{blog.title}</h5>
                    </Link>
                    <div className="d-flex align-items-center">
                        <Link href={`/blogs/edit/${blog.id}`}>
                            <PencilSquare
                                style={{
                                    fontSize: "25px",
                                    cursor: "pointer",
                                }}
                            />
                        </Link>
                        <Trash3
                            style={{
                                fontSize: "25px",
                                marginLeft: "4px",
                                cursor: "pointer",
                            }}
                            onClick={() => onDeleteBlogHandler(blog.id)}
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="badge bg-warning px-2">{blog.topic}</span>
                    </div>
                    <div>
                        <span className="text-muted">{moment(blog.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyBlogItem;
