import { useEffect, useMemo, useState } from "react";

const CHAR_DELAY_MS = 52;
const START_DELAY_MS = 700;
const LINE_PAUSE_MS = 320;

/** Natural break for the default hero subtitle on small screens */
function mobileSplitIndex(text) {
  const marker = "the marine";
  const idx = text.indexOf(marker);
  if (idx > 0) return idx;

  const words = text.split(" ");
  if (words.length < 2) return text.length;
  const mid = Math.ceil(words.length / 2);
  return words.slice(0, mid).join(" ").length + 1;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MobileTypedLines({ text, count, splitAt }) {
  const firstLen = Math.min(count, splitAt);
  const secondLen = Math.max(0, count - splitAt);

  return (
    <>
      <span className="block">{text.slice(0, firstLen)}</span>
      {secondLen > 0 || count > splitAt ? (
        <span className="block">{text.slice(splitAt, splitAt + secondLen)}</span>
      ) : null}
    </>
  );
}

export default function HeroTypewriter({ text, className = "" }) {
  const fullText = text || "";
  const splitAt = useMemo(() => mobileSplitIndex(fullText), [fullText]);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!fullText) return;

    if (prefersReducedMotion()) {
      setCount(fullText.length);
      setDone(true);
      return;
    }

    setCount(0);
    setDone(false);

    let index = 0;
    let timeoutId;
    let cancelled = false;

    function schedule(next, delay) {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) next();
      }, delay);
    }

    function tick() {
      index += 1;
      setCount(index);

      if (index >= fullText.length) {
        setDone(true);
        return;
      }

      const delay =
        index === splitAt ? CHAR_DELAY_MS + LINE_PAUSE_MS : CHAR_DELAY_MS;
      schedule(tick, delay);
    }

    schedule(tick, START_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [fullText, splitAt]);

  if (!fullText) return null;

  const cursor = (
    <span
      className={`ml-0.5 inline-block w-[2px] translate-y-[2px] bg-white/80 align-middle sm:ml-1 ${
        done ? "hero-typewriter-cursor-done" : "hero-typewriter-cursor"
      }`}
      aria-hidden
    />
  );

  return (
    <p className={className} aria-live="polite">
      <span className="sm:hidden">
        <MobileTypedLines text={fullText} count={count} splitAt={splitAt} />
        {cursor}
      </span>
      <span className="hidden sm:inline">
        {fullText.slice(0, count)}
        {cursor}
      </span>
    </p>
  );
}
