import { LeaderboardRow } from "@/components/sections/leaderboard-row";
import { StandingsRow } from "@/components/sections/standings-row";
import { levels, standings, standingsColumns } from "@/lib/data/leaderboard";

export function StandingsTable() {
  return (
    <>
      <div className="hidden flex-col gap-2 desktop:flex">
        <div className="flex items-center gap-6 p-3 text-xs text-muted-foreground">
          <span className="w-8.75 shrink-0 text-center">{standingsColumns[0]}</span>
          <span className="w-55.5 shrink-0">{standingsColumns[1]}</span>
          {standingsColumns.slice(2).map((column) => (
            <span key={column} className="min-w-px flex-1 truncate text-center">
              {column}
            </span>
          ))}
          <span aria-hidden className="w-70.25 shrink-0" />
        </div>

        <ul className="flex flex-col gap-2">
          {standings.map((entry) => (
            <StandingsRow key={entry.id} entry={entry} />
          ))}
        </ul>
      </div>

      <ul className="flex flex-col gap-2 desktop:hidden">
        {standings.map((entry) => (
          <LeaderboardRow
            key={entry.id}
            href={`/profile/${entry.id}`}
            rank={entry.rank}
            name={entry.name}
            levelLabel={`Nivel: ${levels[entry.level].label}`}
            points={entry.points}
            avatarSrc={entry.avatarSrc}
            tone={entry.tone}
          />
        ))}
      </ul>
    </>
  );
}
