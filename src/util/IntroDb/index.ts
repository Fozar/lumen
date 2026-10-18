import { FilmInterface } from 'Type/Film.interface';

const INTRODB_URL = 'https://api.theintrodb.org/v4/media';
const REQUEST_TIMEOUT_MS = 8000;
const IMDB_ID_REGEXP = /imdb\.com\/title\/(tt\d+)/i;

export type SkipSegmentType = 'intro' | 'recap' | 'credits' | 'preview';

export interface SkipSegment {
  type: SkipSegmentType;
  /** seconds, 0 when the segment starts with the media */
  start: number;
  /** seconds, null when the segment runs to the end of the media */
  end: number | null;
}

interface IntroDbTimestamp {
  start_ms: number | null;
  end_ms: number | null;
}

type IntroDbResponse = Partial<Record<SkipSegmentType, IntroDbTimestamp[]>>;

const SEGMENT_TYPES: SkipSegmentType[] = ['intro', 'recap', 'credits', 'preview'];

// a film page is requested over and over while episodes are switched, and the
// service allows a limited number of requests a day. `null` is a cached miss
const cache = new Map<string, SkipSegment[] | null>();

/**
 * The page links its IMDb rating to the title (see `parseHelpLink`), which is the
 * only external id it exposes - and TheIntroDB accepts it as is.
 */
export const getImdbId = (film: FilmInterface): string | undefined => {
  const { ratings = [] } = film;

  for (const { link } of ratings) {
    const id = link?.match(IMDB_ID_REGEXP)?.[1];

    if (id) {
      return id;
    }
  }

  return undefined;
};

const parseSegments = (response: IntroDbResponse): SkipSegment[] => SEGMENT_TYPES.flatMap((type) => (
  (response[type] ?? []).map(({ start_ms, end_ms }) => ({
    type,
    start: (start_ms ?? 0) / 1000,
    end: end_ms === null || end_ms === undefined ? null : end_ms / 1000,
  }))
));

export const fetchSkipSegments = async (
  film: FilmInterface,
  seasonId?: string,
  episodeId?: string
): Promise<SkipSegment[]> => {
  const imdbId = getImdbId(film);

  if (!imdbId) {
    return [];
  }

  const params = new URLSearchParams({ imdb_id: imdbId });

  if (film.hasSeasons) {
    // the service has no way to look a series up without an episode
    if (!seasonId || !episodeId) {
      return [];
    }

    params.set('season', seasonId);
    params.set('episode', episodeId);
  }

  const url = `${INTRODB_URL}?${params.toString()}`;

  if (cache.has(url)) {
    return cache.get(url) ?? [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    // an unknown title is a normal answer, not a failure
    if (response.status === 404) {
      cache.set(url, null);

      return [];
    }

    if (!response.ok) {
      return [];
    }

    const segments = parseSegments(await response.json() as IntroDbResponse);

    cache.set(url, segments);

    return segments;
  } catch {
    // skipping is a convenience - a missing answer must never get in the way of playback
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * The segment the playhead is inside of, if any.
 *
 * A credits roll that ends with the media has no end of its own, so `duration`
 * stands in for it - skipping it lands on the very end.
 */
export const findActiveSegment = (
  segments: SkipSegment[],
  currentTime: number,
  duration: number
): SkipSegment | undefined => segments.find(({ start, end }) => (
  currentTime >= start && currentTime < (end ?? duration) - 1
));
