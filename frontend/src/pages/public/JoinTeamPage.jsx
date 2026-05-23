import ScrollLink from "../../components/navigation/ScrollLink";
import JoinApplicationForm from "../../components/public/JoinApplicationForm";

export default function JoinTeamPage() {
  return (
    <main className="min-h-screen bg-brand-cream px-5 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <ScrollLink
            to="/"
            className="text-sm font-semibold text-brand-brown-lt transition hover:text-brand-ink"
          >
            ← Back to home
          </ScrollLink>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">
            Become a member
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Become a member
          </h1>
          <p className="mt-3 text-sm text-brand-brown-lt sm:text-base">
            Complete three quick steps — personal details, your story, then submit. No CV needed. For
            job roles with a CV, visit{" "}
            <a href="/careers" className="font-semibold text-brand-ink underline">
              Careers
            </a>
            .
          </p>
        </div>
        <JoinApplicationForm />
      </div>
    </main>
  );
}
