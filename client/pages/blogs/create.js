import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import RichTextEditor from "../../components/Blog/RichTextEditor";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";
import { resizeImage } from "../../utils/imageResizer";

const CreateBlogPage = () => {
    const [data, setData] = useState({
        title: "",
        image: null,
        selectedTopicId: "",
    });
    const [content, setContent] = useState("");
    const { title, image, selectedTopicId } = data;
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTopicsHandler = async () => {
        try {
            const res = await axios.get(serverUrl + "/topics");
            setTopics(res.data.topics);
            setData({
                ...data,
                selectedTopicId: res.data.topics[0] ? res.data.topics[0].id: null,
            });
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchTopicsHandler();
    });

    const createNewBlogHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(
                serverUrl + "/blogs/create",
                { ...data, content },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            setData({
                title: "",
                image: topics[0].id,
                selectedTopicId: "",
            });
            setContent("");
            toast("Created");
        } catch (e) {
            toast.error(e.response.data.message);
        }
        setIsLoading(false);
    };

    const dataChangeHandler = async (e) => {
        const { name, value } = e.target;
        if (name === "image") {
            const file = e.target.files[0];
            const base64 = await resizeImage(file);
            return setData({
                ...data,
                image: base64,
            });
        }
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <Container>
            <div
                className="px-5 mt-3 bg-light rounded-2 mx-5 py-5"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <h1>สร้างBlogใหม่</h1>
                <hr />
                <div className="mb-2">
                    <span>Title</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={dataChangeHandler}
                    />
                </div>
                <div className="mb-3">
                    <span>รูปภาพ</span>
                    <input
                        type="file"
                        className="form-control w-50"
                        accept="image/*"
                        name="image"
                        onChange={dataChangeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <span>เนื้อหา</span>
                    <RichTextEditor content={content} setContent={setContent} />
                </div>
                <div className="mb-3 w-50">
                    <Form.Group className="mb-2">
                        <Form.Label>Select topic</Form.Label>
                        <Form.Select
                            value={selectedTopicId}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    selectedTopicId: e.target.value,
                                })
                            }
                        >
                            {topics.map((topic) => (
                                <option value={topic.id} key={topic.id}>
                                    {topic.topic}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="text-end">
                    <button
                        className="btn btn-outline-primary px-5"
                        onClick={createNewBlogHandler}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating.." : "Create"}
                    </button>
                </div>
            </div>
        </Container>
    );
};

export default CreateBlogPage;
