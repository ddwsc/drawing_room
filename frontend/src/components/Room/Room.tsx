import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Socket } from "socket.io-client";
import { useLoader } from "@/contexts/LoaderContext";
import { useToast } from "@/contexts/ToastContext";
import { routes } from "@/constants";
import * as roomService from "@/services/room.service";
import * as socketService from "@/services/socket.service";
import * as messageService from "@/services/message.service";
import * as constant from "./constants";
import Wrapper from "../Wrapper";

interface IMessage {
	user: string;
	type: string;
	content: string;
}

export default function Room() {
	const navigate = useNavigate();
	const { roomName } = useParams();
	const currentRoomName = roomName || "";
	const { showLoader, hideLoader } = useLoader();
	const { showToast } = useToast();
	const [initial, setInitial] = React.useState(0);
	const [messages, setMessages] = React.useState<IMessage[]>([]);
	const [messageText, setMessageText] = React.useState("");
	const [onlineCount, setOnlineCount] = React.useState(0);

	React.useEffect(() => {
		if (initial) return;
		joinRoom();
		return () => {};
	}, []);

	React.useEffect(() => {
		let socket: Socket;

		if (initial === 1) {
			socket = socketService.open(currentRoomName);

			socket.on("RoomMembers", ({ roomName, totalMembers }) => {
				if (currentRoomName === roomName) {
					setOnlineCount(totalMembers);
				}
			});

			socket.on("RoomMessages", ({ roomName, username, type, content }) => {
				if (currentRoomName === roomName && username && type && content) {
					const newMessage: IMessage = {
						user: username as string,
						type: type as string,
						content: content as string,
					};
					setMessages((prevItems) => [...prevItems, newMessage]);
				}
			});
		}

		return () => {
			if (socket) socket.disconnect();
		};
	}, [initial]);

	async function joinRoom() {
		showLoader();
		try {
			const res = await roomService.join(currentRoomName);
			if (res && res.data && res.data.room)
				setOnlineCount(res.data.room.members);
			setInitial(1);
			hideLoader();
		} catch (error) {
			hideLoader();
			let errorMessage = "Error";
			if (error instanceof AxiosError) {
				if (error.status === 409) {
					navigate(`${routes.room}`, { replace: true });
				}
				const errData: any = error.response?.data;
				errorMessage = errData?.message || error.message;
			}
			showToast(errorMessage);
		}
	}

	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		setMessageText(e.target.value);
	}

	async function handleTextOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			try {
				await messageService.create(roomName || "", messageText);
				setMessageText("");
			} catch (error) {
				let errorMessage = "Error";
				if (error instanceof AxiosError) {
					const errData: any = error.response?.data;
					errorMessage = errData?.message || error.message;
				}
				showToast(errorMessage);
			}
		}
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.size && file.type) {
			if (!file.type.includes("pdf") && !file.type.includes("image/")) {
				showToast('Unsupported file type');
				return;
			}
			try {
				const formData = new FormData();
				formData.append('roomName', currentRoomName);
				formData.append('file', file);
				await messageService.upload(formData);
			} catch (error) {
				let errorMessage = "Error";
				if (error instanceof AxiosError) {
					const errData: any = error.response?.data;
					errorMessage = errData?.message || error.message;
				}
				showToast(errorMessage);
			}
		}
	};

	return (
		<Wrapper>
			<section className="p-6 space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
						{constant.title}
					</h1>
					<p>
						<span className="text-gray-400">{constant.onlineTitle}:&nbsp;</span>
						<span className="text-white font-bold">{onlineCount}</span>
					</p>
				</div>
				<div className="flex flex-col items-center justify-between">
					<article className="block w-full h-80 bg-white rounded-lg border border-gray-600"></article>
					<article className="block w-full h-80 bg-gray-700 rounded-lg border border-gray-600 p-2 overflow-y-scroll space-y-1 mt-4 mb-2">
						{messages.map((message, index) => (
							<div key={`message${index}`}>
								<span className="text-white text-sm font-bold">
									{message.user}
									{message.user && ":"}&nbsp;&nbsp;
								</span>
								{message.type === 'file' ? (
									<a href={message.content} target="_blank" className="text-primary-500 text-sm underline">send a file</a>
								) : (
									<span className="text-gray-400 text-sm">{message.content}</span>
								)}
							</div>
						))}
					</article>
					<article className="w-full flex items-center justify-between space-x-2">
						<article className="flex items-center">
							<label
								htmlFor="file-upload"
								className="p-[6px] rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
							>
								<UploadIcon />
							</label>
							<input
								id="file-upload"
								type="file"
								hidden
								accept="image/*,.pdf"
								onChange={handleFileChange}
							/>
						</article>
						<article className="relative flex-1">
							<div className="absolute inset-y-0 right-2 flex items-center pl-3 pointer-events-none">
								<SendIcon />
							</div>
							<input
								type="text"
								className="border text-sm rounded-lg block w-full pr-10 p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
								onChange={handleTextChange}
								value={messageText}
								onKeyDown={handleTextOnKeyDown}
							/>
						</article>
					</article>
				</div>
			</section>
		</Wrapper>
	);
}

function UploadIcon() {
	return (
		<svg
			className="w-6 h-6 text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
			/>
		</svg>
	);
}

function SendIcon() {
	return (
		<svg
			className="w-5 h-5 text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19Z"
			/>
		</svg>
	);
}
