import React, { useState } from 'react'
import { StyledInput } from '../../theme/GlobalCss'

interface InputEmailProps {
	value: any
	onChange: (value: any) => void
	name: string
	dataTestId: string
	hasError: boolean
	placeholder: string
}
const InputEmail = (props: InputEmailProps) => {
	const [formattedValue, setFormattedValue] = useState(props.value)

	const handleChange = (event: any) => {
		const inputValue = event.target.value
		setFormattedValue(inputValue)
		if (props.onChange) {
			props.onChange(inputValue.trim())
		}
	}

	const handleBlur = () => {
		setFormattedValue(formattedValue.trim())
	}

	return (
		<StyledInput
			type="email"
			value={formattedValue}
			onChange={handleChange}
			onBlur={handleBlur}
			data-testid={props.dataTestId}
			name={props.name}
			hasError={props.hasError}
			placeholder={props.placeholder}
		/>
	)
}

export default InputEmail
