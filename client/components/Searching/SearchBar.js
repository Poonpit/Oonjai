import { useState } from "react";
import { Form } from "react-bootstrap";
import { useRouter } from "next/router";

const SearchBar = () => {
    const router = useRouter();
    const [key, setKey] = useState("");

    const searchHandler = (e) => {
        if (key.trim() !== "") {
            router.push(`/search?key=${key}`);
        }
        e.preventDefault();
    };

    return (
        <Form onSubmit={searchHandler}>
            <Form.Control
                type="text"
                placeholder="ค้นหา"
                style={{
                    width: "16rem",
                    borderRadius: "2rem",
                    margin: "0 auto",
                    padding: "8px 15px",
                }}
                onChange={(e) => setKey(e.target.value)}
                value={key}
            />
        </Form>
    );
};

export default SearchBar;
