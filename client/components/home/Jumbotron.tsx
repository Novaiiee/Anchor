export default function Jumbotron() {
	return (
		<section>
			<div className="flex w-full flex-col items-center justify-center space-y-10 bg-blue-700 p-20 text-white">
				<h1 className="text-7xl font-semibold">Anchor</h1>
				<p className="text-center md:text-left">A productivity tool to help with work and study.</p>
				<div className="space-x-4">
					<a
						href="/auth/register"
						className="rounded-md bg-white px-4 py-2 font-medium text-black shadow-md hover:bg-gray-300"
					>
						Get Started
					</a>
					<a href="/auth/login" className="font-medium text-white hover:text-gray-300">
						Or Login
					</a>
				</div>
			</div>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
				<path
					fill="#1d4ed8"
					fillOpacity="1"
					d="M0,288L48,282.7C96,277,192,267,288,261.3C384,256,480,256,576,218.7C672,181,768,107,864,96C960,85,1056,139,1152,176C1248,213,1344,235,1392,245.3L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
				/>
			</svg>
		</section>
	);
}
