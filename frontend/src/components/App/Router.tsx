import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import fetch, { handleResponseError403 } from "@/libs/fetch";
import { useAuth } from "@/contexts/AuthContext";
import { useLoader } from "@/contexts/LoaderContext";
import { RequireAuth } from "./RequireAuth";
import NotFound from "@/components/NotFound";
import Home from "@/components/Home";
import Room from "@/components/Room";
import SignUp from "@/components/SignUp";
import SignIn from "@/components/SignIn";
import ForgotPassword from "@/components/ForgotPassword";
import ChangePassword from "@/components/ChangePassword";
import { routes } from "@/constants";

function Router() {
	return (
		<BrowserRouter>
			<InjectInterceptors />
			<Routes>
				<Route path="/" element={<RequireAuth />}>
					<Route index element={<Navigate to={routes.home} replace />} />
					<Route path={routes.room}>
						<Route index element={<Home />} />
						<Route path={":roomName"} element={<Room />} />
					</Route>
				</Route>
				<Route path={routes.signUp} element={<SignUp />} />
				<Route path={routes.signIn} element={<SignIn />} />
				<Route path={routes.forgot} element={<ForgotPassword />} />
				<Route path={routes.change} element={<ChangePassword />} />
				{/* Using path="*"" means "match anything", so this route
						acts like a catch-all for URLs that we don't have explicit
						routes for. */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default Router;

function InjectInterceptors() {
	const { reset } = useAuth();
	const { showLoader } = useLoader();

	React.useEffect(() => {
		const handleResponseError = (error: any) =>
			handleResponseError403(error, () => {
				showLoader();
				reset();
			});
		const interceptor403 = fetch.interceptors.response.use(
			null,
			handleResponseError
		);
		return () => {
			fetch.interceptors.response.eject(interceptor403);
		};
	}, []);

	return <></>;
}
