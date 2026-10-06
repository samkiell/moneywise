export const metadata = {
  title: "About Money Wise | The OAU Cowrywise Community Magazine",
  description:
    "Money Wise is the official magazine of the Writing Team of the OAU Cowrywise Community.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-neutral-border pb-8 mb-10">
        <span className="editorial-kicker">About Us</span>
        <h1 className="editorial-title text-4xl sm:text-5xl text-neutral-main mt-3">
          Money Wise Magazine
        </h1>
        <p className="font-serif italic text-xl text-primary mt-4">
          &ldquo;We write to inform. We create to inspire. We publish to empower.&rdquo;
        </p>
      </div>

      <div className="prose prose-slate max-w-none font-serif text-base text-neutral-main space-y-6 leading-relaxed">
        <p className="text-lg leading-relaxed">
          <strong>Money Wise</strong> is the official magazine of the Writing Team of the OAU Cowrywise Community. It exists to promote financial literacy while giving community members a dynamic platform for stories, ideas, education, creative expression, and meaningful conversations.
        </p>

        <p>
          Founded to bridge personal finance with campus realities and young adult aspirations, Money Wise transforms abstract economic principles into relatable essays, analytical tabloids, and inspiring stories.
        </p>

        <div className="my-10 p-8 bg-surface border border-neutral-border rounded-lg not-prose">
          <h2 className="font-serif text-xl font-bold text-neutral-main mb-4">Our Guiding Pillars</h2>
          <ul className="space-y-3 text-sm text-neutral-secondary">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1. Financial Literacy:</span> Demystifying savings, investments, and personal financial decisions.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2. Career Development:</span> Guiding students through early industry paths, skills, and internships.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">3. Digital Literacy:</span> Equipping readers for modern digital tools and the evolving knowledge economy.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">4. Entrepreneurial Development:</span> Sharing lessons on building sustainable ventures and side pursuits.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">5. Quality Connections:</span> Fostering mentorship, collaboration, and high-impact peer networks.
            </li>
          </ul>
        </div>

        <p>
          Every piece published in Money Wise is written, reviewed, and edited by student leaders and community writers dedicated to craft, accuracy, and depth.
        </p>
      </div>
    </div>
  );
}
