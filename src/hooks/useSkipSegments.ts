import { useEffect, useState } from 'react';
import { FilmInterface } from 'Type/Film.interface';
import { fetchSkipSegments, SkipSegment } from 'Util/IntroDb';

/**
 * Intro / recap / credits / preview markers of the episode being played.
 * They are fetched again whenever the episode changes.
 */
export const useSkipSegments = (
  film: FilmInterface,
  seasonId?: string,
  episodeId?: string,
  isEnabled = true
): SkipSegment[] => {
  const [segments, setSegments] = useState<SkipSegment[]>([]);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    let isStale = false;

    fetchSkipSegments(film, seasonId, episodeId).then((result) => {
      if (!isStale) {
        setSegments(result);
      }
    });

    return () => {
      isStale = true;
      setSegments([]);
    };
  }, [film, seasonId, episodeId, isEnabled]);

  return segments;
};

export default useSkipSegments;
