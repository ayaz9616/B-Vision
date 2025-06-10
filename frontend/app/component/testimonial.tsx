import Image from "next/image";

const testimonials = [
  {
    name: "Sean Rose",
    username: "@seanrose",
    avatar: "/avatars/seanrose.jpg",
    text: (
      <>
        Really, really liking <span className="text-indigo-400">@reflectnotes</span> so far. It’s just the right amount of simple/fast for a personal note taking app and does most of the hard work of organizing in the background.
      </>
    ),
  },
  {
    name: "Ryan Delk",
    username: "@delk",
    avatar: "/avatars/ryandelk.jpg",
    text: (
      <>
        Don’t take it from me: <span className="text-indigo-400">@reflectnotes</span> is magic.
      </>
    ),
  },
  {
    name: "Demetria Giles",
    username: "@drosewritings",
    avatar: "/avatars/demetria.jpg",
    text: (
      <>
        Playing around with <span className="text-indigo-400">@reflectnotes</span>. I’m bringing thoughts, details and soundbites from epics, meetings, articles, etc from the past week. The knowledge worker’s dream come true.
      </>
    ),
  },
  {
    name: "Demetria Giles",
    username: "@drosewritings",
    avatar: "/avatars/demetria.jpg",
    text: (
      <>
        Playing around with <span className="text-indigo-400">@reflectnotes</span>. I’m bringing thoughts, details and soundbites from epics, meetings, articles, etc from the past week. The knowledge worker’s dream come true.
      </>
    ),
  },
  {
    name: "Fabrizio Rinaldi",
    username: "@linuz90",
    avatar: "/avatars/fabrizio.jpg",
    text: (
      <>
        I’m keeping <span className="text-indigo-400">@reflectnotes</span> open <b>*all*</b> the time, and I’m using both for simple journaling, and long form writing. It’s rare to see a single app work so well for both.
      </>
    ),
  },
  {
    name: "Jonathan Simcoe",
    username: "@jsimcoe",
    avatar: "/avatars/jonathan.jpg",
    text: (
      <>
        All righty. I have to give a massive shout-out to <span className="text-indigo-400">@maccaw</span> for pioneering <span className="text-indigo-400">@reflectnotes</span>. It has already matured to a point where it is a daily driver for me. The speed, focus, and attention to detail (especially perfect bits of structured data) is superb.
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
                <Image
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