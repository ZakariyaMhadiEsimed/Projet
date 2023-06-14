////////LIBRARY/////////
import { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import { isEmpty, isNull, isUndefined, map } from 'lodash'
///////COMPONENTS///////
import UseOutsideClick from '../../hooks/UseOutsideClick'
import { SelectInputWrapper } from '../../theme/GlobalCss'
import theme from '../../theme/theme'
/////////ASSETS/////////
import DropdownIcon from '../../assets/icones/global/dropdown-white.svg'
import DropdownOrangeIcon from '../../assets/icones/global/dropdown-orange.svg'

/////////STYLED/////////
const ActionsTableWrapper = styled.div`
	width: 100%;
	position: relative;
	height: 100%;
	display: inline-block;
`
const ActionsTableDropdownWrapper = styled(SelectInputWrapper)`
	height: 40px;
	&::after {
		border-color: ${theme.colors.primary};
		background-image: url(${DropdownOrangeIcon});
	}
	${(props) =>
		props.showPaper &&
		`&::after{
            border-left-color: ${theme.colors.white};
            background-color: ${theme.colors.primary};
            background-image: url(${DropdownIcon});`}
	cursor: pointer;
`
const ActionsTableDropdown = styled.div`
	width: 100%;
	line-height: 40px;
	border: 1px solid ${theme.colors.primary};
	border-radius: 3px;
	padding: 0px 30px 0px 0px;
	text-align: center;
	background-color: ${(props) => (props.showPaper ? theme.colors.primary : theme.colors.white)};
	color: ${(props) => (props.showPaper ? theme.colors.white : theme.colors.primary)};
	transition: all 0.1s;
`
const ActionsTableList = styled.div`
	display: ${(props) => (props.showPaper ? 'flex' : 'none')};
	flex-direction: column;
	position: absolute;
	z-index: 5;
	grid-template-columns: max-content;
	justify-content: stretch;
	align-items: stretch;
	background-color: ${theme.colors.white};
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
	min-width: 100%;
`
const ActionsTableItem = styled.div`
	text-align: center;
	line-height: 40px;
	cursor: ${(props: ActionsTableItemProps) => (props.disabled ? 'not-allowed' : 'pointer')};
	${(props: ActionsTableItemProps) => props.disabled && `background-color: ${theme.colors.menu_dark};`}
	padding: 0px 20px;
`
/////////STYLED/////////

/////////TYPES//////////
type ActionsTableProps = {
	row: unknown
	dropdownLabel?: string
	rowActionsConfig: any
	testId?: number
}
type ActionsTableItemProps = {
	disabled: boolean
}
/////////TYPES//////////

const ActionsTable: FC<ActionsTableProps> = ({ row, dropdownLabel = '...', rowActionsConfig, testId }): JSX.Element | null => {
	const [showPaper, setShowPaper] = useState(false)
	const refDropdown = useRef()

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleOpenShowPaper = (): void => {
		setShowPaper(!showPaper)
	}

	UseOutsideClick(refDropdown, () => {
		setShowPaper(false)
		//props.setStateToggleActions(false)
	})

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<ActionsTableWrapper>
			<ActionsTableDropdownWrapper ref={refDropdown} onClick={() => handleOpenShowPaper()} showPaper={showPaper}>
				<ActionsTableDropdown showPaper={showPaper}>{dropdownLabel}</ActionsTableDropdown>
			</ActionsTableDropdownWrapper>
			{!isUndefined(rowActionsConfig.actionsList) &&
				!isEmpty(rowActionsConfig.actionsList) &&
				/*((!isNull(rowActionsConfig.requiredRight) &&
					!isUndefined(find(user.identity.privileges, (o) => o === rowActionsConfig.requiredRight))) ||*/
				isNull(rowActionsConfig.requiredRight) /*)*/ && (
					<ActionsTableList showPaper={showPaper}>
						{map(rowActionsConfig.actionsList, (action) =>
							action.isVisible(row) ? (
								<ActionsTableItem
									data-testid={!isUndefined(testId) && `${action.testIdKey}-${testId}`}
									disabled={!isUndefined(action.disabled) ? action.disabled(row) : false}
									onClick={() =>
										!isUndefined(action.disabled) ? !action.disabled(row) && action.clickAction(row) : action.clickAction(row)
									}
								>
									{action.name}
								</ActionsTableItem>
							) : null
						)}
					</ActionsTableList>
				)}
		</ActionsTableWrapper>
	)
}

export default ActionsTable
