import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "@/contexts/LoaderContext";
import { useToast } from "@/contexts/ToastContext";
import Wrapper from "../Wrapper";
import * as constant from "./constants";
import * as roomService from "@/services/room.service";
import { AxiosError } from "axios";
import { routes } from "@/constants";

interface IRoom {
	name: string;
	joined: number;
	max: number;
}

export default function Home() {
	const navigate = useNavigate();
	const { showLoader, hideLoader } = useLoader();
	const { showToast } = useToast();
	const [initial, setInitial] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [totalPage, setTotalPage] = React.useState(1);
	const [searchText, setSearchText] = React.useState("");
	const [rooms, setRooms] = React.useState<IRoom[]>([]);

	React.useEffect(() => {
		if (initial) return;
		fetchRoomList();
		setInitial(true);
		return () => {};
	}, []);

	React.useEffect(() => {
		if (!initial) return;
		if (searchText.length > 0 && searchText.length < roomService.searchTextMinLength) return;
		fetchRoomList(1);
		return () => {};
	}, [searchText]);

	React.useEffect(() => {
		if (!initial) return;
		fetchRoomList();
		return () => {};
	}, [currentPage]);

	async function fetchRoomList(page?: number) {
		showLoader();
		try {
			const res = await roomService.list(searchText, page || currentPage);
			if (res && res.data) {
				// if (res.data.count) setCount(res.data.count);
				if (res.data.rooms) setRooms(res.data.rooms);
				if (res.data.totalPage) setTotalPage(res.data.totalPage);
				if (res.data.currentPage) setCurrentPage(res.data.currentPage);
			}
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
	}

	async function handleAddRoomClick() {
		showLoader();
		try {
			const res = await roomService.create();
			if (res && res.data && res.data.room && res.data.room.name) {
				const roomName: string = res.data.room.name;
				navigate(`${routes.room}/${roomName}`, { replace: true });
			}
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
	}

	function handleNavigateRoom(roomName: string) {
		navigate(`${routes.room}/${roomName}`, { replace: true });
	}

	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchText(e.target.value);
	};

	function handleNextPageClick() {
		if (currentPage < totalPage) setCurrentPage(currentPage + 1);
	}

	function handlePrevPageClick() {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	}

	function handlePageClick(page: number) {
		setCurrentPage(page);
	}

	return (
		<Wrapper>
			<section className="p-6 space-y-4">
				<h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
					{constant.title}
				</h1>
				<div className="flex items-center justify-between space-x-4">
					<div className="w-full">
						<div className="flex items-center">
							<label htmlFor="simple-search" className="sr-only">
								{constant.searchTitle}
							</label>
							<div className="relative w-full">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<SearchIcon />
								</div>
								<input
									type="text"
									className="border text-sm rounded-lg block w-full pl-10 p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									placeholder={constant.searchPlaceholder}
									onChange={handleTextChange}
									value={searchText}
								/>
							</div>
						</div>
					</div>
					<div className="w-auto">
						<button
							className="flex items-center justify-center text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800"
							onClick={handleAddRoomClick}
						>
							<PlusIcon />
							{constant.addTitle}
						</button>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-400">
						<thead className="text-xs uppercase bg-gray-700 text-gray-400">
							<tr>
								<th scope="col" className="px-4 py-3">
									{constant.tableHeadName}
								</th>
								<th scope="col" className="px-4 py-3 text-right">
									{constant.tableHeadCount}
								</th>
							</tr>
						</thead>
						<tbody>
							{rooms.map((room) => (
								<tr className="border-b border-gray-700" key={room.name}>
									<th
										scope="row"
										className="px-4 py-3 font-medium whitespace-nowrap text-white cursor-pointer"
										onClick={() => handleNavigateRoom(room.name)}
									>
										{room.name}
									</th>
									<td className="px-4 py-3 text-right">{`${room.joined}/${room.max}`}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<nav
					className="flex flex-col md:flex-row justify-center items-start md:items-center space-y-3 md:space-y-0 p-4"
					aria-label="Table navigation"
				>
					<ul className="inline-flex items-stretch -space-x-px">
						<li>
							<PrevButton onClick={handlePrevPageClick} />
						</li>
						{currentPage > 1 && (
							<li>
								<NavigateButton onClick={() => handlePageClick(1)}>1</NavigateButton>
							</li>
						)}
						{currentPage > 2 && (
							<li>
								<NavigateButton onClick={() => {}}>...</NavigateButton>
							</li>
						)}
						{currentPage < totalPage && (
							<li>
								<NavigateButton onClick={() => {}}>
									{currentPage}
								</NavigateButton>
							</li>
						)}
						{currentPage < totalPage - 1 && (
							<li>
								<NavigateButton onClick={() => {}}>...</NavigateButton>
							</li>
						)}
						<li>
							<NavigateButton onClick={() => handlePageClick(totalPage)}>{totalPage}</NavigateButton>
						</li>
						<li>
							<NextButton onClick={handleNextPageClick} />
						</li>
					</ul>
				</nav>
			</section>
		</Wrapper>
	);
}

interface INavigateButtonProp {
	children?: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function NavigateButton({ children, onClick }: INavigateButtonProp) {
	return (
		<button
			onClick={onClick}
			className="flex items-center justify-center h-full min-w-12 py-1.5 px-3 ml-0 border bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
		>
			{children}
		</button>
	);
}

function PrevButton({ onClick }: INavigateButtonProp) {
	return (
		<NavigateButton onClick={onClick}>
			<span className="sr-only">Previous</span>
			<svg
				className="w-5 h-5"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
				/>
			</svg>
		</NavigateButton>
	);
}

function NextButton({ onClick }: INavigateButtonProp) {
	return (
		<NavigateButton onClick={onClick}>
			<span className="sr-only">Next</span>
			<svg
				className="w-5 h-5"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
				/>
			</svg>
		</NavigateButton>
	);
}

function PlusIcon() {
	return (
		<svg
			className="h-3.5 w-3.5 mr-2"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
			/>
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg
			aria-hidden="true"
			className="w-5 h-5 text-gray-400"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
			/>
		</svg>
	);
}
