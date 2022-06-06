import type { NextPage } from "next";
import Head from "next/head";
import AuthForm from "../../components/auth/AuthForm";

const Register: NextPage = () => (
	<>
		<Head>
			<title>Register - Anchor</title>
		</Head>
		<main className="flex h-full w-screen items-center justify-center">
			<div className="flex h-full w-full items-center justify-center">
				<AuthForm name="Register" />
			</div>
		</main>
	</>
);

export default Register;
