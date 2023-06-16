////////LIBRARY/////////
import styled from 'styled-components'
import moment from 'moment'
import { FC } from 'react'
import { isUndefined, map } from 'lodash'
import { useTranslation } from 'react-i18next'
///////COMPONENTS///////
import {
	/*FiltersActionsItemProps,
	FilterSelectionType,
	FilterSelectionTypeItem,*/
	PageActionsProps,
} from '../../interfaces/components/PageActions/PageActions.interfaces'
import theme from '../../theme/theme'
import DropdownCheckbox from '../DropdownCheckbox'
import Link from 'next/link'
import { Button } from '../../theme/GlobalCss'
/////////ASSETS/////////
import PrevIcon from '../../assets/icones/global/arrow-left-white.svg'
import DateFilterIcon from '../../assets/icones/dateTimePicker/calendar.svg'
import ExportIcon from '../../assets/icones/global/export.svg'

/////////STYLED/////////
const PageActionsWrapper = styled.div`
	padding: 15px 20px;
	background-color: ${theme.colors.white};
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 15px;
	column-gap: 20px;
`

const PageActionsBloc = styled.div`
	display: flex;
	flex-direction: row;
	column-gap: 20px;
`
const FiltersWrapper = styled.div`
	display: flex;
	flex-direction: row;
	column-gap: 15px;
`
export const PageActionsButtonLink = styled(Link)`
	height: 46px;
	background-color: ${theme.colors.primary};
	color: ${theme.colors.white};
	padding: 15px;
	min-width: 180px;
	font-size: ${theme.text.fontSize.fl};
	font-weight: ${theme.text.fontWeight.medium};
	text-align: center;
	border-radius: 5px;
	transition: background-color 0.2s;
`
export const PageActionsButton: any = styled(Button)`
	margin-left: 0px;
	height: 46px;
	padding: 15px;
	min-width: 180px;
	font-size: ${theme.text.fontSize.fl};
	font-weight: ${theme.text.fontWeight.medium};
	text-align: center;
	border-radius: 5px;
`
export const PageActionsButtonReset = styled(PageActionsButton)``
export const PageActionsButtonExport = styled(PageActionsButton)`
	background-image: url(${ExportIcon});
	background-position: 10% center;
`
export const PageActionsButtonPreviousPage = styled(PageActionsButton)`
	background-position: 15px center;
	background-size: auto 15px;
	background-image: url(${PrevIcon});
	padding: 15px 15px 15px 30px;
`
const ActionsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	column-gap: 20px;
`
const FiltersDateWrapper = styled.div`
	display: flex;
	flex-direction: row;
	column-gap: 17px;
	align-items: center;
	color: ${theme.colors.danger};
	margin-left: auto;
`
const FiltersDateResultWrapper = styled.div`
	& span {
		display: block;
		margin: 0px;
		font-size: ${theme.text.fontSize.fs};
	}
`
const FiltersDatePickerPict = styled.div`
	min-width: 20px;
	cursor: pointer;
	width: 45px;
	height: 45px;
	border-radius: 5px;
	background-color: ${theme.colors.primary};
	:hover {
		background-color: ${theme.colors.primary_200};
	}
	transition: background-color 0.1s;
	background-image: url(${DateFilterIcon});
	background-repeat: no-repeat;
	background-position: center;
`
/////////STYLED/////////

const PageActions: FC<PageActionsProps> = ({ pageActionsConfig, filtersState }): JSX.Element | null => {
	const { t } = useTranslation()

	///////////////////////////////// RENDER ///////////////////////////////////////

	console.log('debugito')
	return (
		<PageActionsWrapper>
			<PageActionsBloc>
				{!isUndefined(pageActionsConfig) && !isUndefined(pageActionsConfig.pageActions) ? (
					<ActionsWrapper>{map(pageActionsConfig.pageActions, (func, k) => func(k))}</ActionsWrapper>
				) : null}
			</PageActionsBloc>
		</PageActionsWrapper>
	)
}

export default PageActions
