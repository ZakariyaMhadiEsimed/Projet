///////COMPONENTS///////
import styled from 'styled-components'
import theme from '../../theme/theme'

const StyledFormRadio = styled.input<{ hasError?: boolean }>`
	height: 1rem;
	width: 1rem;
	border-color: ${theme.colors.border.grey};
	color: ${theme.colors.primary_200};
	cursor: pointer;
	accent-color: ${theme.colors.primary_200};
	:disabled {
		cursor: default;
	}
`
interface IFormInputProps {
	label?: string | null
	placeholder?: string | null
	mask?: string
	maskChar?: string
	formatChars?: any
	error?: string | any | undefined
	onChange?: (arg0: any) => void
	onChangeInput?: (s: string) => void
	value?: string | number | string[]
	name: string
	checked?: boolean
	children?: JSX.Element
	disabled?: boolean
	isRequired?: boolean
	dataList?: any
	target?: string
	onClick?: any
	isPlaceHolder?: boolean
	isPassword?: boolean
	onBlur?: any
	onMinus?: () => void
	onPlus?: () => void
	refInput?: any
	hasError?: boolean
	minValue?: number
	dataListKeys?: string[]
	showLabel?: boolean
	onKeyDown?: any
	row?: number
	displayIcon?: any
	isCheckBox?: boolean
}
const FormRadio = ({ label, onChange, value, name, checked, error, disabled, isCheckBox, onClick }: IFormInputProps): JSX.Element => {
	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				opacity: disabled ? '0.6' : '1',
				cursor: disabled ? 'pointer' : 'not-allowed',
				marginRight: '20px',
			}}
		>
			<StyledFormRadio
				disabled={disabled}
				hasError={!!error}
				checked={checked}
				value={value}
				onChange={onChange}
				id={`label-${label}`}
				name={name}
				type={isCheckBox ? 'checkbox' : 'radio'}
				onClick={onClick}
			/>
			<label
				style={{ marginLeft: '5px' }}
				htmlFor={`label-${label}`} /*className={joinClassNames('ml-2 text-sm', disabled ? '' : 'cursor-pointer')}*/
			>
				{label}
			</label>
		</div>
	)
}

export default FormRadio
