import Image from "next/image";

const testimonials = [
  {
    name: "Sean Rose",
    username: "@seanrose",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VPXkLbzAmQTy1xjCjtflrQoqii6fkjxL8QHT3sJI36f8ZKxMa_62SFTftGWO9w1zl2hCuA&s",
    text: (
      <>
        This platform is a game-changer for businesses seeking actionable insights from customer reviews. The interface is sleek, intuitive, and the analysis is fast and accurate. I love how easy it is to upload data and receive detailed, visually appealing reports. Highly recommended for anyone serious about understanding their customers!
      </>
    ),
  },
  {
    name: "Ryan Delk",
    username: "@delk",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIRmKUzViUy_qBC99RQ9XxR67HpVE9ZdH24hCXaKe6y9muPQGTZ7mP79c&s",
    text: (
      <>
        B Vision transformed how we interpret customer feedback. The sentiment analysis is spot-on, and the feature-level breakdowns are incredibly helpful. The modern design and smooth user experience make data analysis enjoyable. I appreciate the transparency and depth of the reports. This tool is now essential for our marketing strategy.
      </>
    ),
  },
  {
    name: "Demetria Giles",
    username: "@drosewritings",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRirEksuZwwFCs8D8WN78wMF0y4Q___9ofq5CoH9jhhgcfUqAznOtE-muw&s",
    text: (
      <>
        I’m impressed by how effortlessly this site turns review data into meaningful business intelligence. The drag-and-drop upload is a breeze, and the progress bar keeps you informed. The insights are clear, actionable, and beautifully presented. If you want to maximize the value of your customer feedback, look no further!
      </>
    ),
  },
  {
    name: "Demetria Giles",
    username: "@drosewritings",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU7gYttnADm2pxyqAPfzr5lnIAm4S--meb31JsfcxTi_yvgFIkEB9-nkk&s",
    text: (
      <>
        The sentiment analytics provided by this website are both comprehensive and easy to understand. The ability to filter by product features and demographics gives us a competitive edge. Reports are downloadable and ready to share with stakeholders. This is the perfect solution for businesses aiming to be truly customer-centric.
      </>
    ),
  },
  {
    name: "Fabrizio Rinaldi",
    username: "@linuz90",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRTzZvWkgZgbzcuMfKCS-jOKK3lUXcc8N5uqYp5TUB9vyL-R8iwrvMtvs&s",
    text: (
      <>
        From the first upload, I was amazed by the speed and clarity of the analysis. The dashboards are visually stunning and packed with useful information. It’s obvious a lot of thought went into the user experience. Our team now relies on these insights for product development and customer engagement.
      </>
    ),
  },
  {
    name: "Jonathan Simcoe",
    username: "@jsimcoe",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHwQBfegEFyMyH-f5JX5HAli8X25e45T-lYfk_gtRzUwEWUY5DelnMSRA&s",
    text: (
      <>
       B Vision takes the guesswork out of review analysis. The AI-powered insights are accurate, and the customizable reports save us hours of manual work. The platform’s design is both modern and user-friendly. I highly recommend this service to any business that values data-driven decision-making and customer satisfaction.
      </>
    ),
  },
];

export default function TestimonialSection() {
  return (
    <section className="relative w-full bg-[#0a0c23] py-20 px-2 flex flex-col items-center overflow-hidden">
      {/* Fade overlays only on medium and up */}
      <div className="hidden md:block pointer-events-none absolute left-0 top-0 h-full w-1/4 z-10 bg-gradient-to-r from-[#0a0c23] via-[#0a0c23]/80 to-transparent" />
      <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-1/4 z-10 bg-gradient-to-l from-[#0a0c23] via-[#0a0c23]/80 to-transparent" />

      <div className="mb-4">
        <span className="px-4 py-1 rounded-full bg-[#18192a] text-indigo-300 text-xs font-semibold tracking-wide shadow">
          Wall of love
        </span>
      </div>
      <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 text-center">
        Loved by thinkers
      </h2>
      <p className="text-slate-400 text-base sm:text-lg mb-12 text-center">
        Here’s what people are saying about us
      </p>
      <div className="relative w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#18192a] rounded-2xl p-6 shadow hover:shadow-lg transition flex flex-col gap-3 min-h-[170px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-semibold text-base">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.username}</div>
                </div>
              </div>
              <div className="text-slate-300 text-sm">{t.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}