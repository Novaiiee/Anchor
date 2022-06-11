// import Cookie from "cookies";
import { getCookie, setCookies } from "cookies-next";
import type { GetServerSidePropsContext, NextPage } from "next";
import fetchUserWithCookie from "../../helpers/fetchUserWithCookie";

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
	const user = await fetchUserWithCookie(req as any);
	// const cookie = new Cookie(req, res);

	// const token = cookie.get("access_token");

	// cookie.set("access_token", token, {
	// 	path: "/"
	// });

	console.log("Access Token: ", getCookie("session", { req, res }));
	console.log("Cookie: ", getCookie("cookie", { req, res }));

	setCookies("access_token", getCookie("cookie", { req, res }), { req, res });

	if (!user) {
		return {
			redirect: {
				props: {},
				destination: "/"
			}
		};
	}

	return { props: {}, redirect: { destination: "/timer" } };
};

const Redirect: NextPage = () => <>Hello</>;

export default Redirect;
