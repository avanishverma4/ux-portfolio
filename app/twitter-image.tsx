/**
 * X/Twitter reads its own image slot rather than falling back to the Open
 * Graph one in every client, so the same card is exposed under both names.
 */
export { alt, size, contentType, default } from './opengraph-image';
