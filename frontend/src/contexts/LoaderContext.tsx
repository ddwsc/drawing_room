import React from "react";

interface ILoaderContext {
	loading: boolean;
	showLoader: Function;
	hideLoader: Function;
}

const LoaderContext = React.createContext<ILoaderContext>({
	loading: false,
	showLoader: () => {},
	hideLoader: () => {},
});

export function useLoader() {
	return React.useContext(LoaderContext);
}

interface Prop {
	children?: React.ReactNode;
}

export function LoaderProvider({ children }: Prop) {
	const [loading, setLoading] = React.useState(false);
	const value = {
		loading,
		showLoader: () => {
			setLoading(true);
		},
		hideLoader: () => {
			setTimeout(() => setLoading(false), 500);
		},
	};
	return (
		<LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
	);
}
