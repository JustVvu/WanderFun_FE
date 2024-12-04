import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},

			white1: 'var(--white1)',
			white2: 'var(--white2)',
			white3: 'var(--white3)',
			white4: 'var(--white4)',
			white5: 'var(--white5)',

			black1: 'var(--black1)',
			black2: 'var(--black2)',
			black3: 'var(--black3)',
			black4: 'var(--black4)',
			black5: 'var(--black5)',

			green1: 'var(--green1)',
			green2: 'var(--green2)',
			green3: 'var(--green3)',
			green4: 'var(--green4)',
			green5: 'var(--green5)',

			green1o: 'var(--green1o)',
			green2o: 'var(--green2o)',
			green_selected: 'var(--green_selected)',

			blue1: 'var(--blue1)',
			blue2: 'var(--blue2)',
			blue3: 'var(--blue3)',
			blue4: 'var(--blue4)',
			blue5: 'var(--blue5)',

			blue1o: 'var(--blue1o)',
			blue2o: 'var(--blue2o)',
			blue_selected: 'var(--blue_selected)',

			red1: 'var(--red1)',
			red2: 'var(--red2)',
			red3: 'var(--red3)',
			red4: 'var(--red4)',
			red5: 'var(--red5)',

			yellow1: 'var(--yellow1)',
			yellow2: 'var(--yellow2)',
			yellow3: 'var(--yellow3)',
			yellow4: 'var(--yellow4)',
			yellow5: 'var(--yellow5)',

			orange1: 'var(--orange1)',
			orange2: 'var(--orange2)',
			orange3: 'var(--orange3)',
			orange4: 'var(--orange4)',
			orange5: 'var(--orange5)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		fontFamily: {
			Poppins: ['Poppins', 'sans-serif'],
			Caveat: ['Caveat Brush', 'sans-serif'],
		},
  	},
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
