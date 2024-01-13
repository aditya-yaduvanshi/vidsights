import { QUESTION_SEPARATOR } from "consts/app";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import getAnswersFromVideos from "utils/getAnswersFromVideos";
import getDocFromText from "utils/getDocFromText";
import getTextFromAnswers from "utils/getTextFromAnswers";
import handleDownload from "utils/handleDownload";

const AnswersStep = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [answers, setAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const questions = searchParams.get("questions")?.split(QUESTION_SEPARATOR);
    if (!questions || !questions.length) {
      setError("No questions found!");
      return;
    }
    const videos = searchParams.get("selected")?.split(",");
    if (!videos || !videos.length) {
      setError("No videos found!");
      return;
    }
    setError("");
    setLoading(true);
    getAnswersFromVideos({ videos, questions })
      .then((res) => {
        setAnswers(res);
        if (res.length) {
        }
      })
      .catch((_err) => {
        setError("Facing problem generating answers.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-5 h-full overflow-y-auto">
        <button
          className="hover:underline self-start"
          onClick={() =>
            setSearchParams((prev) => {
              const urlParams = new URLSearchParams(prev.toString());
              urlParams.set("step", "selectVideos");
              return urlParams;
            })
          }
        >
          &larr; Back
        </button>
        <h2 className="text-5xl">Here are the answers to your questions</h2>
        <p className="text-xl">Copy or download the document file</p>
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center text-xl">
            Loading...
          </div>
        )}
        {error && (
          <div className="w-full h-full gap-5 flex flex-col justify-center items-center">
            <p className="text-xl text-red-500">{error}</p>
            <button
              type="button"
              className="border rounded bg-black text-white px-5 py-2.5"
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
            >
              Start Over
            </button>
          </div>
        )}
        {answers.length ? (
          <ul className="h-full flex flex-col gap-2.5">
            <li className="inline-flex justify-between items-center">
              <button
                type="button"
                className="border border-black text-black p-2.5 rounded hover:bg-black hover:bg-opacity-5 transition-all duration-100 active:scale-95"
                onClick={() => {
                  navigator.clipboard.writeText(
                    getTextFromAnswers({ answers })
                  );
                }}
              >
                Copy Answers
              </button>
              <button
                type="button"
                className="bg-black text-white p-2.5 rounded hover:bg-opacity-75 transition-all duration-100 active:scale-95"
                onClick={async () => {
                  const text = getTextFromAnswers({ answers, type: "html" });
                  const source = await getDocFromText(text);
                  handleDownload({ source, fileName: "download.doc" });
                }}
              >
                Download Answers
              </button>
            </li>
            {answers.map((item, i) => (
              <li key={i} className="border p-2.5">
                <h3>
                  <strong>Que ${i + 1}. </strong>
                  {item.question}
                </h3>
                <p>
                  <strong>Ans {i + 1}. </strong>
                  {item.answer}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default React.memo(AnswersStep);
