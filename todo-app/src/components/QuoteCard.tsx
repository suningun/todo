const quotes = [
  {
    text: "If you're not making mistakes, then you're not making decisions.",
    author: "Catherine Cook",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
  },
  {
    text: "Small deeds done are better than great deeds planned.",
    author: "Peter Marshall",
  },
];

function QuoteCard() {
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-violet-100 via-white to-stone-50 p-5 dark:border-white/5 dark:from-violet-700/25 dark:via-[#141419] dark:to-[#101015]">
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet-400/30 blur-3xl dark:bg-violet-600/25" />

      <h3 className="relative text-sm font-semibold text-stone-900 dark:text-white">
        Quote of the Day
      </h3>

      <p className="relative mt-3 text-sm italic leading-relaxed text-stone-600 dark:text-white/70">
        "{quote.text}"
      </p>

      <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-white/40">
        — {quote.author}
      </p>
    </div>
  );
}

export default QuoteCard;
