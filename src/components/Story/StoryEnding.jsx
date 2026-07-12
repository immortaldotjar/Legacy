import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { generateStoryPdf } from "../../utils/generateStoryPdf";

export default function StoryEnding({

    ending,

    story

}) {

    const navigate = useNavigate();

    const [pdfStatus, setPdfStatus] = useState("idle"); // idle | working | error
    const [pdfLabel, setPdfLabel] = useState("");

    const handleDownload = async () => {
        if (!story || pdfStatus === "working") return;

        setPdfStatus("working");
        try {
            await generateStoryPdf(story, (status) => setPdfLabel(status));
            setPdfStatus("idle");
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            setPdfStatus("error");
        } finally {
            setPdfLabel("");
        }
    };

    return (

        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

            <p className="eyebrow text-xs text-paper-dim">End of Reel</p>

            <h2 className="mt-4 font-display text-5xl">

                The End

            </h2>

            <p className="mt-10 max-w-3xl font-display text-2xl italic leading-10 text-paper/80">

                {ending}

            </p>

            <div className="mt-20 flex flex-col items-center gap-4 sm:flex-row">

                <button

                    onClick={() => {

                        localStorage.removeItem("legacy-story");

                        navigate("/");

                    }}

                    className="flex items-center gap-2 rounded-full bg-paper px-8 py-4 font-medium text-ink transition hover:-translate-y-1"

                >
                    Record Another Story
                </button>

                {story && (
                    <button
                        onClick={handleDownload}
                        disabled={pdfStatus === "working"}
                        className="flex items-center gap-2 rounded-full border border-brass px-8 py-4 font-medium text-paper transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                        {pdfStatus === "working" ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {pdfLabel || "Preparing PDF…"}
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Download as PDF
                            </>
                        )}
                    </button>
                )}

            </div>

            {pdfStatus === "error" && (
                <p className="mt-6 text-sm text-rec">
                    Couldn't generate the PDF — please try again.
                </p>
            )}

        </section>

    )

}
