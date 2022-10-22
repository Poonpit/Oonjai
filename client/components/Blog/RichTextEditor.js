import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor = ({ content, setContent }) => {
    return (
        <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Type something.."
            style={{
                height: "20rem",
                marginBottom: "3.5rem"
            }}
            theme="snow"
            id="rich-text-editor"
        />
    );
};

export default RichTextEditor;
