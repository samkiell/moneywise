import { teamService } from "@/lib/services/team.service";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await teamService.getAllMembers();

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-neutral-border pb-6">
        <span className="editorial-kicker">Masthead Desk</span>
        <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Editorial Team</h1>
        <p className="text-xs text-neutral-secondary mt-1">
          Manage masthead roles, writers, copy editors, and active statuses.
        </p>
      </div>

      <TeamManager initialMembers={members} />
    </div>
  );
}
