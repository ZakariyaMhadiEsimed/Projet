import React, { useEffect, useState } from 'react'
import { StyledInput } from '../../theme/GlobalCss'

interface StyledInputIntegerProps {
	setValue: any
	placeholder: string
	hasError: boolean
	name: string
	dataTestId: string
	maxDigits?: number
	max?: number
	value?: any
	onChange?: any
}
const StyledInputInteger = (props: StyledInputIntegerProps) => {
	const [valueFormatted, setValueFormatted] = useState('')
	const { setValue, placeholder, hasError, name, dataTestId, maxDigits, max, value, onChange } = props
	const handleChange = (event: any) => {
		const inputValue = event.target.value
		// Supprime tous les caractères non numériques
		let numericValue = inputValue.replace(/\D/g, '')
		if (maxDigits) numericValue = numericValue.slice(0, maxDigits)

		if (max) {
			if (numericValue <= max) {
				// Formate la valeur en ajoutant un espace tous les deux chiffres
				const formattedValue = numericValue.replace(/(\d{3})(?=\d)/g, '$1 ')
				// Met à jour la valeur de l'input
				setValueFormatted(formattedValue)
			} else {
				setValueFormatted(max.toString().replace(/(\d{3})(?=\d)/g, '$1 '))
			}
		} else {
			// Formate la valeur en ajoutant un espace tous les deux chiffres
			const formattedValue = numericValue.replace(/(\d{3})(?=\d)/g, '$1 ')
			// Met à jour la valeur de l'input
			setValueFormatted(formattedValue)
		}
		setValue && setValue(name, numericValue)
		onChange(numericValue)
	}

	useEffect(() => {
		if (value) setValueFormatted(value.toString().replace(/(\d{3})(?=\d)/g, '$1 '))
	}, [value])

	return (
		<StyledInput
			onChange={handleChange}
			value={valueFormatted}
			name={name}
			data-testid={dataTestId}
			type="tel"
			hasError={hasError}
			placeholder={placeholder}
		/>
	)
}

export default StyledInputInteger
