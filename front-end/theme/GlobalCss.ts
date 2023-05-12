////////LIBRARY/////////
import styled from 'styled-components'
///////COMPONENTS///////
import theme from './theme'
import {
	ContentWrapperProps,
	IconSquareCssProps,
	ModalButtonWrapperProps,
	PageWrapperProps,
	ButtonCssProps,
	ModalsBodyContainerProps,
	StyledInputProps,
	SelectInputProps,
	SelectInputWrapperProps,
	FormHandlerProps,
	OptionCustomProps,
} from '../interfaces/Interfaces'
/////////ASSETS/////////
import UncheckedIcon from '../assets/icones/global/unchecked.svg'
import CheckedIcon from '../assets/icones/global/checked.svg'
import UncheckedRadioIcon from '../assets/icones/global/unchecked-radio.svg'
import CheckedRadioIcon from '../assets/icones/global/checked-radio.svg'
import SelectDropdownDefaultIcon from '../assets/icones/global/arrow-down.svg'
// import pageActionCreateIcon from '../assets/images/page/add.svg'
// import pageActionRefreshIcon from '../assets/images/page/refresh.svg'
// import pageActionExportIcon from '../assets/images/page/export.svg'

/////////STYLED/////////
export const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: ${(props: ModalButtonWrapperProps) => (props.flex ? props.flex : 'row')};
	justify-content: ${(props: ModalButtonWrapperProps) => (props.multiple ? 'end' : 'center')};
	padding-top: 20px;
	width: 100%;
	row-gap: 20px;
`
export const Button = styled.input`
	height: ${(props) => (!props.height ? 'auto' : `${props.height}px`)};
	width: ${(props) => (!props.width ? 'auto' : props.percentUnit ? `${props.width}%` : `${props.width}px`)};
	background-color: ${(props: ButtonCssProps) => (props.backgroundColor ? props.backgroundColor : theme.colors.primary)};
	background-image: ${(props: ButtonCssProps) => (props.icon ? `url(${props.icon})` : 'none')};
	background-repeat: no-repeat;
	background-position: 95% center;
	text-align: center;
	color: ${(props) => (props.color ? props.color : theme.colors.white)};
	border-radius: 5px;
	border: none;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	font-size: ${(props: ButtonCssProps) => (props.fontSize ? props.fontSize : theme.text.fontSize.fl)};
	margin: auto;
	transition: background-color 0.2s, color 0.2s, opacity 0.2s;
	opacity: 1;
	:hover {
		background-color: ${(props: ButtonCssProps) => props.hoverBackgroundColor};
		color: ${(props: ButtonCssProps) => props.hoverColor};
		opacity: ${(props: ButtonCssProps) => (props.hoverBackgroundColor ? 1 : 0.8)};
	}
	padding: 9px 20px;
`
export const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 10px;
`
export const InputLabelWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`
export const InputLabel = styled.label`
	font-size: ${theme.text.fontSize.fm};
	font-weight: ${theme.text.fontWeight.medium};
	padding-right: 10px;
	white-space: nowrap;
`
export const InputErrorMessage = styled.span`
	font-size: 14px;
	color: ${theme.colors.danger};
	text-align: right;
`
export const StyledInput = styled.input`
	height: 44px;
	width: -webkit-fill-available;
	border-radius: 5px;
	border: 1px solid ${(props: StyledInputProps) => (props.hasError ? theme.colors.border.error : theme.colors.border.grey)};
	padding-left: 15px;
	box-sizing: border-box;
	font-size: ${theme.text.fontSize.fm};
	:focus {
		outline: none !important;
		border-color: ${theme.colors.info_200};
	}
	:-webkit-autofill,
	:-webkit-autofill:hover,
	:-webkit-autofill:focus,
	:-webkit-autofill:active {
		transition: background-color 5000s ease-in-out 0s;
		box-shadow: 0 0 0px 1000px ${theme.colors.white} inset;
	}
	::placeholder {
		color: ${(props: StyledInputProps) => (props.hasError ? theme.colors.danger : theme.colors.secondary_400)};
		font-size: ${theme.text.fontSize.fm};
	}
	background-color: ${theme.colors.light_500};
	position: relative;
`
export const CheckboxWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	column-gap: 8px;
	& > input[type='checkbox'] {
		margin: 0px;
		width: 15px;
		height: 15px;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url(${UncheckedIcon});
	}
	& > input[type='checkbox']:checked {
		background-image: url(${CheckedIcon});
	}
	& > label {
		font-size: ${theme.text.fontSize.fm};
		font-weight: ${theme.text.fontWeight.regular};
	}
`
export const StyledLink = styled.div`
	font-size: ${theme.text.fontSize.fm};
	font-weight: ${theme.text.fontWeight.regular};
	text-align: ${(props) => (props.align ? props.align : 'initial')};
	:hover {
		text-decoration: underline;
		color: ${theme.colors.primary_200};
		cursor: pointer;
	}
`
export const PageWrapper = styled.div`
	min-width: ${(props: PageWrapperProps) => (props.noFilters ? '100%' : 'calc(100% - 369px)')};
`
export const ContentWrapper = styled.div`
	box-shadow: ${(props: ContentWrapperProps) => (props.displayMode === 'list' ? 'none' : '0px 20px 100px #bf156c0d')};
	border-radius: ${(props: ContentWrapperProps) => (props.displayMode === 'list' ? '0px' : '20px')};
	background-color: ${(props: ContentWrapperProps) => (props.displayMode === 'list' ? 'transparent' : theme.colors.white)};
	color: ${theme.colors.dark};
`
export const PageFiltersWrapper = styled.div`
	width: 329px;
	position: fixed;
	left: 40px;
	z-index: 5;
	display: flex;
	flex-direction: column;
	row-gap: 50px;
`
export const SimpleContentWrapper = styled.div`
	padding: 40px;
`
export const ModalsBodyContainer = styled.div`
	padding: 0px 20px;
	border-top: ${(props: ModalsBodyContainerProps) => (props.hasTitle ? `1px solid ${theme.colors.light}` : 'none')};
	border-bottom: 1px solid ${theme.colors.light};
`
export const SelectInputWrapper = styled.div`
	width: ${(props: SelectInputWrapperProps) => (props.width ? `${props.width}px` : '100%')};
	&::after {
		content: '';
		width: 32px;
		height: ${(props: SelectInputWrapperProps) => (props.heightAfter ? `${props.heightAfter}%` : ' 100%')};
		background-color: ${theme.colors.white};
		pointer-events: none;
		position: absolute;
		border-radius: ${(props) => (props.reverseMode ? '3px 0px 0px 3px' : '0px 3px 3px 0px')};
		border: 1px solid ${(props: SelectInputProps) => (props.hasError ? theme.colors.border.error : theme.colors.border.grey)};
		box-sizing: border-box;
		right: ${(props: SelectInputWrapperProps) => (props.reverseMode ? 'unset' : '0px')};
		left: ${(props: SelectInputWrapperProps) => (props.reverseMode ? '0px' : 'unset')};
		background-image: url(${SelectDropdownDefaultIcon});
		background-repeat: no-repeat;
		background-position: center;
		transition: background-color 0.1s;
	}
	position: relative;
	display: flex;
	align-items: ${(props) => (props.alignItems ? props.alignItems : null)};
	& .active {
		color: ${theme.colors.dark_100};
	}
	${(props: SelectInputWrapperProps) =>
		props.hasError &&
		`& > select {
		border: 1px solid ${theme.colors.border.error};
		color: ${theme.colors.danger};
		
	}`}
`
export const SelectInput = styled.select`
	height: 46px;
	width: ${(props: SelectInputProps) => (props.width ? `${props.width}px` : '100%')};
	border-radius: 5px;
	border: 1px solid ${theme.colors.border.grey};
	box-sizing: border-box;
	padding-left: ${(props: SelectInputProps) => (props.reverseMode ? '45px' : '13px')};
	padding-right: ${(props: SelectInputProps) => (props.reverseMode ? '13px' : '45px')};
	background-color: ${theme.colors.light_500};
	color: ${theme.colors.secondary_400};
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	font-size: ${theme.text.fontSize.fm};
	&:focus {
		outline: none !important;
		border-color: ${theme.colors.info_200};
	}
	-webkit-appearance: none;
`
export const OptionCustom = styled.option`
	color: ${(props: OptionCustomProps) => props.target && theme.colors.dark_100};
`
export const RadioWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	column-gap: 8px;
	& > input[type='radio'] {
		margin: 0px;
		width: 17px;
		height: 17px;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url(${UncheckedRadioIcon});
	}
	& > input[type='radio']:checked {
		background-image: url(${CheckedRadioIcon});
	}
	& > label {
		font-size: ${theme.text.fontSize.fm};
		font-weight: ${theme.text.fontWeight.regular};
	}
`
export const RadioInput = styled.input``
export const RadioInputLabel = styled.label``
export const PageFormTitle = styled.span`
	font-size: ${theme.text.fontSize.fl};
	color: ${theme.colors.secondary_400};
	display: inline-block;
	margin-bottom: 20px;
`
export const PageFormHandler = styled.div`
	padding: 20px;
	background-color: white;
`
export const FormInputLabelWrapper = styled(InputLabelWrapper)`
	flex-direction: column;
	& span {
		text-align: left;
	}
`
export const FormHandler = styled.div`
	display: grid;
	grid-template-columns: ${(props: FormHandlerProps) => `repeat(${props.formCols}, auto)`};
	grid-column-gap: 50px;
	align-items: start;
	height: 100%;
`
export const PageFormColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 12px;
`

export const PageFormFieldWrapper = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 270px;
	row-gap: 12px;
`
/////////STYLED/////////
