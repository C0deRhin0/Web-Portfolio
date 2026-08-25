import React, { useRef, useState } from 'react';
import activity from '../data/githubActivity.json';

type ActivityDay = (typeof activity.days)[number];

const GitHubActivity: React.FC = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; left: number; top: number } | null>(null);
  const activeDays = activity.days.filter((day) => day.count > 0).length;
  const mostActiveDay = activity.days.reduce((highest, day) => day.count > highest.count ? day : highest, activity.days[0]);
  const updatedAt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(activity.updatedAt));

  const showTooltip = (day: ActivityDay, event: React.MouseEvent<HTMLSpanElement> | React.PointerEvent<HTMLSpanElement>) => {
    const graphBounds = graphRef.current?.getBoundingClientRect();
    if (!graphBounds) {
      return;
    }

    const date = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(`${day.date}T00:00:00Z`));
    const contributionText = day.count === 0
      ? 'No contributions'
      : `${day.count} contribution${day.count === 1 ? '' : 's'}`;
    const pointerLeft = event.clientX - graphBounds.left;

    setTooltip({
      text: `${date} · ${contributionText}`,
      left: Math.max(92, Math.min(graphBounds.width - 92, pointerLeft)),
      top: Math.max(4, event.clientY - graphBounds.top - 34)
    });
  };

  return (
    <section className="win95-activity" aria-labelledby="development-activity-title">
      <header className="win95-activity__header">
        <div>
          <h2 id="development-activity-title">Development Activity</h2>
          <p><strong>{activity.totalContributions.toLocaleString('en-US')}</strong> contributions in {activity.year}</p>
        </div>
        <a href={`https://github.com/${activity.username}`} target="_blank" rel="noreferrer">Open GitHub ↗</a>
      </header>
      <div className="win95-activity__graph-wrap" ref={graphRef} onMouseLeave={() => setTooltip(null)}>
        <div className="win95-activity__graph" role="img" tabIndex={0} aria-label={`${activity.totalContributions.toLocaleString('en-US')} public GitHub contributions across ${activeDays} active days in ${activity.year}. Hover over a square for its date and contribution count.`}>
          <div className="win95-activity__grid" aria-hidden="true">
            {activity.days.map((day) => (
              <span
                data-date={day.date}
                data-level={day.level}
                key={day.date}
                onMouseEnter={(event) => showTooltip(day, event)}
                onMouseMove={(event) => showTooltip(day, event)}
                onPointerDown={(event) => showTooltip(day, event)}
                style={{ gridRow: new Date(`${day.date}T00:00:00Z`).getUTCDay() + 1 }}
              />
            ))}
          </div>
        </div>
        {tooltip && <div className="win95-activity__tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.text}</div>}
      </div>
      <div className="win95-activity__details">
        <span><b>{activeDays}</b> active days</span>
        <span><b>{mostActiveDay.count}</b> on busiest day</span>
        <span>Updated {updatedAt}</span>
      </div>
      <small>Public GitHub activity only; private work may not be represented.</small>
    </section>
  );
};

export default GitHubActivity;
