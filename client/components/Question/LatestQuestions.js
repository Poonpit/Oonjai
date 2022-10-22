import axios from "axios";
import {useState} from "react";
import useEffectOnce from "../../hooks/use-effect-once";
import { serverUrl } from "../../utils/serverApi";
import QuestionItem from "./QuestionItem";


const LatestQuestions = ({ isDoctor }) => {
    const [questions, setQuestions] = useState([]);

    const fetchLatestQuestions = async () => {
        try {
            const {data} = await axios.get(serverUrl + "/questions/latest");
            setQuestions(data.questions);
            console.log(data);
        }catch(e) {
            console.log(e)
        }
    }

    useEffectOnce(() => {
        fetchLatestQuestions();
    })

    return (
        <div className="py-3 px-4">
            <h3>Latest questions</h3>
            <hr />
            <div>
                {questions.map((question) => (
                    <QuestionItem question={question} isDoctor={isDoctor} key={question.id} />
                ))}
            </div>
        </div>
    );
};

export default LatestQuestions;
