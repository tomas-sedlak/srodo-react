import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Quiz from "templates/Quiz"
import axios from "axios";

export default function QuizRoute() {
    const { quizId } = useParams();

    const fetchQuiz = async () => {
        const quiz = await axios.get(`/api/quiz/${quizId}`)
        return quiz.data
    }

    const { data, status } = useQuery({
        queryFn: fetchQuiz,
        queryKey: ["quiz", quizId],
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <Quiz data={data} />
    )
}