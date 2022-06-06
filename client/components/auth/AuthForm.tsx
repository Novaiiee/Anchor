import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import GithubButton from "./GithubButton";
import GoogleButton from "./GoogleButton";

interface Props {
	name: "Login" | "Register";
}

export default function AuthForm({ name }: Props) {
	const schema = yup.object({
		name:
			name === "Register"
				? yup.string().min(3, "Minimun 3 Characters").required("Required*")
				: yup.string().min(3, "Minimun 3 Characters"),
		identifier:
			name === "Register"
				? yup.string().email("Not an email").required("Required*")
				: yup.string().required("Required*"),
		password: yup.string().required("Required*").min(6, "Minimum of 6 Characters")
	});

	const {
		formState: { errors },
		register,
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			identifier: "",
			password: ""
		}
	});

	const onSubmit = () => {};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col items-center space-y-6 md:w-2/12"
		>
			<h1 className="text-4xl font-bold">{name}</h1>
			<GoogleButton />
			<GithubButton />
			{name === "Register" && (
				<div className="flex w-full flex-col space-y-2">
					<label>Username</label>
					<input
						{...register("name")}
						type="text"
						className="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
					/>
					{errors.name?.message && (
						<p className="font-medium text-red-500">{errors.name.message}</p>
					)}
				</div>
			)}
			<div className="flex w-full flex-col space-y-2">
				<label>
					{name === "Register" && "Email"}
					{name === "Login" && "Username or Email"}
				</label>
				<input
					{...register("identifier")}
					type="text"
					className="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
				/>
				{errors.identifier?.message && (
					<p className="font-medium text-red-500">{errors.identifier.message}</p>
				)}
			</div>
			<div className="flex w-full flex-col space-y-2">
				<label>Password</label>
				<input
					{...register("password")}
					type="password"
					className="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
				/>
				{errors.password?.message && (
					<p className="font-medium text-red-500">{errors.password.message}</p>
				)}
			</div>
			<button
				type="submit"
				className="w-full rounded-md border-1 bg-blue-700 py-2 px-8 font-medium text-white outline-none"
			>
				Submit
			</button>
			{name === "Register" && (
				<a href="/auth/login" className="text-blue-400">
					Already have an account? Login!
				</a>
			)}
			{name === "Login" && (
				<a href="/auth/register" className="text-blue-400">
					Don&apos;t have an account? Register Now!
				</a>
			)}
		</form>
	);
}
