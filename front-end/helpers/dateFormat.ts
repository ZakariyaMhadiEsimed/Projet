import moment from 'moment'

class DateFormat {
	static isToday(date: Date): boolean {
		return moment().isSame(moment(date), 'day')
	}

	/**
	 *
	 * @param   {Date} date              js date time
	 * @param   {number} stepTime        step to add to date
	 * @returns {Date | undefined}
	 */
	static toDayWithStepDateTimeInMinutes(date: Date, stepTime: number): Date | undefined {
		const newDate = moment(date)
		const dateNow = moment().add(stepTime, 'm').toDate()
		return this.roundDateTime(
			newDate
				.set({
					hour: dateNow.getHours(),
					minute: dateNow.getMinutes(),
					second: dateNow.getSeconds(),
				})
				.toDate()
		)
	}

	/**
	 * check if dateEnd is inferior or equal of dateStart
	 * @param   {Date} dateStart
	 * @param   {Date} dateEnd
	 * @returns {boolean}
	 */
	static dateEndIsBefore(dateStart: Date, dateEnd: Date): boolean {
		return moment(dateEnd).isSameOrBefore(moment(dateStart), 'minute')
	}

	static roundDateTime(date: Date): Date | undefined {
		const timeMinutes = date.getMinutes()
		if (timeMinutes > 45) {
			return moment(date)
				.set({
					hour: date.getHours() + 1,
					minute: 0,
					second: 0,
				})
				.toDate()
		} else if (timeMinutes > 30) {
			return moment(date).minute(45).toDate()
		} else if (timeMinutes > 15) {
			return moment(date).minute(30).toDate()
		} else if (timeMinutes > 0) {
			return moment(date).minute(15).toDate()
		}
	}

	static getDateDependOfNow(date: Date): Date | undefined {
		if (this.dateIsBeforeNow(date)) {
			return this.toDayWithStepDateTimeInMinutes(date, 15)
		} else {
			return moment(date).toDate()
		}
	}

	static dateIsBeforeNow(date: Date): boolean {
		return moment(date).isBefore(moment())
	}

	static dateIsAfterNow(date: Date): boolean {
		return moment(date).isSameOrAfter(moment(), 'day')
	}

	/**
	 *  calculate minTime for startTime in date picker component
	 * @param {Date} startTime selected by user
	 * @param {boolean} isToday if statTime is today
	 * @return {Date | undefined} minTime for datePicker startTime
	 */
	static minStartTimeCalculate(startTime: Date, isToday = false): Date | undefined {
		let startTimeCalculate: Date | undefined = moment(startTime).startOf('day').toDate()
		if (isToday) {
			startTimeCalculate = this.toDayWithStepDateTimeInMinutes(new Date(), 0)
		}
		return startTimeCalculate
	}

	/**
	 * calculate maxTime for startTime in date picker component
	 * @param {Date} startTime selected by user
	 * @param {Date} endTime selected by user
	 * @param {boolean} isSameDay if startTime and endTime are same day
	 * @return {Date | undefined} maxTime for date picker startTime
	 */
	static maxStartTimeCalculate(startTime: Date, endTime: Date, isSameDay = false): Date | undefined {
		let endTimeCalculate = moment(startTime).endOf('day').toDate()
		if (isSameDay) {
			endTimeCalculate = moment(endTime).subtract(15, 'minutes').toDate()
		}
		return endTimeCalculate
	}

	/**
	 * calculate minTime for endTime in date picker component
	 * @param {Date} startTime selected by user
	 * @param {Date} endTime selected by user
	 * @param {boolean} isSameDay if startTime and endTime are same day
	 * @return {Date | undefined} minTime for datePicker endTime
	 */
	static minEndTimeCalculate(startTime: Date, endTime: Date, isSameDay = false): Date | undefined {
		let startTimeCalculate: Date | undefined = moment(endTime).startOf('day').toDate()
		if (isSameDay) {
			if (this.dateIsBeforeNow(startTime)) {
				startTimeCalculate = DateFormat.toDayWithStepDateTimeInMinutes(new Date(), 0)
			} else {
				startTimeCalculate = moment(startTime).add(15, 'm').toDate()
			}
		}
		if (this.isToday(endTime)) {
			startTimeCalculate = this.toDayWithStepDateTimeInMinutes(new Date(), 0)
		}
		return startTimeCalculate
	}

	/**
	 * calculate minDate for endDate in date picker component
	 * @param {Date} startDate selected by user
	 * @param {boolean} isStarted if promotion is started
	 * @return {Date | undefined} minDate for date picker end date
	 */
	static minEndDateCalculate(startDate: Date, isStarted = false): Date | undefined {
		let endDateMin: Date | undefined = moment(startDate).add(15, 'minutes').toDate()
		if (isStarted) {
			endDateMin = this.toDayWithStepDateTimeInMinutes(new Date(), 0)
		}
		return endDateMin
	}
}

export default DateFormat
