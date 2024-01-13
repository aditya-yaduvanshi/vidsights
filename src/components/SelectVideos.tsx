import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoList, { VideoType } from "./VideoList";
import SearchForm from "./SearchForm";

type SelectVideosProps = {
  onNext: () => void;
};

const SelectVideos = ({ onNext }: SelectVideosProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Map<string, VideoType>>(new Map());
  const [nextPageToken, setNextPageTokens] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedVideos, setCheckedVideos] = useState<string[]>(
    searchParams.get("selected")?.split(",") || []
  );

  const handleCheck = useCallback(
    (id: string) => {
      setCheckedVideos((prev) => {
        let value = prev;

        if (prev.includes(id)) value = prev.filter((video) => video !== id);
        else value = [...prev, id];

        const urlParams = new URLSearchParams(searchParams);
        urlParams.set("selected", value.join(","));
        setSearchParams(urlParams.toString());

        return value;
      });
    },
    [searchParams]
  );

  const search = useCallback(
    async (searchKey?: string) => {
      setError(null);
      setLoading(true);
      try {
        const query = searchParams.get("query") || "";
        const ytParams = new URLSearchParams();

        ytParams.set("key", import.meta.env.VITE_YOUTUBE_API_KEY);
        ytParams.set("part", "snippet");
        ytParams.set("type", "video");
        ytParams.set("maxResults", "9");
        ytParams.set("pageToken", nextPageToken);
        ytParams.set("q", searchKey || query);

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${ytParams.toString()}`
        );
        const data = await res.json();

        setNextPageTokens(data.nextPageToken);

        const videos = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

        setResults((prev) => {
          const newResults = (
            query === searchKey ? [...prev.values(), ...videos] : videos
          ) as VideoType[];
          const newResultsMap = new Map();
          newResults.forEach((video) => newResultsMap.set(video.id, video));
          return newResultsMap;
        });

        setSearchParams((prev) => {
          if (prev.get("query") !== searchKey)
            prev.set("query", searchKey || query);
          return new URLSearchParams(prev.toString());
        });
      } catch (err) {
        setError("We are sorry but facing problems fetching videos.");
      } finally {
        setLoading(false);
      }
    },
    [nextPageToken, searchParams.get("query")]
  );

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) search(query);
  }, []);

  return (
    <div className="flex flex-col gap-5 relative h-full min-h-screen">
      <SearchForm
        onSearch={search}
        initialQuery={searchParams.get("query") || ""}
      />
      <h2 className="text-semibold">Search Results</h2>
      <VideoList
        videos={[...results.values()]}
        checkedVideos={checkedVideos}
        onCheck={handleCheck}
      />
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center text-xl">
          Loading...
        </div>
      )}
      {error && (
        <div className="w-full h-full flex justify-center items-center text-xl text-red-500">
          {error}
        </div>
      )}
      {nextPageToken ? (
        <button
          type="button"
          className="text-black border border-black rounded py-2.5 px-5 mx-auto disabled:opacity-40"
          onClick={() => search()}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      ) : null}
      <div className="sticky bottom-0 flex justify-center items-center bg-white p-2.5 w-full">
        <button
          type="button"
          className="bg-black text-white rounded p-2.5 w-full mx-auto sm:w-1/2 disabled:opacity-40"
          onClick={onNext}
          disabled={!checkedVideos.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default React.memo(SelectVideos);
