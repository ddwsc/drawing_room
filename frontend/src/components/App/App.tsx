import { AuthProvider } from "@/contexts/AuthContext";
import { LoaderProvider } from "@/contexts/LoaderContext";
import { ToastProvider } from "@/contexts/ToastContext";
import AppRouter from "./Router";
import Loader from "../Loader";
import Toast from "../Toast";

function App() {
	return (
		<AuthProvider>
			<LoaderProvider>
				<ToastProvider>
					<Loader />
					<Toast />
					<AppRouter />
				</ToastProvider>
			</LoaderProvider>
		</AuthProvider>
	);
}

export default App;
