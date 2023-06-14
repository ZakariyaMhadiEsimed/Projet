import React, { useEffect, useState } from 'react'
import { StyledInput } from '../../theme/GlobalCss'

interface StyledInputPhoneNumberProps {
	setValue: any
	placeholder: string
	hasError: boolean
	name: string
	dataTestId: string
	value?: any
}
const StyledInputPhoneNumber = (props: StyledInputPhoneNumberProps) => {
	const [valueFormatted, setValueFormatted] = useState('')
	const { setValue, placeholder, hasError, name, dataTestId, value } = props
	const handleChange = (event: any) => {
		const inputValue = event.target.value
		// Supprime tous les caractères non numériques
		const numericValue = inputValue.replace(/\D/g, '').slice(0, 10)
		// Formate la valeur en ajoutant un espace tous les deux chiffres
		const formattedValue = numericValue.replace(/(\d{2})(?=\d)/g, '$1 ')
		// Met à jour la valeur de l'input
		setValueFormatted(formattedValue)
		setValue(name, numericValue)
	}

	useEffect(() => {
		if (value) setValueFormatted(value.replace(/(\d{2})(?=\d)/g, '$1 '))
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

export default StyledInputPhoneNumber
