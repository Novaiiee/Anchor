import type { NextPage } from "next";
import Head from "next/head";
import Jumbotron from "../components/home/Jumbotron";

const Home: NextPage = () => (
	<>
		<Head>
			<title>Anchor</title>
		</Head>
		<main>
			<Jumbotron />
		</main>
	</>
);

export default Home;
