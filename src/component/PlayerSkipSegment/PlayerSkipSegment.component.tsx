import { ThemedText } from 'Component/ThemedText';
import { useIsTV } from 'Context/ConfigContext';
import { useThemedStyles } from 'Hooks/useThemedStyles';
import { t } from 'i18n/translate';
import { Pressable } from 'react-native';
import { SkipSegmentType } from 'Util/IntroDb';

import { componentStyles } from './PlayerSkipSegment.style';
import { componentStyles as componentStylesTV } from './PlayerSkipSegment.style.atv';

export interface PlayerSkipSegmentProps {
  type: SkipSegmentType;
  onPress: () => void;
}

const getLabel = (type: SkipSegmentType): string => {
  switch (type) {
    case 'recap':
      return t('Skip recap');
    case 'credits':
      return t('Skip credits');
    case 'preview':
      return t('Skip preview');
    default:
      return t('Skip intro');
  }
};

/**
 * The button is never focusable: on a TV the remote's OK press is taken by the
 * player itself (see the key listener there) while it is shown, so the d-pad
 * focus stays on the controls where it belongs.
 */
export const PlayerSkipSegmentComponent = ({ type, onPress }: PlayerSkipSegmentProps) => {
  const isTV = useIsTV();
  const styles = useThemedStyles(isTV ? componentStylesTV : componentStyles);

  return (
    <Pressable
      style={ styles.container }
      onPress={ onPress }
      focusable={ false }
    >
      <ThemedText style={ styles.text }>
        { getLabel(type) }
      </ThemedText>
      { isTV && <ThemedText style={ styles.hint }>OK</ThemedText> }
    </Pressable>
  );
};

export default PlayerSkipSegmentComponent;
