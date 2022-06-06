import Link from "next/link";
import { ReactNode } from "react";
import env from "../../utils/env";

interface Props {
	provider: "github" | "google";
	children: ReactNode;
}
export default function AuthButton({ provider, children }: Props) {
	const styles = "flex w-full items-center justify-center space-x-4 rounded-md p-2 shadow-md";

	const googleStyles = `${styles} transition duration-75 ease-in hover:bg-gray-100`;
	const githubStyles = `${styles} bg-black text-white`;

	return (
		<Link href={`${env.serverURL}/auth/${provider}`}>
			<span className={provider === "google" ? googleStyles : githubStyles}>{children}</span>
		</Link>
	);
}
