import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { fetchCareers } from "../../api/client";
import CareersJobSchema from "../../components/seo/CareersJobSchema";

function CareerFeedCard({ post, index }) {
  return (
    <motion.article
      className="overflow-hidden rounded-2xl border border-brand-ink/8 bg-white shadow-sm"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex items-center gap-3 border-b border-brand-ink/6 px-5 py-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-ink text-sm font-bold text-white">
          MV
        </span>
        <div>
          <p className="text-sm font-bold text-brand-ink">Mr Vilz</p>
          <p className="text-xs text-brand-brown-lt">Careers · Sri Lanka</p>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-brand-ink">{post.title}</h3>
            {post.roleType ? (
              <span className="mt-2 inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-brown">
                {post.roleType}
              </span>
            ) : null}
          </div>
          <Link
            to={`/careers/apply?role=${encodeURIComponent(post.title)}`}
            className="shrink-0 rounded-full bg-brand-ink px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-brown"
          >
            Apply now
          </Link>
        </div>
        <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-brand-brown">
          {post.description}
        </p>
      </div>
    </motion.article>
  );
}

export default function CareersPage() {
  const [careers, setCareers] = useState(null);

  useEffect(() => {
    fetchCareers().then((data) => setCareers(data.careers));
  }, []);

  if (!careers) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center pt-28">
        <p className="text-brand-brown-lt">Loading careers...</p>
      </main>
    );
  }

  const posts = careers.posts || [];

  return (
    <main className="px-5 pb-20 pt-28 lg:px-8">
      <CareersJobSchema />
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Careers</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">{careers.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-brown">{careers.intro}</p>
        </motion.div>

        <div className="mt-12 space-y-6">
          {posts.length ? (
            posts.map((post, index) => (
              <CareerFeedCard key={post.id} post={post} index={index} />
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-brand-ink/15 bg-white px-6 py-12 text-center text-brand-brown-lt">
              No open roles right now. Check back soon or join as a volunteer.
            </p>
          )}
        </div>

        <motion.div
          className="mt-16 rounded-3xl bg-brand-ink px-8 py-10 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-2xl font-bold">Want to volunteer without a CV?</h3>
          <p className="mt-2 max-w-xl text-white/80">
            Become a member with personal details only — no documents required.
          </p>
          <Link
            to="/join"
            className="mt-6 inline-flex rounded-full bg-white px-8 py-3 font-bold text-brand-ink"
          >
            Join Team
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
