import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

/**
 * The site had no favicon at all, so results and tabs fell back to a blank
 * globe. Generated rather than checked in as a binary, so it stays in step
 * with the brand colours in lib/site.ts.
 */
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: SITE.themeColor.dark,
          color: SITE.accent,
          border: `28px solid ${SITE.accent}`,
          borderRadius: 96,
          fontSize: 236,
          fontWeight: 700,
          letterSpacing: '-0.06em',
        }}
      >
        AV
      </div>
    ),
    size
  );
}
