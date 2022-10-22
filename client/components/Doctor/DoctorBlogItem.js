import moment from "moment";

const DoctorBlogItem = ({ blog }) => {
    return (
        <a
            href={`/admin/blogs/${blog.blog_id}`}
            style={{
                textDecoration: "none",
                color: "black",
            }}
            target="_blank"
            rel="noreferrer"
        >
            <div role="button" className="p-3 border border-bottom my-1">
                <h5>{blog.title.length > 64 ? blog.title.substring(0, 64) + "..." : blog.title}</h5>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="badge bg-warning px-2">{blog.topic}</span>
                    </div>
                    <div>
                        <span className="text-muted">{moment(blog.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default DoctorBlogItem;
