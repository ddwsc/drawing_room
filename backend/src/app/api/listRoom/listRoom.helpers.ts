export function countTotalPages(totalRows: number, pageSize: number) {
	return Math.ceil(totalRows / pageSize);
}
