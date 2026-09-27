import type { RefObject } from "react";

import type { CustomerVideo } from "../CustomerVideoStories";

import CustomerVideoCard from "./CustomerVideoCard";

interface CustomerVideoGridProps {
  videos: CustomerVideo[];
  scrollRef: RefObject<HTMLDivElement | null>;
}

function CustomerVideoGrid({
  videos,
  scrollRef,
}: CustomerVideoGridProps) {
  return (
    <div
      ref={scrollRef}
      className="
        flex
        gap-4
        overflow-x-auto
        overflow-y-hidden
        scroll-smooth
        snap-x
        snap-mandatory
        pb-1
        sm:gap-5
        lg:gap-6

        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
      "
    >
      {videos.map((video) => (
        <CustomerVideoCard
          key={video.id}
          video={video}
        />
      ))}
    </div>
  );
}

export default CustomerVideoGrid;