// @ts-nocheck
// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.svelte"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				current: "currentColor",
				violet: colors.violet,
				black: colors.black,
				white: colors.white,
				gray: colors.gray,
				red: colors.red,
				yellow: colors.yellow,
				green: colors.green,
				blue: colors.blue,
				indigo: colors.indigo,
				purple: colors.purple,
				stone: colors.stone,
				cyan: colors.cyan,
				almostBlack: {
					100: "#d0d0d0",
					200: "#a1a1a1",
					300: "#727272",
					400: "#434343",
					500: "#141414",
					600: "#101010",
					700: "#0c0c0c",
					800: "#080808",
					900: "#040404"
				},
				lightModeBackground: "#EBF0F1",
				darkModeBackground: "#1E1E1E"
			},
			flex: {
				1: "1 1 0%",
				2: "2 2 0%",
				3: "3 3 0%",
				4: "4 4 0%",
				5: "5 5 0%"
			},
			height: () => ({
				"10vh": "10vh",
				"20vh": "20vh",
				"30vh": "30vh",
				"40vh": "40vh",
				"50vh": "50vh",
				"60vh": "60vh",
				"70vh": "70vh",
				"80vh": "80vh",
				"90vh": "90vh"
			}),
			minWidth: (theme) => ({
				...theme.width,
				"10vw": "10vw",
				"20vw": "20vw",
				"30vw": "30vw",
				"40vw": "40vw",
				"50vw": "50vw",
				"60vw": "60vw",
				"70vw": "70vw",
				"80vw": "80vw",
				"90vw": "90vw"
			}),
			opacity: {
				0: "0",
				5: "0.05",
				10: "0.1",
				20: "0.2",
				25: "0.25",
				30: "0.3",
				40: "0.4",
				50: "0.5",
				60: "0.6",
				70: "0.7",
				75: "0.75",
				80: "0.8",
				90: "0.9",
				95: "0.95",
				100: "1"
			},
			borderWidth: {
				1: "1px"
			},
			fontFamily: {
				inter: ['"Inter"', "sans-serif"],
				poppins: ['"Poppins"', "sans-serif"],
				montserrat: ['"Montserrat"', "sans-serif"],
				basier: ['"Basier Circle"', "sans-serif"]
			}
		}
	},
	// eslint-disable-next-line global-require
	plugins: [require("@tailwindcss/custom-forms")]
};
