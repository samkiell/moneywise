import { teamService } from "@/lib/services/team.service";
import { ITeamMember } from "@/types";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meet the Team | Money Wise Magazine",
  description: "The editorial team behind the Money Wise magazine of the OAU Cowrywise Community.",
};

export default async function TeamPage() {
  let members: ITeamMember[] = [];

  try {
    members = await teamService.getActiveMembers();
  } catch (error) {
    console.warn("Unable to fetch team members:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-neutral-border pb-8 mb-12 text-center max-w-3xl mx-auto">
        <span className="editorial-kicker">Masthead</span>
        <h1 className="editorial-title text-4xl sm:text-5xl text-neutral-main mt-3">
          Meet the Editorial Team
        </h1>
        <p className="text-neutral-secondary text-base mt-4 leading-relaxed">
          The writers, copy editors, and line editors stewarding the editorial voice and standards of Money Wise.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="border border-neutral-border bg-surface rounded-lg p-12 text-center max-w-md mx-auto my-8">
          <Users className="w-10 h-10 text-neutral-secondary mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-neutral-main">Editorial Team Directory</h3>
          <p className="text-xs text-neutral-secondary mt-2">
            Team records are managed dynamically via the staff portal and will appear here once published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member._id}
              className="border border-neutral-border bg-surface p-6 rounded-lg text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-neutral-border flex items-center justify-center text-primary font-serif font-bold text-2xl mb-4 overflow-hidden">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  member.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <h2 className="font-serif text-lg font-bold text-neutral-main">{member.name}</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mt-1">
                {member.role}
              </p>
              {member.bio && (
                <p className="text-xs text-neutral-secondary mt-3 leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
