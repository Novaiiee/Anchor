import type { NextPage } from "next";
import Head from "next/head";
import AuthForm from "../../components/auth/AuthForm";

const Login: NextPage = () => (
	<>
		<Head>
			<title>Login - Anchor</title>
		</Head>
		<main className="flex h-full w-screen items-center justify-center">
			<div className="flex h-full w-full items-center justify-center">
				<AuthForm name="Login" />
			</div>
		</main>
	</>
);

export default Login;
