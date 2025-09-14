export const theme = {
  colors: {
    primary: '#6366F1',
    background: '#FEFEFE',
    surface: '#FFFFFF',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      muted: '#9CA3AF',
    },
    border: '#E5E7EB',
    accent: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  themes: [
    { id: 'food', label: 'Food', emoji: '🍲' },
    { id: 'study', label: 'Study', emoji: '📚' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'places', label: 'Places', emoji: '🏛️' },
    { id: 'skills', label: 'Skills', emoji: '🎯' },
    { id: 'language', label: 'Language', emoji: '🗣️' },
  ],
};

export const THEMES = theme.themes;