import React from "react";
import * as authService from "@/services/auth.service";

interface IAuthContext {
	email: string;
	login: Function;
	logout: Function;
	ping: Function;
	reset: Function;
}

const AuthContext = React.createContext<IAuthContext>({
	email: "",
	login: () => {},
	logout: () => {},
	ping: () => {},
	reset: () => {},
});

export function useAuth() {
	return React.useContext(AuthContext);
}

interface Prop {
	children?: React.ReactNode;
}

export function AuthProvider({ children }: Prop) {
	const [email, setEmail] = React.useState("");

	function reset() {
		setEmail("");
	}

	function ping() {
		return authService.access().then((res) => {
			if (res && res.data && res.data.email) {
				setEmail(res.data.email);
				return true;
			};
		});
	}

	function login(email: string, password: string) {
		return authService.signIn(email, password).then((res) => {
			if (res && res.data && res.data.email) setEmail(res.data.email);
		});
	}

	function logout() {
		return authService.signOut().then(() => reset());
	}

	const value = {
		email,
		login,
		logout,
		ping,
		reset,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
