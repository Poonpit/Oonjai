import React from "react";
import { BodyText } from "react-bootstrap-icons";
import moment from "moment";
import Link from "next/link";
import { Alert } from "react-bootstrap";

const BlogNotification = ({ notification }) => {
    return (
        <Link href={`/blogs/${notification.blog_id}`}>
            <Alert variant="light" className="px-3 py-2 my-1 rounded border" role="button">
                <div>
                    <h5>
                        <BodyText style={{color: "black"}} /> มีบล็อคใหม่ในหัวข้อที่คุณสนใจ
                    </h5>
                </div>
                <div className="text-end">
                    <span className="text-muted">{moment(notification.created_at).fromNow()}</span>
                </div>
            </Alert>
        </Link>
    );
}

export default BlogNotification;
