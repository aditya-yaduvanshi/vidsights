import AnswersStep from "components/AnswersStep";
import QuestionsStep from "components/QuestionsStep";
import SelectVideos from "components/SelectVideos";
import React from "react";
import { useSearchParams } from "react-router-dom";
import getExtractedQuestions from "utils/getExtractedQuestions";

const VideoInsights = () => {
  const [params, setParams] = useSearchParams();
  const step = params.get("step");

  return (
    <>
      <main className="p-5 h-full w-full">
        {step === "answers" && <AnswersStep />}
        {step === "questions" && (
          <QuestionsStep
            onNext={() =>
              setParams((prev) => {
                const searchParams = new URLSearchParams(prev.toString());
                const questions = searchParams.get("questions") || "";
                const qs = getExtractedQuestions(questions);
                if (!qs.length) {
                  alert("No questions found. Please provide questions.");
                } else {
                  searchParams.set("step", "answers");
                  searchParams.set("questions", qs.join(" "));
                }
                return searchParams;
              })
            }
          />
        )}
        {(!step || step === "selectVideos") && (
          <SelectVideos
            onNext={() =>
              setParams((prev) => {
                const searchParams = new URLSearchParams(prev.toString());
                searchParams.set("step", "questions");
                return searchParams;
              })
            }
          />
        )}
      </main>
    </>
  );
};

export default React.memo(VideoInsights);
