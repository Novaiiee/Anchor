import defaultAdapter from "@sveltejs/adapter-auto";
import netlifyAdapter from "@sveltejs/adapter-netlify";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({ postcss: true }),

	kit: {
		adapter:
			process.env.NODE_ENV === "development"
				? defaultAdapter()
				: netlifyAdapter({
						edge: false,
						split: false
				  })
	}
};

export default config;
