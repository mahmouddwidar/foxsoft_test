// src/components/Pagination.tsx
import React from "react";
import { DOTS, usePagination } from "../hooks/usePagination";
import LeftArrow from "./icons/LeftArrow";
import RightArrow from "./icons/RightArrow";

interface PaginationProps {
	onPageChange: (page: number) => void;
	totalCount: number;
	siblingCount?: number;
	currentPage: number;
	pageSize: number;
}

const Pagination: React.FC<PaginationProps> = ({
	onPageChange,
	totalCount,
	siblingCount = 1,
	currentPage,
	pageSize,
}) => {
	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	const lastPage = paginationRange[paginationRange.length - 1];

	return (
		<ul className="flex items-center gap-1">
			{/* Left navigation arrow */}
			<li
				className={`flex size-8 cursor-pointer items-center justify-center rounded-full ${
					currentPage === 1
						? "pointer-events-none text-gray-400"
						: "hover:bg-gray-100"
				}`}
				onClick={onPrevious}
			>
				<div className="size-4">
					<LeftArrow />
				</div>
			</li>
			{paginationRange.map((pageNumber, index) => {
				if (pageNumber === DOTS) {
					return (
						<li
							key={`dots-${index}`}
							className="flex size-8 items-center justify-center"
						>
							&#8230;
						</li>
					);
				}

				return (
					<li
						key={pageNumber}
						className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-sm ${
							pageNumber === currentPage
								? "bg-indigo-600 text-white"
								: "hover:bg-gray-100"
						}`}
						onClick={() => onPageChange(Number(pageNumber))}
					>
						{pageNumber}
					</li>
				);
			})}
			{/* Right navigation arrow */}
			<li
				className={`flex size-8 cursor-pointer items-center justify-center rounded-full ${
					currentPage === lastPage
						? "pointer-events-none text-gray-400"
						: "hover:bg-gray-100"
				}`}
				onClick={onNext}
			>
				<div className="size-4">
					<RightArrow />
				</div>
			</li>
		</ul>
	);
};

export default Pagination;
