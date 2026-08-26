import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

/** iOS masks the corners itself, so this one is a filled square with padding. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 88,
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
