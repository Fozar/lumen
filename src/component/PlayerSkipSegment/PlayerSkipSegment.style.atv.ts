import { Theme, ThemedStyles } from 'Theme/types';

export const componentStyles = ({ scale, text, colors }: Theme) => ({
  container: {
    position: 'absolute',
    right: scale(48),
    bottom: scale(160),
    zIndex: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderWidth: 2,
    borderColor: colors.textOnContrast,
  },
  text: {
    fontSize: scale(text.md.fontSize),
    color: colors.textOnContrast,
  },
  hint: {
    fontSize: scale(text.sm.fontSize),
    color: colors.textOnContrast,
    opacity: 0.7,
  },
} satisfies ThemedStyles);
