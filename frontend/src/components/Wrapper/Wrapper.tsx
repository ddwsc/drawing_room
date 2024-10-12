import { useNavigate } from "react-router-dom";
import viteLogo from "/vite.svg";
import * as constant from "./constants";
import { routes } from "@/constants";

interface Prop {
	children?: React.ReactNode;
}

export default function Wrapper({ children }: Prop) {
	const navigate = useNavigate();

	function handleTitleClick() {
		navigate(`${routes.room}`);
	}

	return (
		<div className="w-full min-w-sm h-full min-h-screen bg-gray-900 p-3">
			<div className="flex flex-col items-center px-6 py-8 mx-auto lg:py-0">
				<div
					className="flex items-center mb-6 text-2xl font-semibold text-white cursor-pointer"
					onClick={handleTitleClick}
				>
					<img className="w-8 h-8 mr-2" src={viteLogo} alt="logo" />
					{constant.title}
				</div>
				<div className="w-full max-w-lg min-w-80 mt-0 p-0 rounded-lg shadow border bg-gray-800 border-gray-700">
					{children}
				</div>
			</div>
		</div>
	);
}
