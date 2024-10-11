import { useLoader } from "@/contexts/LoaderContext";

export default function Loading() {
	const { loading } = useLoader();

	return (
		<section
			className={`w-full h-full fixed top-0 left-0 bg-black bg-opacity-75 z-50 flex justify-center items-center ${
				loading ? "visible" : "invisible"
			}`}
		>
			<article className="h-12 w-12 bg-primary-800 rounded-full animate-ping"></article>
		</section>
	);
}
