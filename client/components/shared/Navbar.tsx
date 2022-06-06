import useUserStore from "../../stores/userStore";

const Navbar = () => {
	const user = useUserStore((s) => s.user);

	return (
		<nav className="bg-blue-700 py-4">
			<div className="container mx-auto flex items-center justify-between px-8">
				<div>
					<a className="text-2xl font-semibold text-white" href="/">
						Anchor
					</a>
				</div>
				{user && (
					<div className="flex items-center justify-center space-x-4 font-medium text-white">
						<a href="/focus">Focus Mode</a>
						<a href="/insights">Insights</a>
					</div>
				)}
				<div className="space-x-4">
					{user && (
						<>
							<img src="" alt="" />
							<a
								href="/auth/register"
								className="rounded-md bg-white px-4 py-2 font-medium text-black shadow-md hover:bg-gray-300"
							>
								Get Started
							</a>
							<a href="/auth/login" className="hidden font-medium text-white hover:text-gray-300 md:inline">
								Or Login
							</a>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
