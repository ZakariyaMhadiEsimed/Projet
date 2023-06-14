////////LIBRARY/////////
import { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { find, isEmpty, isUndefined } from 'lodash'
import styled from 'styled-components'
import ReactDataGrid, { SortColumn } from 'react-data-grid'
///////COMPONENTS///////
import { tableConfigProps } from '../../interfaces/components/TableHandler/TableHandler.interfaces'
import 'react-data-grid/lib/styles.css'
import theme from '../../theme/theme'
import Paging from '../Paging'
/////////ASSETS/////////
import ResetSearchIcon from '../../assets/icones/global/close-red.svg'
import SearchIcon from '../../assets/icones/global/zoom-in.svg'

/////////STYLED/////////
const TableWrapper = styled.div`
	padding: 10px 20px 20px 20px;
	background-color: ${theme.colors.white};
	flex: 0 0 100%;
`
const TableHeaderWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`
const TableTitleWrapper = styled.span`
	font-size: ${theme.text.fontSize.fl};
	color: ${theme.colors.secondary_400};
`
const CustomReactDataGrid = styled(ReactDataGrid)`
	background-color: ${theme.colors.white};
	height: 65vh;
	border: 1px solid ${theme.colors.light};
	& .rdg-header-row {
		background-color: ${theme.colors.light};
	}
	& .rdg-row-odd {
		background-color: ${theme.colors.table.odd};
	}
	& .rdg-row-odd:hover {
		background-color: ${theme.colors.table.oddHover};
	}
	& .rdg-row-even {
		background-color: ${theme.colors.table.even};
	}
	& .rdg-row-even:hover {
		background-color: ${theme.colors.table.evenHover};
	}
	& .rdg-cell {
		border-inline-end: 1px solid ${theme.colors.light};
		border-block-end: 1px solid ${theme.colors.light};
		user-select: none;
	}
	${(props: CustomReactDataGridProps) =>
		props.hasActions &&
		`
		& .rdg-cell-frozen[aria-selected="true"]{
			overflow: visible;
			z-index: 5;
		}
	`}
	grid-template-columns: repeat(
		${(props: any) => props.columns.length},
		${(props: CustomReactDataGridProps) => (!isUndefined(props.rowSizing) ? props.rowSizing : 'auto')}
	) !important;
	overflow: auto;
	scrollbar-width: thin;
	scrollbar-color: ${theme.colors.light} ${theme.colors.white};
	&::-webkit-scrollbar {
		width: 10px;
	}
	&::-webkit-scrollbar-track {
		background-color: ${theme.colors.white};
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${theme.colors.light};
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${theme.colors.table.oddHover};
	}
`
const FreeSearchWrapper = styled.div`
	position: relative;
	& > * > input {
		font-size: ${theme.text.fontSize.fs};
	}
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	column-gap: 10px;
	justify-content: end;
	margin-bottom: 10px;
`
const SearchInputWrapper = styled.div`
	width: 220px;
	position: relative;
`
const SearchBarButton = styled.div`
	width: 36px;
	height: 35px;
	background-color: ${theme.colors.white};
	border-radius: 22px 0px 0px 22px;
	left: 1px;
	top: 1px;
	background-image: url('${SearchIcon}');
	background-repeat: no-repeat;
	background-position: center;
	position: absolute;
	cursor: pointer;
	transition: background-color 0.1s;
`
const SearchBarInput: any = styled.input`
	width: 100%;
	height: 37px;
	border-radius: 22px;
	:focus {
		outline: none !important;
		border-color: ${theme.colors.primary};
	}
	padding-left: 37px;
	border: 1px solid ${theme.colors.light_400};
`
const SearchReset = styled.div`
	background-image: url('${ResetSearchIcon}');
	background-repeat: no-repeat;
	background-position: center;
	cursor: pointer;
	width: 10px;
	height: 10px;
`
/////////STYLED/////////

/////////TYPES//////////
type TableHandlerProps = {
	createRows: Array<any>
	cols: Array<any>
	config: tableConfigProps
	pagingConfig?: any
	paging: any
	sortSetter: Dispatch<SetStateAction<string | undefined>>
}
type CustomReactDataGridProps = {
	hasActions: boolean
	rowSizing: string | undefined
}
/////////TYPES//////////

const TableHandler: FC<TableHandlerProps> = ({ createRows, cols, config, pagingConfig, paging, sortSetter }): React.ReactElement => {
	const [rows, setRows] = useState(createRows)
	const [sortColumns, setSortColumns] = useState<SortColumn[]>(!isUndefined(config?.defaultSort) ? [config.defaultSort] : [])
	const searchRef = useRef()
	const columns = useMemo(() => cols, [cols])

	const sortedRows = useMemo((): any[] => {
		if (sortColumns.length === 0) return rows
		return [...rows].sort((a, b) => {
			for (const sort of sortColumns) {
				const comparator = config.getComparator(sort.columnKey)
				const compResult = comparator(a, b)
				if (compResult !== 0) {
					return sort.direction === 'ASC' ? compResult : -compResult
				}
			}
			return 0
		})
	}, [config, rows, sortColumns])

	///////////////////////////////// HANDLE ///////////////////////////////////////

	// Resetting search
	const handleReset = (ref: MutableRefObject<any>): void => {
		config.searchBarComponent.handleReset(ref)
	}

	const handleSort = (props: SortColumn[]): void => {
		const colObj = find(cols, { key: props[0].columnKey })
		if (!isUndefined(colObj)) {
			const sortString = `${colObj.sortColumnName},${props[0].direction}`
			sortSetter(sortString)
		}
	}

	// TODO : useful functions for skeleton approach, checking later if really useful
	function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
		return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight
	}

	async function handleScroll(event: React.UIEvent<HTMLDivElement>): Promise<void> {
		//if (isLoading || !isAtBottom(event)) return
		// Adding skeleton lines
		// Await the data fetcher for calling lines
		// Setting items, but with the config props
		/*setIsLoading(true)

		const newRows = await loadMoreRows(50, rows.length, true)

		setRows([...rows, ...newRows])
		setIsLoading(false)*/
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		setRows(createRows)
	}, [createRows])

	useEffect(() => {
		if (!isEmpty(sortColumns)) {
			handleSort(sortColumns)
		}
	}, [sortColumns])

	///////////////////////////////// RENDER ///////////////////////////////////////
	return (
		<>
			<TableWrapper>
				<TableHeaderWrapper>
					{config?.tableTitle && <TableTitleWrapper>{config?.tableTitle}</TableTitleWrapper>}
					{config?.searchBarComponent && (
						<FreeSearchWrapper>
							<SearchInputWrapper>
								<SearchBarButton onClick={() => config?.searchBarComponent.handleClickSearch(searchRef)} />
								<SearchBarInput
									ref={searchRef}
									onKeyDown={(e: any) => config?.searchBarComponent.handleSearchEnter(e, e.target.value)}
									placeholder={'Rechercher'}
									defaultValue={config?.searchBarComponent.defaultValue}
									onBlur={() => config?.searchBarComponent.handleClickSearch(searchRef)}
								/>
							</SearchInputWrapper>
							{searchRef?.current?.value?.length > 0 && <SearchReset onClick={() => handleReset(searchRef)} />}
						</FreeSearchWrapper>
					)}
				</TableHeaderWrapper>
				<CustomReactDataGrid
					columns={columns}
					rows={sortedRows}
					onRowsChange={setRows}
					sortColumns={sortColumns}
					onSortColumnsChange={setSortColumns}
					onScroll={handleScroll}
					rowHeight={50}
					direction={'ltr'}
					className={'fill-grid'}
					hasActions={!isUndefined(find(columns, { key: 'Actions' }) ? true : false)}
					rowSizing={config.rowSizing}
					enableVirtualization={false}
				/>
				{!isUndefined(paging) && pagingConfig && (
					<Paging
						totalRow={paging?.totalElements}
						totalPage={paging?.totalPages}
						fnSendTo={paging?.fnSendTo}
						pagingConfig={pagingConfig}
						mode="pagingSelection"
					/>
				)}
			</TableWrapper>
		</>
	)
}

export default TableHandler
