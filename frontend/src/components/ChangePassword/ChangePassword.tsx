import React from "react";
import { useNavigate } from "react-router-dom";
import * as constant from "./constants";
import { useLoader } from "@/contexts/LoaderContext";
import { useToast } from "@/contexts/ToastContext";
import { changePassword } from "@/services/auth.service";
import { AxiosError } from "axios";
import { routes } from "@/constants";
import Wrapper from "../Wrapper";

export default function ChangePassword() {
	const token = new URLSearchParams(window.location.search).get("t");
	const navigate = useNavigate();
	const { showLoader, hideLoader } = useLoader();
	const { showToast } = useToast();
	const [password, setPassword] = React.useState("");
	const [passwordError, setPasswordError] = React.useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
	const [confirm, setConfirm] = React.useState("");
	const [confirmError, setConfirmError] = React.useState(false);
	const [confirmErrorMessage, setConfirmErrorMessage] = React.useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === constant.passwordTagName) {
			setPasswordError(false);
			setPasswordErrorMessage("");
			setPassword(value);
		}
		if (name === constant.confirmTagName) {
			setConfirmError(false);
			setConfirmErrorMessage("");
			setConfirm(value);
		}
	};

	const validateInputs = () => {
		let isValid = true;
		if (!password || password.length < 6) {
			setPasswordError(true);
			setPasswordErrorMessage(constant.passwordErrorMessage);
			isValid = false;
		}
		if (!confirm || confirm !== password) {
			setConfirmError(true);
			setConfirmErrorMessage(constant.confirmErrorMessage);
			isValid = false;
		}
		return isValid;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (passwordError || confirmError) {
			return;
		}
		if (!token) {
			showToast(constant.emptyTokenErrorMessage);
			return;
		}
		showLoader();
		try {
			await changePassword(token, password);
			navigate(routes.signIn, { replace: true });
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
					<div>
						<label
							htmlFor={constant.confirmTagName}
							className="block mb-2 text-sm font-medium text-white"
						>
							{constant.confirmLabel}
						</label>
						<input
							className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
							name={constant.confirmTagName}
							type="password"
							placeholder={constant.confirmPlaceholder}
							onChange={handleChange}
							value={confirm}
							required
						/>
						<label
							htmlFor={constant.confirmTagName}
							className="block mt-2 text-sm text-red-500"
						>
							{confirmError && confirmErrorMessage}
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
			</section>
		</Wrapper>
	);
}
