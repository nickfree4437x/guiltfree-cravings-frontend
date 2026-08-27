function WhyChooseUs() {
  const benefits = [
    {
      title: "Quality Ingredients",
      description:
        "Thoughtfully selected ingredients to create delicious treats you can enjoy with confidence.",
      icon: "🌿",
    },
    {
      title: "Made with Care",
      description:
        "Every treat is prepared with attention to detail, care, and a passion for great taste.",
      icon: "❤️",
    },
    {
      title: "Delicious Taste",
      description:
        "Because choosing a better treat should never mean compromising on flavour.",
      icon: "✨",
    },
    {
      title: "Homemade Goodness",
      description:
        "The warmth and comfort of homemade goodness, made for everyday cravings and special moments.",
      icon: "🏠",
    },
  ];

  return (
    <section className="bg-[#fffaf5] px-6 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            Why Choose Us?
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Good Food,
            <span className="text-[#8b542f]"> Thoughtfully Made.</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            We put care into every detail so you can simply enjoy every
            delicious bite.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-3xl border border-[#eadfd3] bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e4d3] text-2xl transition duration-300 group-hover:scale-110">
                {benefit.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;