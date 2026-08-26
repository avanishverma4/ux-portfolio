import { ImageResponse } from 'next/og';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { SITE } from '@/lib/site';

/**
 * The card that shows up in Google's rich results, Bing previews, LinkedIn,
 * Slack and X. `summary_large_image` was already declared but no image
 * existed, so every share rendered as a bare grey box.
 *
 * Built with next/og rather than a checked-in PNG so the name, title and stats
 * always match the live data.
 */
export const alt = `${PORTFOLIO_DATA.profile.name} — ${PORTFOLIO_DATA.profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const { profile } = PORTFOLIO_DATA;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: SITE.themeColor.dark,
          color: '#f5f5f5',
          padding: '72px 80px',
        }}
      >
        {/* Top rule — the same editorial spine the page uses */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 999,
              border: `3px solid ${SITE.accent}`,
              color: SITE.accent,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            AV
          </div>
          <div style={{ display: 'flex', flex: 1, height: 1, background: '#2a2a2a' }} />
          <div style={{ display: 'flex', fontSize: 20, color: '#8b8b8b', letterSpacing: '0.2em' }}>
            UI/UX · DESIGN SYSTEMS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              color: SITE.accent,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 25,
              color: '#a9a9a9',
              lineHeight: 1.45,
              maxWidth: 940,
            }}
          >
            {profile.shortBio}
          </div>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 56 }}>
          {profile.stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                borderTop: '1px solid #2a2a2a',
                paddingTop: 16,
                minWidth: 180,
              }}
            >
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
              <div style={{ display: 'flex', fontSize: 19, color: '#8b8b8b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
