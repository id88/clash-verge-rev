import getSystem from '@/utils/get-system'
const OS = getSystem()

// default theme setting - Marxism VPN theme
export const defaultTheme = {
  primary_color: '#B31B1B',
  secondary_color: '#FFD700',
  primary_text: '#1F2937',
  secondary_text: '#6B7280',
  info_color: '#B31B1B',
  error_color: '#C8102E',
  warning_color: '#FF9500',
  success_color: '#06943D',
  background_color: '#F8F9FA',
  font_family: `-apple-system, BlinkMacSystemFont,"Microsoft YaHei UI", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji"${
    OS === 'windows' ? ', twemoji mozilla' : ''
  }`,
}

// dark mode
export const defaultDarkTheme = {
  ...defaultTheme,
  primary_color: '#C8102E',
  secondary_color: '#FFD700',
  primary_text: '#FFFFFF',
  background_color: '#1A0809',
  secondary_text: '#EBEBF599',
  info_color: '#C8102E',
  error_color: '#FF453A',
  warning_color: '#FF9F0A',
  success_color: '#30D158',
}
