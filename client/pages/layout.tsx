import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

const Layout = ({ children }: any) => (
	<main className="flex h-screen flex-col justify-between space-y-0 bg-white dark:bg-gray-800">
		<div>
			<Navbar />
			<div className="mb-auto">{children}</div>
		</div>
		<Footer />
	</main>
);

export default Layout;
