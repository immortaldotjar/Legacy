import InterviewHeader from "../components/Interview/InterviewHeader";
import ProgressBar from "../components/Interview/ProgressBar";
import QuestionCard from "../components/Interview/QuestionCard";
import NavigationButtons from "../components/Interview/NavigationButtons";
import AnimatedQuestion from "../components/Interview/AnimatedQuestion";
import LoadingScreen from "../components/Loading/LoadingScreen";
import useInterview from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { generateLegacy } from "../services/api";

export default function Interview() {
    const {
        current,
        total,
        question,
        answers,
        updateAnswer,
        updateField,
        next,
        previous,
        clearInterview,
    } = useInterview();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const currentAnswer = answers[question.key];
    const isAnswered = typeof currentAnswer === "string" && currentAnswer.trim().length > 0;

    async function handleGenerate() {
        if (!isAnswered) return;

        try {
            setError(null);
            setLoading(true);

            const story = await generateLegacy(answers);

            localStorage.setItem(
                "legacy-story",
                JSON.stringify(story)
            );

            clearInterview();

            navigate("/story");
        } catch (err) {
            setError(err?.message || "The reel could not be cut. Try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-ink text-paper">

            <div className="mx-auto max-w-4xl px-6 py-20">

                <InterviewHeader />

                <ProgressBar
                    current={current}
                    total={total}
                />

                <AnimatedQuestion current={current}>

                    <QuestionCard
                        question={question}
                        value={answers[question.key]}
                        updateAnswer={updateAnswer}
                        answers={answers}
                        updateField={updateField}
                    />

                </AnimatedQuestion>

                {error && (
                    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-rec/40 bg-rec/10 p-5">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rec" />
                        <div>
                            <p className="font-medium text-paper">Recording failed</p>
                            <p className="mt-1 text-sm text-paper-dim">{error}</p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="ml-auto shrink-0 rounded-full border border-paper/20 px-4 py-2 text-sm transition hover:bg-paper/5"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <NavigationButtons
                    current={current}
                    total={total}
                    previous={previous}
                    next={next}
                    onGenerate={handleGenerate}
                    disabled={!isAnswered}
                />

            </div>

        </div>
    );
}
