import aboutImage from "../../assets/about_image.png";

function About() {
  return (
    <section
      id="about"
      className="overflow-hidden bg-white px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================================================
            CENTERED SECTION HEADER
        ========================================================= */}

        <div className="mb-4 text-center sm:mb-6 lg:mb-12">
          <h2 className="text-[18px] sm:text-[22px] md:text-[28px] font-semibold leading-tight tracking-wide text-[#2c2c2c]">
            A Healthy Reason to Say{" "}
            <span className="font-serif font-normal italic text-[#8b542f]">
              Yes
            </span>{" "}
            to Sweet
          </h2>
        </div>


        {/* =========================================================
            LEFT CONTENT + RIGHT IMAGE
        ========================================================= */}

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div>

            {/* Story */}
            <div>
              <h3 className="max-w-2xl text-[16px] font-medium leading-[1.4] tracking-tight text-[#2c2c2c] sm:text-[22px] md:text-[24px]">
                Somewhere between I shouldn't and just one bite we found a
                better answer: - <span className="text-[#8b542f]">don't.</span>
              </h3>
            </div>


            {/* Story Details */}
            <div className="mt-5 grid gap-3 md:gap-7 border-t border-[#eadfd3] pt-3 md:pt-7 sm:grid-cols-[1.15fr_0.85fr] sm:gap-8">

              <p className="text-[12px] md:text-[14.5px] font-[350] leading-5 md:leading-6 text-slate-600 text-justify">
                Our laddoos are rolled by hand, warm with{" "}
                <span className="font-[450] text-[#2c2c2c]">
                  desi ghee
                </span>
                , studded with{" "}
                <span className="font-[450] text-[#2c2c2c]">
                  real nuts
                </span>
                , and sweetened only by{" "}
                <span className="font-[450] text-[#8b542f]">
                  jaggery
                </span>{" "}
                and{" "}
                <span className="font-[450] text-[#8b542f]">
                  dates
                </span>{" "}
                - never a grain of refined sugar. Every bite is thoughtfully crafted to
                  bring together wholesome ingredients, traditional flavours, and the
                  comforting taste of something truly homemade.
              </p>


              <div className="sm:border-l sm:border-[#eadfd3]  sm:pl-7">

                <div className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b542f]" />

                  <p className="text-[12px] md:text-[14px] font-[350] leading-5 text-slate-600">
                    No preservatives hiding in the fine print.
                  </p>
                </div>

                <div className="mt-2 flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b542f]" />

                  <p className="text-[12px] md:text-[14px] font-[350] leading-5 text-slate-600">
                    No unnecessary ingredients.
                  </p>
                </div>

                <div className="mt-2 flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b542f]" />

                  <p className="text-[12px] md:text-[14px] font-[350] leading-5 text-slate-600">
                    Made with thoughtfully selected ingredients.
                  </p>
                </div>

                <div className="mt-2 flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b542f]" />

                  <p className="text-[12px] md:text-[14px] font-[350] leading-5 text-slate-600">
                    Crafted fresh with traditional care.
                  </p>
                </div>

                {/* <p className="mt-2 text-[#8b542f]">
                  No apology needed.
                </p> */}

              </div>

            </div>


            {/* Real Life */}
            <div className="mt-5 border-t border-[#eadfd3] pt-5">

              <h3 className="text-[18px] font-semibold tracking-tight text-[#2c2c2c] md:text-[22px]">
                It's the real thing.
              </h3>

              <p className="mt-2 max-w-2xl text-[12px] md:text-[14px] font-[350] leading-5 text-slate-600">
                This isn't a diet snack pretending to be a treat.
                It's honest, nourishing food made for everyday moments.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <div>
                  <p className="text-[12px] md:text-[14px] font-[500] leading-5 text-[#2c2c2c]">
                    For growing kids
                  </p>

                  <p className="mt-1 text-[12px] md:text-[14px] font-[350] leading-5 text-slate-500">
                    A wholesome burst of energy after school.
                  </p>
                </div>

                <div>
                  <p className="text-[12px] md:text-[14px] font-[500] leading-5 text-[#2c2c2c]">
                    For busy women
                  </p>

                  <p className="mt-1 text-[12px] md:text-[14px] font-[350] leading-5 text-slate-500">
                    Something nourishing when the day gets long.
                  </p>
                </div>

                <div>
                  <p className="text-[12px] md:text-[14px] font-[500] leading-5 text-[#2c2c2c]">
                    For busy men
                  </p>

                  <p className="mt-1 text-[12px] md:text-[14px] font-[350] leading-5 text-slate-500">
                    A better bite between meetings and moments.
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              RIGHT IMAGE
          ===================================================== */}

          <div className="relative">

            <div className="relative overflow-hidden rounded-md bg-[#f3e4d3]">

              <img
                src={aboutImage}
                alt="GuiltFree Cravings homemade treats"
                className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[460px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            </div>

          </div>

        </div>


        {/* =========================================================
            CENTERED PROMISE
        ========================================================= */}

        <div className="mt-8 md:mt-10 border-t border-[#eadfd3] pt-4 text-center lg:pt-8">

          <p className="text-[10px] uppercase font-[350] tracking-[0.28em] text-slate-500">
            Our Simple Promise
          </p>

          <h3 className="mx-auto mt-2 max-w-3xl font-serif text-[16px] font-medium italic leading-[1.35] text-[#8b542f] sm:text-[20px] lg:text-[22px]">
            Nourishment You Can Taste,  Tradition You Can Trust.
          </h3>


          {/* Values */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">

            <span className="text-[10px] font-[350] uppercase tracking-[0.14em] text-slate-500">
              No Preservatives
            </span>

            <span
              className="h-1 w-1 rounded-full bg-[#d8c6b5]"
              aria-hidden="true"
            />

            <span className="text-[10px] font-[350]  uppercase tracking-[0.14em] text-slate-500">
              No Refined Sugar
            </span>

            <span
              className="h-1 w-1 rounded-full bg-[#d8c6b5]"
              aria-hidden="true"
            />

            <span className="text-[10px] uppercase font-[350] tracking-[0.14em] text-slate-500">
              100% Love
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;