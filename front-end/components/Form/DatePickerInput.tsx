import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import styled from 'styled-components'
import { isNull } from 'lodash'

const StyledDatePicker = styled(DatePicker)`
	border: ${(props: any) => props.hasError && '1px solid red !important'};
	::placeholder {
		color: ${(props: any) => props.hasError && 'red !important'};
	}
`
interface DatePickerInputProps {
	value: any
	onChange: any
	maxDate: Date
	name?: string
	hasError?: boolean
}
const DatePickerInput = (props: DatePickerInputProps) => {
	const { value, onChange, maxDate, hasError } = props
	const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
	const handleDateChange = (date: any) => {
		setSelectedDate(date)
		if (onChange && !isNull(date)) {
			onChange(moment(date).format('DD-MM-YYYY'))
		} else onChange('')
	}

	useEffect(() => {
		if (value) setSelectedDate(new Date(value))
	}, [value])

	return (
		<StyledDatePicker
			locale="fr"
			selected={selectedDate}
			onChange={handleDateChange}
			dateFormat="dd/MM/yyyy"
			showYearDropdown={true}
			scrollableYearDropdown={true}
			yearDropdownItemNumber={100}
			maxDate={maxDate}
			isClearable
			//maxDate={moment(new Date()).subtract(18, 'years').toDate()}
			placeholderText="Sélectionner une date"
			hasError={hasError}
		/>
	)
}

export default DatePickerInput
