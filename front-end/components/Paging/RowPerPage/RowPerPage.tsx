////////LIBRARY/////////
import React, { FC } from 'react'
import { isUndefined, map } from 'lodash'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
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
		margin: 0;
	}
`
const SelectInputWrapperCustom = styled(SelectInputWrapper)`
	&::after {
		border-radius: 0 4px 4px 0;
	}
`
const SelectInputCustom = styled(SelectInput)`
	cursor: pointer;
	height: 45px;
	padding-right: 40px;
	border-radius: 4px;
`
/////////STYLED/////////

/////////TYPES//////////
type RowPerPageProps = {
	totalRow: number
	register: any
}
/////////TYPES//////////

const RowPerPage: FC<RowPerPageProps> = ({ totalRow, register }) => {
	const options = ['20', '50', '100', '250']
	const { t } = useTranslation()

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<RowPerPageWrapper>
			<p>{t('common:text_rowPerPage')} :</p>
			<SelectInputWrapperCustom>
				<SelectInputCustom {...register('rowPerPage')}>
					{map(options, (opt, key) => (
						<option key={key} value={opt}>
							{opt}
						</option>
					))}
				</SelectInputCustom>
			</SelectInputWrapperCustom>
			<p>{`${t('common:text_result_on_quantity')} ${!isUndefined(totalRow) ? totalRow : 0}`}</p>
		</RowPerPageWrapper>
	)
}

export default RowPerPage
