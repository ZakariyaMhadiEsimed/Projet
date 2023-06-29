////////LIBRARY/////////
import React from 'react'
import Image from 'next/image'
///////COMPONENTS///////
import { InputLabelRequired } from '../../theme/GlobalCss'
import iconErrorCircle from '../../assets/icones/global/close-red.svg'
import styled from 'styled-components'
import theme from '../../theme/theme'
export const StyledFormErrorContainer = styled.div`
	//twtext-primary text-xs p-1
`
export const StyledFormLabel = styled.label`
	//block text-sm font-medium text-gray-700
`
export const StyledFormSelect = styled.select<{ hasError?: boolean; disabled?: boolean; isPlaceHolder?: boolean }>`
	//STYLE_FORM_INPUT_TW
	//STYLE_FORM_INPUT
	height: 44px;
	width: -webkit-fill-available;
	border-radius: 5px;
	border: 1px solid ${(props: any) => (props.hasError ? theme.colors.border.error : theme.colors.border.grey)};
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
		color: ${(props: any) => (props.hasError ? theme.colors.danger : theme.colors.secondary_400)};
		font-size: ${theme.text.fontSize.fm};
	}
	background-color: ${theme.colors.light_500};
	border: 1px solid ${(props: any) => (props.hasError ? theme.colors.border.error : theme.colors.border.grey)};
	background-color: ${(props: any) => (props.disabled ? theme.colors.border.error : theme.colors.white)};
	color: ${(props) => (props.isPlaceHolder || props.disabled) && 'grey'};
	font-style: ${(props) => (props.isPlaceHolder || props.disabled) && 'italic'};
`
const FormSelect = ({ label, error, name, value, onChange, children, disabled, isPlaceHolder, isRequired }: any): JSX.Element => {
	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<div className={'w-full'}>
			<div className={'relative'}>
				<StyledFormSelect
					hasError={!!error}
					value={value}
					name={name}
					onChange={onChange}
					id="pet-select"
					disabled={disabled}
					isPlaceHolder={isPlaceHolder}
				>
					{children}
				</StyledFormSelect>
			</div>
		</div>
	)
}

export default FormSelect
