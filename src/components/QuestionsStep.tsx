import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import getFileContent from "utils/getFileContent";

type QuestionsStepProps = {
  onNext: () => void;
};

const QuestionsStep = ({ onNext }: QuestionsStepProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<string>(
    searchParams.get("questions") || ""
  );
  const [uploadedFile, setUploadedFile] = useState<File>();
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-5 h-full">
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
        <h2 className="text-xl md:text-5xl">Please provide your questions</h2>
        <p className="text-sm md:text-xl">Upload a file or type yourself</p>
        <div className="grid grid-cols-2 gap-5 items-center w-full h-full">
          <label
            htmlFor="question"
            className="border border-black h-4/5 col-span-2 md:col-span-1 cursor-pointer bg-gray-50 active:bg-gray-50 transition-all duration-100 hover:bg-gray-100 rounded relative"
          >
            <input
              type="file"
              name="question"
              id="question"
              accept=".doc, .docx, .pdf, .csv, .xlsx"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadedFile(file);
                const text = await getFileContent(file);
                setQuestions(text);
                setSearchParams((prev) => {
                  const urlParams = new URLSearchParams(prev.toString());
                  urlParams.set("questions", text);
                  return urlParams;
                });
              }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-1">
              <span className="border border-dashed p-2.5 border-gray-500 rounded">
                Upload Questions
              </span>
              <span className="text-sm">
                {uploadedFile ? `${uploadedFile.name}` : "Pdf, Doc, Csv"}
              </span>
            </div>
          </label>
          <textarea
            className="col-span-2 md:col-span-1 border h-4/5 p-5 bg-gray-50 hover:bg-gray-100 focus:outline outline-offset-1 border-black rounded"
            placeholder="Type or paste your questions here..."
            defaultValue={questions}
            onBlur={(e) => {
              setQuestions(e.target.value);
              setSearchParams((prev) => {
                const urlParams = new URLSearchParams(prev.toString());
                urlParams.set("questions", e.target.value);
                return urlParams;
              });
            }}
          ></textarea>
        </div>
        <div className="sticky bottom-0 flex justify-center items-center bg-white p-2.5 w-full">
          <button
            type="button"
            className="bg-black text-white rounded p-2.5 w-full mx-auto sm:w-1/2 disabled:opacity-40 hover:bg-opacity-75 transition-all duration-100 active:scale-95"
            onClick={onNext}
            disabled={!questions.length}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(QuestionsStep);
