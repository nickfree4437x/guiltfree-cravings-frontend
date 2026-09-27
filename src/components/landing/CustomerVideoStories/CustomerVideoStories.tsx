import { useRef } from "react";

import CustomerVideoHeader from "./sections/CustomerVideoHeader";
import CustomerVideoGrid from "./sections/CustomerVideoGrid";
import CustomerVideoControls from "./sections/CustomerVideoControls";

export interface CustomerVideo {
  id: number;
  name: string;
  city: string;
  videoUrl: string;
  caption: string;
}

const customerVideos: CustomerVideo[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    city: "Delhi",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "My favourite little evening treat.",
  },
  {
    id: 2,
    name: "Rohit Mehta",
    city: "Gurugram",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Everyone at home loved these laddoos.",
  },
  {
    id: 3,
    name: "Priya Kapoor",
    city: "Noida",
    videoUrl:
      "https://media.w3.org/2010/05/sintel/trailer.mp4",
    caption: "A little sweetness, made better.",
  },
];

function CustomerVideoStories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const amount = container.clientWidth;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="customer-video-stories"
      className="
        relative
        overflow-hidden
        bg-[#FFF9F5]
        px-5
        py-6
        sm:px-8
        sm:py-8
        lg:px-12
      "
    >

      <div className="relative mx-auto w-full max-w-6xl">
        <CustomerVideoHeader />

        <div className="relative mt-8 sm:mt-10 lg:mt-12">
          <CustomerVideoGrid
            videos={customerVideos}
            scrollRef={scrollRef}
          />

          <CustomerVideoControls
            onPrevious={() => scroll("left")}
            onNext={() => scroll("right")}
          />
        </div>
      </div>
    </section>
  );
}

export default CustomerVideoStories;