import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const DatePickerInput = ({ value, onChange }) => {
	const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)

	const handleDateChange = (date) => {
		setSelectedDate(date)
		if (onChange) {
			onChange(date.toISOString().substr(0, 10))
		}
	}

	return (
		<DatePicker
			locale="fr"
			selected={selectedDate}
			onChange={handleDateChange}
			dateFormat="dd/MM/yyyy"
			showYearDropdown={true}
			scrollableYearDropdown={true}
			yearDropdownItemNumber={100}
			maxDate={new Date()}
			isClearable
			//maxDate={moment(new Date()).subtract(18, 'years').toDate()}
			placeholderText="Sélectionner une date"
		/>
	)
}

export default DatePickerInput
