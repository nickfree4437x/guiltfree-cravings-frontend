import { Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

import type { CustomerVideo } from "../CustomerVideoStories";

interface CustomerVideoCardProps {
  video: CustomerVideo;
}

function CustomerVideoCard({
  video,
}: CustomerVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const element = videoRef.current;

    if (!element) return;

    if (element.paused) {
      void element.play();
      setIsPlaying(true);
    } else {
      element.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <article
      className="
        group
        relative
        w-full
        shrink-0
        overflow-hidden
        rounded-lg
        border
        border-[#EADBD0]
        bg-[#FBF7F2]
        shadow-sm
        sm:w-[70%]
        md:w-[48%]
        lg:w-[32%]
      "
    >
      {/* Video */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={
          isPlaying
            ? `Pause ${video.name}'s video`
            : `Play ${video.name}'s video`
        }
        className="
          relative
          block
          aspect-[9/13]
          w-full
          cursor-pointer
          overflow-hidden
          bg-[#F5EEE7]
          text-left
        "
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
          "
        />

        {/* Soft overlay */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/60
            via-black/5
            to-black/5
          "
        />

        {/* Play / Pause */}
        <span
          className="
            absolute
            left-1/2
            top-1/2
            flex
            h-14
            w-14
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-white/90
            text-[#B5697A]
            shadow-[0_8px_25px_rgba(0,0,0,0.18)]
            backdrop-blur-sm
            transition-all
            duration-300
            sm:h-16
            sm:w-16
          "
        >
          {isPlaying ? (
            <Pause
              className="h-5 w-5 fill-current sm:h-6 sm:w-6"
              strokeWidth={2}
            />
          ) : (
            <Play
              className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6"
              strokeWidth={2}
            />
          )}
        </span>

      </button>

      {/* Customer info */}
      {/* <div className="bg-white px-4 py-4 sm:px-5 sm:py-4.5">
        <div className="flex items-center gap-3">
          <span
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F8E8EC]
              text-[14px]
              font-semibold
              text-[#B5697A]
            "
          >
            {video.name.charAt(0).toUpperCase()}
          </span>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-[13.5px]
                font-semibold
                text-[#1F4A2E]
                sm:text-[14px]
              "
            >
              {video.name}
            </p>

            <div className="mt-0.5 flex items-center gap-1 text-[#8B7A6C]">
              <MapPin
                className="h-3 w-3"
                strokeWidth={2}
              />

              <span className="text-[10px] tracking-wide sm:text-[11px]">
                {video.city}
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </article>
  );
}

export default CustomerVideoCard;