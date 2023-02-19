import defaultTheme from 'windicss/defaultTheme';

export const colors: Record<string, Record<number, string>> = {
	...defaultTheme.colors,
	gray: {
		50: '#f9fafb',
		100: '#eaeaeb',
		200: '#cacbcd',
		300: '#a7a9ac',
		400: '#696c71',
		500: '#282d34',
		600: '#24292f',
		700: '#181b20',
		800: '#121518',
		900: '#000000',
	},
	primary: {
		50: '#0094ff',
		100: '#008aff',
		200: '#0080ff',
		300: '#0076ff',
		400: '#006cff',
		500: '#0062ff',
		600: '#0058f5',
		700: '#004eeb',
		800: '#0044e1',
		900: '#003ad7',
	},
};
