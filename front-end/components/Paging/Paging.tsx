////////LIBRARY/////////
import React, { FC } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { toNumber } from 'lodash'
///////COMPONENTS///////
import RowPerPage from './RowPerPage'
import PagingSelection from './PagingSelection'

/////////STYLED/////////
const PagingWrapper = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 30px;
`
/////////STYLED/////////

/////////TYPES/////////
export type queryParamPagingProps = {
	page: string
	size: string
}
type PagingProps = {
	totalRow: number
	totalPage: number
	fnSendTo: (paging: queryParamPagingProps) => void
}
/////////TYPES//////////

const Paging: FC<PagingProps> = ({ totalRow, totalPage, fnSendTo }) => {
	
	/*const { paggingConfig } = useSelector(
		(state) => ({
			paggingConfig: state.user.paggingConfig,
		}),
		shallowEqual
	)*/

	const { register, handleSubmit, setValue, getValues } = useForm({
		defaultValues: {
			rowPerPage: '250',
			tmpGoTo: '0',
			goToPage: '0',
		},
	})

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const onSubmit = (data: any): void => {
		let page = 0
		if (0 < totalRow && 0 < toNumber(data.rowPerPage)) {
			page = Math.floor(totalRow / data.rowPerPage)
		}
		if (page < toNumber(data.goToPage)) {
			setValue('goToPage', '0')
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
		<PagingWrapper onChange={handleSubmit(onSubmit)}>
			<RowPerPage totalRow={totalRow} register={register} />
			<PagingSelection totalPage={totalPage} register={register} setValue={setValue} getValues={getValues} onSubmit={onSubmit} />
		</PagingWrapper>
	)
}

export default Paging
