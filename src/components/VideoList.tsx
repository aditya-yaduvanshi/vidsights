import React from "react";

export type VideoType = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
};

type VideoListProps = {
  videos: VideoType[];
  checkedVideos: string[];
  onCheck: (id: string) => void;
};

const VideoList = ({
  videos = [],
  checkedVideos = [],
  onCheck,
}: VideoListProps) => {
  return (
    <>
      <section className="grid grid-cols-3 gap-5 p-5">
        {videos.map((video) => {
          const isChecked = checkedVideos.includes(video.id);
          return (
            <article
              key={video.id}
              className={`border col-span-1 relative rounded-lg overflow-hidden ${
                isChecked ? "border-black" : ""
              }`}
            >
              <label htmlFor={`video-${video.id}`} className="w-full h-full">
                <input
                  type="checkbox"
                  name="seleted"
                  value={video.id}
                  id={`video-${video.id}`}
                  checked={isChecked}
                  className="absolute top-2.5 left-2.5 w-10 h-10"
                  onChange={() => onCheck(video.id)}
                />
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="aspect-video w-full object-center"
                />
                <div className="p-5">
                  <h2>{video.title}</h2>
                  <p>{video.channel}</p>
                  <p className="line-clamp-1">{video.description}</p>
                </div>
              </label>
            </article>
          );
        })}
      </section>
    </>
  );
};

export default React.memo(VideoList);
