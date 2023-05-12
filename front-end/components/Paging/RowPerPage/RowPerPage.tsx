////////LIBRARY/////////
import React, { FC } from 'react'
import { map, isUndefined } from 'lodash'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { UseFormRegister } from 'react-hook-form'
///////COMPONENTS///////
import { SelectInput, SelectInputWrapper } from '../../../theme/GlobalCss'

/////////STYLED/////////
const RowPerPageWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(min-content, max-content));
	grid-column-gap: 5px;
	justify-content: center;
	align-items: center;
	p {
		margin: 0px;
	}
`
const SelectInputWrapperCustom = styled(SelectInputWrapper)`
	&::after {
		border-radius: 0px;
	}
`
const SelectInputCustom = styled(SelectInput)`
	cursor: pointer;
	line-height: 30px;
	height: 35px;
	padding-right: 40px;
	border-radius: 0px;
`
/////////STYLED/////////

/////////TYPES//////////
type RowPerPageProps = {
	totalRow: number
	register: UseFormRegister<any>
}
/////////TYPES//////////

const RowPerPage: FC<RowPerPageProps> = ({ totalRow, register }) => {

	const options = ['20', '50', '100', '250']
	const { t } = useTranslation()

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<RowPerPageWrapper>
			<p>{t('common:common_text_rowPerPage')} :</p>
			<SelectInputWrapperCustom>
				<SelectInputCustom name="rowPerPage" {...register}>
					{map(options, (opt, key) => (
						<option key={key} value={opt}>
							{opt}
						</option>
					))}
				</SelectInputCustom>
			</SelectInputWrapperCustom>
			<p>{`${t('common:common_text_result_on_quantity')} ${!isUndefined(totalRow) ? totalRow : 0}`}</p>
		</RowPerPageWrapper>
	)
}

export default RowPerPage
