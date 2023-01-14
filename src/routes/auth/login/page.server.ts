import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData(),
			email = data.get("email"),
			password = data.get("password");
	},
};
