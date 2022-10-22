import { useState } from "react";
import QuestionItem from "../Question/QuestionItem";
import { useSelector } from "react-redux";
import useEffectOnce from "../../hooks/use-effect-once";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";

const LatestTopicQuestions = ({ topicId }) => {
    const { role } = useSelector((state) => state.profileSlice);
    const [questions, setQuestions] = useState([]);
    const [isShowMore, setIsShowMore] = useState(false);

    const fetchQuestionsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + `/topics/${topicId}/questions`);
            setQuestions(data.questions);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchQuestionsHandler();
    });

    return (
        <div className="p-3 border rounded">
            <h5>คำถามล่าสุด</h5>
            {questions.slice(0, isShowMore ? questions.length : 5).map((question) => (
                <QuestionItem isDoctor={role === "doctor"} question={question} key={question.id} />
            ))}
            {!isShowMore && questions.length > 4 && (
                <div className="my-2 text-center">
                    <button className="btn btn-warning text-light" onClick={() => setIsShowMore(true)}>
                        Show more
                    </button>
                </div>
            )}
        </div>
    );
};

export default LatestTopicQuestions;
