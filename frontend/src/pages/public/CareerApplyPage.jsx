import { Link, useSearchParams } from "react-router-dom";
import CareerApplicationForm from "../../components/public/CareerApplicationForm";
import ScrollLink from "../../components/navigation/ScrollLink";

export default function CareerApplyPage() {
  const [params] = useSearchParams();
  const role = params.get("role") || "Open Position";

  return (
    <main className="min-h-screen bg-brand-cream px-5 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <ScrollLink
            to="/careers"
            className="text-sm font-semibold text-brand-brown-lt transition hover:text-brand-ink"
          >
            ← Back to careers
          </ScrollLink>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">
            Apply for role
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{role}</h1>
          <p className="mt-3 text-sm text-brand-brown-lt sm:text-base">
            Complete three quick steps — personal details, professional profile, then upload your
            CV and submit.
          </p>
        </div>
        <CareerApplicationForm jobTitle={role} />
      </div>
    </main>
  );
}
