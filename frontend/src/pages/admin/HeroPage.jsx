import { useEffect, useState } from "react";
import api from "../../api/client";

export default function HeroPage() {
  const [hero, setHero] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/public/site").then(({ data }) => setHero(data.hero));
  }, []);

  async function save(event) {
    event.preventDefault();
    setStatus("Saving...");
    try {
      const { data } = await api.put("/admin/hero", hero);
      setHero(data.hero);
      setStatus("Saved.");
    } catch {
      setStatus("Save failed.");
    }
  }

  if (!hero) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Hero Content</h1>
      <form onSubmit={save} className="mt-6 max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
        {[
          ["eyebrow", "Eyebrow"],
          ["title", "Title"],
          ["subtitle", "Subtitle"],
          ["mediaUrl", "Media URL"],
          ["mediaAlt", "Media Alt Text"]
        ].map(([key, label]) => (
          <label key={key} className="block text-sm font-semibold">
            {label}
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={hero[key] || ""}
              onChange={(e) => setHero((h) => ({ ...h, [key]: e.target.value }))}
            />
          </label>
        ))}

        <label className="block text-sm font-semibold">
          Media Type
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={hero.mediaType}
            onChange={(e) => setHero((h) => ({ ...h, mediaType: e.target.value }))}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>

        <button type="submit" className="rounded-lg bg-brand-red px-5 py-2 font-bold text-white">
          Save Hero
        </button>
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      </form>
    </div>
  );
}
