import { Play } from "lucide-react";

interface CustomerStory {
  id: number;
  customerName: string;
  quote: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface CustomerStoriesProps {
  productName: string;
}

/*
|--------------------------------------------------------------------------
| Dummy Customer Story Videos
|--------------------------------------------------------------------------
| Later these URLs can be replaced with real Cloudinary/video URLs.
| Product name should match the product name coming from the API.
|--------------------------------------------------------------------------
*/

const customerStories: Record<string, CustomerStory[]> = {
  "Dry Fruit Sattu Laddoo": [
    {
      id: 1,
      customerName: "Priya",
      quote:
        "Absolutely loved the taste and freshness. It felt homemade!",
      videoUrl:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      customerName: "Rahul",
      quote:
        "My family finished the box in no time. Definitely ordering again.",
      videoUrl:
        "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      customerName: "Ananya",
      quote:
        "The perfect balance of taste and wholesome goodness.",
      videoUrl:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80",
    },
  ],

  "Dates Delight": [
    {
      id: 1,
      customerName: "Ananya",
      quote:
        "Such a naturally sweet treat. I really enjoyed every bite.",
      videoUrl:
        "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      customerName: "Neha",
      quote:
        "A lovely sweet option when I want something naturally delicious.",
      videoUrl:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    },
  ],

  "Sattu Laddoo": [
    {
      id: 1,
      customerName: "Rohit",
      quote:
        "Perfect for my morning routine. Simple, tasty and filling.",
      videoUrl:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      customerName: "Vikram",
      quote:
        "I keep these around for a quick wholesome snack.",
      videoUrl:
        "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476f?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

/*
|--------------------------------------------------------------------------
| Fallback Dummy Stories
|--------------------------------------------------------------------------
| If a product does not yet have product-specific videos,
| we still show the section using dummy content.
|--------------------------------------------------------------------------
*/

const fallbackStories: CustomerStory[] = [
  {
    id: 1,
    customerName: "Megha",
    quote:
      "Loved the taste, packaging and that homemade feeling.",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    customerName: "Arjun",
    quote:
      "A delicious little treat that everyone at home enjoyed.",
    videoUrl:
      "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1605196560547-1c7b8d9e0f56?auto=format&fit=crop&w=800&q=80",
  },
];

function CustomerStories({
  productName,
}: CustomerStoriesProps) {
  const stories =
    customerStories[productName] ?? fallbackStories;

  return (
    <section className="w-full py-4 md:py-8">

      {/* =====================================================
          VIDEO STORIES
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {stories.map((story) => (
          <article
            key={story.id}
            className="
              group
              overflow-hidden
              rounded-md
              border
              border-gray-200
              bg-white
              transition-all
              duration-300
              hover:border-[#AF956C]/30
            "
          >
            {/* =================================================
                VIDEO
            ================================================= */}

            <div className="relative aspect-[9/12] overflow-hidden bg-[#faf8f5]">
              <video
                className="
                  h-full
                  w-full
                  object-cover
                "
                src={story.videoUrl}
                poster={story.thumbnailUrl}
                controls
                playsInline
                preload="metadata"
              />

              {/* Decorative play indicator */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-[#AF956C]
                  shadow-sm
                "
              >
                <Play
                  className="ml-0.5 h-4 w-4 fill-current"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CustomerStories;