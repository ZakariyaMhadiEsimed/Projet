////////LIBRARY/////////
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { cloneDeep, isUndefined } from 'lodash'
import moment from 'moment'
///////COMPONENTS///////
import DatePicker from '../../components/DateTimePicker'
import Modals from '../../components/Modals/'

///////INTERFACES///////
interface stateDate {
	date: dateObject
	showModal: boolean
	windowPageYOffset: number
	windowPageXOffset: number
}
///////INTERFACES///////

/////////TYPES//////////
type dateObject = {
	startDate?: Date
	endDate?: Date
	timeTouch: boolean
}
/////////TYPES//////////

const UseDatePicker = (props: any): (boolean | stateDate | Dispatch<SetStateAction<Date>> | any)[] => {

	const [showModal, setShowModal] = useState(false)
	const [startDate, setStartDate] = useState<Date>(new Date())
	const [endDate, setEndDate] = useState<Date>(new Date())
	const [timeTouch, setTimeTouch] = useState(false)
	const [windowPageYOffset, setWindowPageYOffset] = useState(0)
	const [windowPageXOffset, setWindowPageXOffset] = useState(0)
	const [noTime, setNoTime] = useState(false)
	const [stateDate, setStateDate] = useState<stateDate>({
		date: {
			startDate: startDate,
			endDate: endDate,
			timeTouch: timeTouch,
		},
		showModal: showModal,
		windowPageYOffset: windowPageYOffset,
		windowPageXOffset: windowPageXOffset,
	})
	const [titleDatePicker, setTitleDatePicker] = useState('')

	/*const { translations } = useSelector(
		(state) => ({
			translations: state.languages.translations,
		}),
		shallowEqual
	)*/

	const [defaultDateState, setDefaultDateState] = useState<stateDate>({
		date: {
			//startDate: {},
			//endDate: {},
			timeTouch: false,
		},
		showModal: false,
		windowPageYOffset: 0,
		windowPageXOffset: 0,
	})

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const startDateHandleChange = (date: Date): void => {
		const prevState = cloneDeep(stateDate)
		// check if time was set by user
		// if not put midnight by default
		if (prevState.date.timeTouch) {
			setStartDate(moment(date).toDate())
		} else if (props?.noPastDate) {
			setStartDate(moment(date).startOf('day').toDate())
		} else {
			setStartDate(moment(date).startOf('day').toDate())
		}
	}

	const endDateHandleChange = (date: Date): void => {
		const prevState = cloneDeep(stateDate)
		// check if time was set by user
		// if not put midnight by default
		if (prevState.date.timeTouch) {
			setEndDate(new Date(date))
		} else {
			setEndDate(moment(date).endOf('day').minute(45).toDate())
		}
	}

	const startTimeHandleChange = (date: Date): void => {
		setStartDate(moment(date).toDate())
		setTimeTouch(true)
	}

	const endTimeHandleChange = (date: Date): void => {
		setEndDate(date)
		setTimeTouch(true)
	}

	const openDateModalHandler = (): void => {
		setShowModal(true)
		setWindowPageYOffset(window.pageYOffset)
		setWindowPageXOffset(window.pageXOffset)

		window.addEventListener('scroll', onScrollHandler)
	}

	const closeDateModalHandler = (): void => {
		setShowModal(false)

		window.removeEventListener('scroll', onScrollHandler)
	}

	const onScrollHandler = (): void => {
		if (showModal) {
			window.scrollTo(windowPageXOffset, windowPageYOffset)
		}
	}

	const getDateFormatToLayout = (date: Date): any => {
		return moment(date).format('DD-MM-YYYY')
	}

	const updateDate = () => {
		//const { date } = this.state;
		const { date }: stateDate = cloneDeep(stateDate)
		// Action need to be variable, we could have multiple use for a datepicker
		//const { actionsDatePicker } = this.props

		//this.defaultState.date = date
		defaultDateState.date = date
		/*const updateStore = {
			startDate: date.startDate,
			endDate: date.endDate,
		}*/

		//if (!isUndefined(props) && !isUndefined(props.actionUpdate)) props.actionUpdate(updateStore)

		// Action need to be variable, we could have multiple use for a datepicker
		//actionsDatePicker.updateDate(updateStore);
		closeDateModalHandler()
	}

	const onClickToDayHandler = (): void => {
		setStartDate(moment().startOf('day').toDate())
		setEndDate(moment().endOf('day').minute(45).toDate())
	}

	const onClickOneWeekHandler = (): void => {
		setStartDate(moment().subtract(7, 'days').startOf('day').toDate())
		setEndDate(moment().endOf('day').minute(45).toDate())
	}

	const onClickOneMonthHandler = (): void => {
		setStartDate(moment().subtract(1, 'months').startOf('day').toDate())
		setEndDate(moment().endOf('day').minute(45).toDate())
	}

	const cancelUpdateHandler = (): void => {
		setStateDate(defaultDateState)
		if (!isUndefined(defaultDateState.date.startDate)) setStartDate(defaultDateState.date.startDate)
		if (!isUndefined(defaultDateState.date.endDate)) setEndDate(defaultDateState.date.endDate)
		setShowModal(false)
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		setStateDate({
			date: {
				startDate: startDate,
				endDate: endDate,
				timeTouch: timeTouch,
			},
			showModal: showModal,
			windowPageYOffset: windowPageYOffset,
			windowPageXOffset: windowPageXOffset,
		})
	}, [startDate, endDate, timeTouch, windowPageXOffset, windowPageYOffset, showModal])

	const renderModal = () => {
		return (
			<Modals
				headerTitle={titleDatePicker}
				closeModalHandler={closeDateModalHandler}
				showModal={showModal}
				insideModal={props?.insideModal ? true : false}
			>
				{!isUndefined(noTime) ? (
					<DatePicker
						toDayHandler={onClickToDayHandler}
						weekSelectHandler={onClickOneWeekHandler}
						monthSelectHandler={onClickOneMonthHandler}
						//closeModalHandler={closeDateModalHandler}
						startDate={startDate}
						endDate={endDate}
						startDateHandleChange={startDateHandleChange}
						endDateHandleChange={endDateHandleChange}
						startTimeHandleChange={startTimeHandleChange}
						endTimeHandleChange={endTimeHandleChange}
						formatDate={getDateFormatToLayout}
						updateDate={updateDate}
						cancelUpdateHandler={cancelUpdateHandler}
						//translations={translations}
						noInterval={props?.noInterval} // If no interval, no min and max date
						noPastDate={props?.noPastDate} // But if this is true, no date before today
						disableStartDate={props?.disableStartDate}
						disableEndDate={props?.disableEndDate}
						noTime={!isUndefined(props?.noTime) ? props.noTime : false}
						priorStartLimit={props?.priorStartLimit}
						priorEndLimit={props?.priorEndLimit}
					/>
				) : (
					isUndefined(noTime) && (
						<DatePicker
							toDayHandler={onClickToDayHandler}
							weekSelectHandler={onClickOneWeekHandler}
							monthSelectHandler={onClickOneMonthHandler}
							//closeModalHandler={closeDateModalHandler}
							startDate={startDate}
							endDate={endDate}
							startDateHandleChange={startDateHandleChange}
							endDateHandleChange={endDateHandleChange}
							startTimeHandleChange={startTimeHandleChange}
							endTimeHandleChange={endTimeHandleChange}
							formatDate={getDateFormatToLayout}
							updateDate={updateDate}
							cancelUpdateHandler={cancelUpdateHandler}
							//translations={translations}
							noInterval={props?.noInterval} // If no interval, no min and max date
							noPastDate={props?.noPastDate} // But if this is true, no date before today
							disableStartDate={props?.disableStartDate}
							disableEndDate={props?.disableEndDate}
							priorStartLimit={props?.priorStartLimit}
							priorEndLimit={props?.priorEndLimit}
						/>
					)
				)}
			</Modals>
		)
	}

	useEffect(() => {
		let inputDateStart
		let inputDateEnd
		if (props?.defaultDateStart || props?.defaultDateEnd) {
			inputDateStart = props.defaultDateStart
			inputDateEnd = props.defaultDateEnd
		} else {
			inputDateStart = moment(new Date()).subtract(2, 'weeks').toDate()
			inputDateEnd = moment(new Date()).toDate()
		}
		setStartDate(inputDateStart)
		setEndDate(inputDateEnd)
		//setStartDate((props?.defaultDateStart) ? props.defaultDateStart : datePicker.startDate);
		//setEndDate((props?.defaultDateEnd) ? props.defaultDateEnd : datePicker.endDate);
		setDefaultDateState({
			date: {
				startDate: inputDateStart,
				endDate: inputDateEnd,
				timeTouch: false,
			},
			showModal: false,
			windowPageYOffset: 0,
			windowPageXOffset: 0,
		})
	}, [])

	return [showModal, openDateModalHandler, renderModal, stateDate, setStartDate, setEndDate]
}

UseDatePicker.propTypes = {}

UseDatePicker.defaultPropTypes = {}

export default UseDatePicker
