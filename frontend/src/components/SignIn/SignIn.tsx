import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as constant from "./constants";
import { routes } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLoader } from "@/contexts/LoaderContext";
import { useToast } from "@/contexts/ToastContext";
import { AxiosError } from "axios";
import Wrapper from "../Wrapper";

export default function SignIn() {
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	const { showLoader, hideLoader } = useLoader();
	const { showToast } = useToast();
	const { login, ping, email: userEmail } = useAuth();
	const [email, setEmail] = React.useState("");
	const [emailError, setEmailError] = React.useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [passwordError, setPasswordError] = React.useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

	React.useEffect(() => {
		initAuth();
		return () => {};
	}, []);

	async function initAuth() {
		showLoader();
		if (userEmail) {
			navigate(from, {
				replace: true,
			});
		} else {
			const pong = await ping();
			if (pong) {
				navigate(from, {
					replace: true,
				});
			}
		}
		hideLoader();
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === constant.emailTagName) {
			setEmailError(false);
			setEmailErrorMessage("");
			setEmail(value);
		}
		if (name === constant.passwordTagName) {
			setPasswordError(false);
			setPasswordErrorMessage("");
			setPassword(value);
		}
	};

	const validateInputs = () => {
		let isValid = true;
		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			setEmailError(true);
			setEmailErrorMessage(constant.emailErrorMessage);
			isValid = false;
		}
		if (!password || password.length < 6) {
			setPasswordError(true);
			setPasswordErrorMessage(constant.passwordErrorMessage);
			isValid = false;
		}
		return isValid;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (emailError || passwordError) {
			return;
		}
		showLoader();
		try {
			await login(email, password);
			navigate(from, { replace: true });
			hideLoader();
		} catch (error) {
			hideLoader();
			let errorMessage = "Error";
			if (error instanceof AxiosError) {
				const errData: any = error.response?.data;
				errorMessage = errData?.message || error.message;
			}
			showToast(errorMessage);
		}
	};

	return (
		<Wrapper>
			<section className="p-6 space-y-4 sm:p-8">
				<h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
					{constant.title}
				</h1>
				<form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
					<div>
						<label
							htmlFor={constant.emailTagName}
							className="block mb-2 text-sm font-medium text-white"
						>
							{constant.emailLabel}
						</label>
						<input
							className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
							name={constant.emailTagName}
							type="text"
							placeholder={constant.emailPlaceholder}
							onChange={handleChange}
							value={email}
							autoComplete="off"
							required
						/>
						<label
							htmlFor={constant.emailTagName}
							className="block mt-2 text-sm text-red-500"
						>
							{emailError && emailErrorMessage}
						</label>
					</div>
					<div>
						<label
							htmlFor={constant.passwordTagName}
							className="block mb-2 text-sm font-medium text-white"
						>
							{constant.passwordLabel}
						</label>
						<input
							className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
							name={constant.passwordTagName}
							type="password"
							placeholder={constant.passwordPlaceholder}
							onChange={handleChange}
							value={password}
							autoComplete="off"
							required
						/>
						<label
							htmlFor={constant.passwordTagName}
							className="block mt-2 text-sm text-red-500"
						>
							{passwordError && passwordErrorMessage}
						</label>
					</div>
					<div className="flex items-center justify-end">
						<a
							href={routes.forgot}
							className="text-sm font-medium hover:underline text-primary-500"
						>
							{constant.forgotLabel}
						</a>
					</div>
					<button
						type="submit"
						onClick={validateInputs}
						className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
					>
						{constant.submitLabel}
					</button>
					<p className="text-sm font-light text-gray-400">
						{constant.accountLabel}{" "}
						<a
							href={routes.signUp}
							className="font-medium hover:underline text-primary-500"
						>
							{constant.signUpLabel}
						</a>
					</p>
				</form>
			</section>
		</Wrapper>
	);
}
