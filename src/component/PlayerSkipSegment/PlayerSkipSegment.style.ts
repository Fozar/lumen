import { Theme, ThemedStyles } from 'Theme/types';

export const componentStyles = ({ scale, text, colors }: Theme) => ({
  container: {
    position: 'absolute',
    right: scale(24),
    bottom: scale(96),
    zIndex: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(18),
    borderRadius: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderWidth: 1,
    borderColor: colors.textOnContrast,
  },
  text: {
    fontSize: scale(text.md.fontSize),
    color: colors.textOnContrast,
  },
  hint: {},
} satisfies ThemedStyles);
