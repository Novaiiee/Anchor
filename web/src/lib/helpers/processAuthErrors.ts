export default function processAuthErrors(errors: string[]): AuthError[] {
	return errors.map((error) => {
		const [type, message] = error.split(": ");

		return {
			type: type as "Email" | "Password" | "Username",
			message
		};
	});
}
