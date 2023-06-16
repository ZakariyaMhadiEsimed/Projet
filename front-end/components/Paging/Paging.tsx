////////LIBRARY/////////
import React, { FC } from 'react'
import styled from 'styled-components'
import { toNumber } from 'lodash'
///////COMPONENTS///////
import RowPerPage from './RowPerPage'
import PagingSelection from './PagingSelection'

/////////STYLED/////////
const PagingWrapper = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
	${(props: PagingWrapperProps) => props.mode === 'pagingSelection' && `margin-top: 30px; position: relative;`}
	${(props: PagingWrapperProps) => props.mode === 'rowPerPage' && `margin-left: auto`}
`
/////////STYLED/////////

/////////TYPES/////////
export type queryParamPagingProps = {
	page: string
	size: string
}
type PagingWrapperProps = {
	mode: string
}
type PagingProps = {
	totalRow: number
	totalPage: number
	fnSendTo: (paging: queryParamPagingProps) => void
	pagingConfig: any
	mode: 'rowPerPage' | 'pagingSelection'
}
/////////TYPES//////////

const Paging: FC<PagingProps> = ({ totalRow, totalPage, fnSendTo, pagingConfig, mode }) => {
	///////////////////////////////// HANDLE ///////////////////////////////////////

	const onSubmit = (data: any): void => {
		let page = 0
		if (0 < totalRow && 0 < toNumber(data.rowPerPage)) {
			page = Math.floor(totalRow / data.rowPerPage)
		}
		if (page < toNumber(data.goToPage)) {
			pagingConfig.setValue('goToPage', '0')
			data.goToPage = '0'
			data.tmpGoTo = '0'
		}
		//let queryParamPaging
		//if (isEmpty(paggingConfig)) {
		const queryParamPaging: queryParamPagingProps = {
			page: data.goToPage,
			size: data.rowPerPage,
		}
		// } else {
		// 	queryParamPaging = {
		// 		page: data.goToPage,
		// 		size: data.rowPerPage,
		// 		sort: paggingConfig?.data?.sort,
		// 		nameDir: paggingConfig?.data?.nameDir,
		// 	}
		// }
		fnSendTo(queryParamPaging)
	}

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<PagingWrapper onChange={pagingConfig.handleSubmit(onSubmit)} mode={mode}>
			{mode === 'rowPerPage' && <RowPerPage totalRow={totalRow} register={pagingConfig.register} />}
			{mode === 'pagingSelection' && (
				<PagingSelection
					totalPage={totalPage}
					register={pagingConfig.register}
					setValue={pagingConfig.setValue}
					getValues={pagingConfig.getValues}
					onSubmit={onSubmit}
				/>
			)}
		</PagingWrapper>
	)
}

export default Paging
