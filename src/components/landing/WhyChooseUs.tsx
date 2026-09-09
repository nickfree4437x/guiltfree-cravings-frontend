import {
  Heart,
  Home,
  Leaf,
  Star,
} from "lucide-react";

function WhyChooseUs() {
  const benefits = [
    {
      title: "Quality Ingredients",
      description:
        "Thoughtfully selected ingredients to create delicious treats you can enjoy with confidence.",
      icon: Leaf,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      title: "Made with Care",
      description:
        "Every treat is prepared with attention to detail, care, and a passion for great taste.",
      icon: Heart,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-500",
      borderColor: "border-rose-200",
    },
    {
      title: "Delicious Taste",
      description:
        "Because choosing a better treat should never mean compromising on flavour.",
      icon: Star,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      borderColor: "border-amber-200",
    },
    {
      title: "Homemade Goodness",
      description:
        "The warmth and comfort of homemade goodness, made for everyday cravings and special moments.",
      icon: Home,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <section
      className="bg-[#fffaf5] px-5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
      id="why-choose"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
              Why Choose Us
            </span>
          </div>

          <h2 className="mt-2 text-[18px] font-semibold leading-tight tracking-wide text-[#2c2c2c] sm:text-[22px] md:text-[28px]">
            Good Food, Thoughtfully Made
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-[12px] font-[350] leading-relaxed text-slate-500 md:text-[14.5px]">
            We put care into every detail so you can simply enjoy every
            delicious bite.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-14 mt-8 grid gap-px overflow-hidden rounded-md border border-gray-200 bg-[#eadfd3] sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group relative bg-white px-6 py-8 text-center transition-all duration-300 sm:px-7 sm:py-9 lg:min-h-[285px] lg:px-6"
              >
                {/* Icon with Different Colors */}
                <div
                  className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${benefit.borderColor} ${benefit.bgColor} ${benefit.iconColor} transition-all duration-300`}
                >
                  <Icon
                    size={23}
                    strokeWidth={1.7}
                    className="transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mt-6 text-[16px] font-semibold tracking-tight text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-[230px] text-[12px] font-[350] leading-5 text-slate-500 sm:text-[14px]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;