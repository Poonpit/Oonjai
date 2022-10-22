import { useState } from "react";
import { Container } from "react-bootstrap";
import MyQuestionItem from "../../components/Question/MyQuestionItem";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";

const MyQuestionsPage = () => {
    const [questions, setQuestions] = useState([]);

    const fetchMyQuestionsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/questions/my-questions", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setQuestions(data.questions);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchMyQuestionsHandler();
    });

    const deleteQuestionHandler = async (id) => {
        alert("คุณต้องการที่จะลบคำถามนี้ไหม?");
        try {
            await axios.delete(serverUrl + "/questions/" + id, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            const filtered = questions.filter((q) => q.id !== id);
            setQuestions(filtered);
            toast("Deleted");
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    return (
        <Container>
            <div
                className="mx-5 px-5 bg-light rounded-3 pt-3"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <div>
                    <h3>My questions</h3>
                    <hr />
                    <div className="px-4 mt-2 pb-5">
                        {questions.map((question) => (
                            <MyQuestionItem
                                question={question}
                                key={question.id}
                                onDeleteQuestionHandler={deleteQuestionHandler}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default MyQuestionsPage;
