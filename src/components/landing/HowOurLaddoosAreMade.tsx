import { useRef, useState } from "react";
import {
  Play,
} from "lucide-react";

const DUMMY_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

function HowOurLaddoosAreMade() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  // const processSteps = [
  //   {
  //     icon: Flame,
  //     label: "Slow Roasted",
  //     sub: "Low flame, deep flavour",
  //   },
  //   {
  //     icon: Hand,
  //     label: "Hand Rolled",
  //     sub: "Small batch, daily",
  //   },
  //   {
  //     icon: Package,
  //     label: "Freshly Packed",
  //     sub: "Sealed with care",
  //   },
  // ];

  return (
    <section
      id="how-our-laddoos-are-made"
      className="relative overflow-hidden bg-[#FFF9F5] py-6 sm:py-8 md:py-8"
    >
      {/* ================= STYLES ================= */}
      <style>
        {`
          @keyframes howFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseRing {
            0%   { transform: scale(1);   opacity: 0.6; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          .how-fadeUp { animation: howFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .pulse-ring  { animation: pulseRing 2s ease-out infinite; }

          /* Custom video controls accent */
          video::-webkit-media-controls-panel {
            background-image: linear-gradient(transparent, rgba(0,0,0,0.7)) !important;
          }
          video::-webkit-media-controls-play-button,
          video::-webkit-media-controls-mute-button,
          video::-webkit-media-controls-fullscreen-button {
            filter: brightness(1.2);
          }

          @media (prefers-reduced-motion: reduce) {
            .how-fadeUp, .pulse-ring { animation: none !important; }
          }
        `}
      </style>


      <div className="relative mx-auto w-full max-w-[1360px] px-6 sm:px-10 md:px-14 lg:px-20">

        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="mx-auto max-w-3xl text-center">

          {/* Heading */}
          <h2 className="anim-fadeUp delay-2  text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide leading-snug md:whitespace-nowrap text-[#C9788B]">
            How Our Laddoos Are Made
          </h2>

          {/* Sparkle Divider */}
          <div className="mx-auto mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#B5697A]/50 to-[#B5697A]/80 sm:w-16" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-[#B5697A]"
              fill="currentColor"
            >
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
            <span className="h-px w-12 bg-gradient-to-l from-transparent via-[#B5697A]/50 to-[#B5697A]/80 sm:w-16" />
          </div>

          {/* Description */}
          <p className="mt-2 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#2c2c2c]">
            Slow-roasted on low heat, warm with{" "}
            <span className="text-[#B5697A]">Desi Ghee</span>
            , hand-rolled with love. Real craft, zero shortcuts.
          </p>
        </div>

        {/* =========================================================
            VIDEO CARD — smaller max-width (centered)
        ========================================================= */}
        <div className="how-fadeUp relative mx-auto mt-8 max-w-[900px] sm:mt-10">

          {/* Main card */}
          <div
            className="
              relative rounded-[24px] border border-[#EFE3D2] bg-white
              p-2 shadow-sm
              sm:rounded-2xl sm:p-3
            "
          >
            <div
              className="
                group relative aspect-video
                overflow-hidden rounded-[15px]
                bg-[#1F1B18]
                sm:rounded-xl
              "
            >
              {/* ============================================
                  VIDEO — with YouTube-like attributes
              ============================================ */}
              <video
                ref={videoRef}
                src={DUMMY_VIDEO_URL}
                playsInline
                preload="metadata"
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture={false}
                disableRemotePlayback={false}
                onEnded={handleVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="absolute inset-0 h-full w-full object-cover"
              >
                {/* Fallback for old browsers */}
                Your browser does not support the video tag.
              </video>

              {/* ============ CUSTOM OVERLAY (hidden when controls active) ============ */}
              {/* Dark overlay — only when NOT playing (paused state) */}
              <div
                className={`
                  pointer-events-none absolute inset-0 z-[5]
                  bg-gradient-to-t from-black/70 via-black/20 to-black/30
                  transition-opacity duration-500
                  ${isPlaying ? "opacity-0 group-hover:opacity-40" : "opacity-100"}
                `}
              />

              {/* Center Play/Pause button (only when NOT playing) */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={handlePlayPause}
                  aria-label="Play video"
                  className="
                    group/play absolute left-1/2 top-1/2 z-20
                    flex h-12 w-12 -translate-x-1/2 -translate-y-1/2
                    items-center justify-center
                    rounded-full
                    border-2 border-white/90
                    bg-[#B5697A]
                    text-white
                    shadow-[0_8px_30px_rgba(181,105,122,0.45)]
                    transition-all duration-300
                     hover:bg-[#A55F70]
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-white focus-visible:ring-offset-2
                    focus-visible:ring-offset-transparent
                    sm:h-20 sm:w-20
                  "
                >
                  <span
                    aria-hidden="true"
                    className="pulse-ring absolute inset-0 rounded-full border-2 border-white/60"
                  />
                  <Play
                    className="ml-0.5 h-6 w-6 sm:h-7 sm:w-7"
                    fill="currentColor"
                    strokeWidth={1.8}
                  />
                </button>
              )}

              {/* Bottom info bar (only when NOT playing) */}
              {!isPlaying && (
                <div
                  className="
                    pointer-events-none absolute inset-x-0 bottom-0 z-10
                    flex items-end justify-between gap-3
                    bg-gradient-to-t from-black/80 via-black/40 to-transparent
                    px-4 pb-4 pt-16
                    sm:px-6 sm:pb-5 sm:pt-20
                  "
                >
                  <div className="min-w-0">
                    <p className="mt-1 text-[10px] leading-tight text-white drop-shadow-sm sm:text-[12px]">
                      Slow Roasted Grains • Desi Ghee • Jaggery & Dates
                    </p>
                  </div>

                  <span
                    className="
                      hidden shrink-0 rounded-full border border-white/20
                      bg-white/10 px-3 py-1
                      text-[10px] uppercase tracking-[0.14em]
                      text-white backdrop-blur-md
                      sm:block sm:text-[11px]
                    "
                  >
                    GuiltFree Kitchen
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>


      </div>
    </section>
  );
}

export default HowOurLaddoosAreMade;