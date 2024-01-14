import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useInsightsSessions from "hooks/useInsightsSessions";
import getAnswerForQuestion from "utils/getAnswerForQuestion";
import SelectVideos from "components/SelectVideos";

const Interact = () => {
  const params = useParams();
  const inputRef = useRef() as React.RefObject<HTMLTextAreaElement>;
  const lastMessageRef = useRef() as React.RefObject<HTMLLIElement>;
  const [sidebar, setSidebar] = useState({
    isSessions: window.innerWidth < 992 ? false : true,
    isVideos: window.innerWidth < 720 ? false : true,
  });
  const [isLoadingAnswer, setLoadingAnswer] = useState(false);
  const { getSession, insightsSessions, updateSession } =
    useInsightsSessions();

  const session = getSession(Number(params.id));

  const askQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value || !session?.videos) return;

    setLoadingAnswer(true);

    const qa = await getAnswerForQuestion({
      question: inputRef.current.value,
      videos: session?.videos,
    });

    updateSession(session.id, { answers: [...session.answers, qa] });

    setLoadingAnswer(false);

    inputRef.current.value = "";
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col w-full h-full min-h-screen overflow-hidden">
        <nav className="text-white py-2.5 px-10 z-20 w-full bg-black bg-opacity-85 flex items-center justify-between shadow-lg">
          <button
            type="button"
            onClick={() =>
              setSidebar((prev) => ({ ...prev, isSessions: !prev.isSessions }))
            }
          >
            Sessions
          </button>
          <h2 className="text-lg">Vidsights</h2>
          <button
            type="button"
            onClick={() =>
              setSidebar((prev) => ({ ...prev, isVideos: !prev.isVideos }))
            }
          >
            Videos
          </button>
        </nav>
        <main className="grid grid-cols-6 h-[calc(100vh-48px)]">
          <aside
            className={`${
              sidebar.isSessions ? "col-span-1 flex z-10" : "hidden"
            } border-r flex-col gap-2.5 p-2.5 bg-black bg-opacity-75 overflow-y-auto`}
          >
            {insightsSessions.map((session) => (
              <Link
                to={`/interact/${session.id}`}
                key={session.id}
                className={`${
                  session.id.toString() === params.id
                    ? "border-white"
                    : "border-transparent"
                } p-2.5 border active:scale-95 transition-all duration-100 rounded flex flex-col text-white hover:bg-opacity-50 bg-black bg-opacity-75`}
              >
                <strong className="truncate">{session.query}</strong>
                <span className="text-xs truncate">
                  {new Date(session.updatedAt).toString()}
                </span>
              </Link>
            ))}
          </aside>
          <section
            className={`col-span-3 relative overflow-y-auto bg-gray-100`}
          >
            <ul className="h-full py-5 px-2.5 gap-1">
              {session?.answers.map((item, i) => (
                <li key={i} className="flex flex-col gap-1 p-1">
                  <span className="max-w-[90%] ml-auto p-2 bg-slate-200 rounded-xl rounded-bl-none">
                    {item.question}
                  </span>
                  {item.answer ? (
                    <span className="max-w-[90%] mr-auto p-2 bg-zinc-200 rounded-xl rounded-br-none">
                      {item.answer}
                    </span>
                  ) : null}
                </li>
              ))}
              <li ref={lastMessageRef}></li>
            </ul>
            <form
              onSubmit={askQuestion}
              className="w-full border-t flex items-center bg-white justify-center gap-2.5 p-2.5 sticky bottom-0"
            >
              <textarea
                id="query"
                name="qeury"
                required
                ref={inputRef}
                disabled={isLoadingAnswer}
                placeholder="Search..."
                className="border disabled:opacity-40 py-2 px-2.5 border-black rounded outline-black -outline-offset-2 w-full h-[42px] min-h-[42px] max-h-48"
              ></textarea>
              <button
                type="submit"
                disabled={isLoadingAnswer}
                className="border disabled:opacity-40 self-end bg-black whitespace-nowrap rounded text-white px-2.5 py-2 hover:bg-opacity-75 transition-all duration-100 active:scale-95"
              >
                {isLoadingAnswer ? "Sending..." : <>Send &rarr;</>}
              </button>
            </form>
          </section>
          <aside
            className={`${
              sidebar.isVideos ? "col-span-2 z-10" : "hidden"
            } border-l overflow-y-auto p-2.5 pb-0`}
          >
            {/* <VideoList /> */}
            <SelectVideos onNext={() => {}} />
          </aside>
        </main>
      </div>
    </>
  );
};

export default React.memo(Interact);
