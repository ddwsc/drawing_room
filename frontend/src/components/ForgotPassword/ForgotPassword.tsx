import React from "react";
import * as constant from "./constants";
import { useLoader } from "@/contexts/LoaderContext";
import { useToast } from "@/contexts/ToastContext";
import { forgotPassword } from "@/services/auth.service";
import { AxiosError } from "axios";
import Wrapper from "../Wrapper";

export default function ForgotPassword() {
	const { showLoader, hideLoader } = useLoader();
	const { showToast } = useToast();
	const [submitted, setSubmitted] = React.useState(false);
	const [email, setEmail] = React.useState("");
	const [emailError, setEmailError] = React.useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === constant.emailTagName) {
			setEmailError(false);
			setEmailErrorMessage("");
			setEmail(value);
		}
	};

	const validateInputs = () => {
		let isValid = true;
		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			setEmailError(true);
			setEmailErrorMessage(constant.emailErrorMessage);
			isValid = false;
		}
		return isValid;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (emailError) {
			return;
		}
		showLoader();
		try {
			await forgotPassword(email);
			hideLoader();
			setSubmitted(true);
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
					{submitted ? constant.forgotLabel : constant.title}
				</h1>
				{submitted ? (
					<article className="space-y-4">
						<p className="mb-2 text-sm text-gray-400">
							{constant.forgotMessage}
						</p>
					</article>
				) : (
					<form
						className="space-y-4"
						onSubmit={handleSubmit}
						autoComplete="off"
					>
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
						<button
							type="submit"
							onClick={validateInputs}
							className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
						>
							{constant.submitLabel}
						</button>
					</form>
				)}
			</section>
		</Wrapper>
	);
}
