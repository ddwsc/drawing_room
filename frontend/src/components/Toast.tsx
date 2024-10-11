import { useToast } from "@/contexts/ToastContext";

export default function Toast() {
	const { visible, content } = useToast();

	return (
		<section className="fixed top-2 flex justify-center w-full z-50">
			<article
				className={`w-full max-w-xs p-4 space-x-4 rounded-lg shadow text-gray-400 border border-gray-600 bg-gray-800 transition-opacity ease-in duration-500 ${ visible ? 'opacity-100' : 'opacity-0'}`}
				role="alert"
			>
				<div className="text-sm font-normal">{content}</div>
			</article>
		</section>
	);
}
