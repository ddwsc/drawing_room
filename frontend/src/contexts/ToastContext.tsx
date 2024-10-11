import React from "react";

interface IToastContext {
	visible: boolean;
	content: string;
	showToast: Function;
}

const ToastContext = React.createContext<IToastContext>({
	visible: false,
	content: "",
	showToast: () => {},
});

export function useToast() {
	return React.useContext(ToastContext);
}

interface Prop {
	children?: React.ReactNode;
}

export function ToastProvider({ children }: Prop) {
	const [visible, setVisible] = React.useState(false);
	const [content, setContent] = React.useState("");

	const value = {
		visible,
		content,
		showToast: (content: string) => {
			setContent(content);
			setVisible(true);
			setTimeout(() => {
				setVisible(false);
			}, 1000);
			setTimeout(() => {
				setContent("");
			}, 1500);
		},
	};
	return (
		<ToastContext.Provider value={value}>{children}</ToastContext.Provider>
	);
}
