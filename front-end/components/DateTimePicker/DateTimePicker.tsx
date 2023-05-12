////////LIBRARY/////////
import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import styled from 'styled-components'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
///////COMPONENTS///////
import { fr } from 'date-fns/locale'
import theme from '../../theme/theme'
import DateFormat from '../../helpers/dateFormat'
/////////ASSETS/////////
import imgValidate from '../../assets/icones/dateTimePicker/check.svg'
import imgCancel from '../../assets/icones/dateTimePicker/close-white.svg'

/////////STYLED/////////
const ModalDateTimeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: ${(props: DateTimePickerComponentProps) => (props.noInterval ? 'center' : 'space-around')};
	padding: 20px 20px 0px 20px;
	& > * {
		font-size: ${theme.text.fontSize.fs} !important;
	}
	& .react-datepicker__day--keyboard-selected {
		background-color: ${(props: DateTimePickerComponentProps) => (props.firstDate ? null : 'transparent')};
		color: ${(props: DateTimePickerComponentProps) => (props.firstDate ? null : theme.colors.dark)};
		border: 1px solid ${theme.colors.primary};
		font-weight: 400;
	}
	& div.react-datepicker__week > div:focus {
		outline: none;
	}
	& .react-datepicker__day--selected {
		background-color: ${theme.colors.primary};
	}
	& .react-datepicker__day--selected:hover {
		background-color: ${theme.colors.primary_200};
	}
	& .react-datepicker__current-month,
	& .react-datepicker-time__header,
	& .react-datepicker-year-header {
		background-color: ${theme.colors.primary};
	}
	& .react-datepicker__time-list-item--selected {
		background-color: ${theme.colors.primary} !important;
	}
`
const CalendarsWrapper = styled.div`
	display: flex;
	justify-content: ${(props: DateTimePickerComponentProps) => (props.noInterval ? 'center' : 'space-between')};
	align-items: flex-start;
	margin-top: ${(props: DateTimePickerComponentProps) => (props.marginTop ? '20px' : '0')};
	height: ${(props: DateTimePickerComponentProps) => (props.height ? props.height + 'px' : 'inherit')};
	& * {
		font-size: ${theme.text.fontSize.fs} !important;
	}
	& .react-datepicker__day-name,
	& .react-datepicker__day,
	& .react-datepicker__time-name {
		width: 33px !important;
		height: 33px !important;
		border-radius: 0px !important;
	}
`
const InputsWrapper = styled.div`
	width: ${(props: DateTimePickerComponentProps) => (props.noInterval ? 'auto' : '506px')};
	display: flex;
	justify-content: ${(props: DateTimePickerComponentProps) => (props.noInterval ? 'center' : 'space-between')};
	align-items: center;
	margin-bottom: 11px;
	font-size: 16px;
`
const PaireInputWrapper = styled.div`
	display: flex;
	width: 231px;
	justify-content: ${(props: DateTimePickerComponentProps) => (props.noInterval ? 'center' : 'space-around')};
	z-index: 2;
`
const InputStyle = styled.div`
	line-height: 32px;
	padding: 0px 10px;
	border: 1px solid ${theme.colors.border.grey};
	border-radius: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: ${theme.text.fontSize.fs};
	width: 100px;
	background-color: ${theme.colors.light_500};
`
const TextAndInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* borders for inputs and datepicker inputs */
	& > div > div > input {
		border: 1px solid ${theme.colors.border.grey};
		background-color: ${theme.colors.light_500};
		:focus {
			outline: 1px solid ${theme.colors.primary} !important;
		}
	}
	& > div > div > div > input {
		border: 1px solid ${theme.colors.border.grey};
		background-color: ${theme.colors.light_500};
		:focus {
			outline: 1px solid ${theme.colors.primary} !important;
		}
	}
	& .react-datepicker__input-container {
		line-height: normal;
	}
	& .react-datepicker__input-container > input {
		width: auto;
		height: auto;
		line-height: 32px;
		padding: 0px 10px;
		width: 90px;
	}
	& .react-datepicker-time__header {
		font-size: ${theme.text.fontSize.fs};
	}
	& .react-datepicker--time-only .react-datepicker__time-container {
		font-size: ${theme.text.fontSize.fs} !important;
		width: 110px;
	}
`
const TextBelowInput = styled.p`
	margin: 0;
	padding-bottom: 5px;
`
const ButtonBottom = styled.div`
	text-align: center;
	border-radius: 5px;
	margin-right: ${(props: DateTimePickerComponentProps) => (props.margin ? `${props.margin}px` : '0')};
	color: ${theme.colors.white};
	padding: 0px 17px;
	line-height: 35px;
	background-color: ${(props: DateTimePickerComponentProps) => (props.disabled ? theme.colors.dark : props.bcg)};
	opacity: ${(props: DateTimePickerComponentProps) => (props.disabled ? 0.5 : 1)};
	cursor: ${(props: DateTimePickerComponentProps) => (props.disabled ? 'not-allowed' : 'pointer')};
	:hover {
		background-color: ${(props: DateTimePickerComponentProps) => props.hover};
	}
	transition: background-color 0.1s;
	& > img {
		height: 16px;
		vertical-align: middle;
	}
`
const BottomButtonWrapper = styled.div`
	display: flex;
	justify-content: ${(props: DateTimePickerComponentProps) => (props.noInterval ? 'center' : 'space-around')};
	position: relative;
	& .validate {
		padding: 8px;
		margin-right: 0px;
		font-size: ${theme.text.fontSize.fm} !important;
		height: 35px;
		width: 35px;
		line-height: normal;
	}
	& .cancel {
		padding: 8px;
		font-size: ${theme.text.fontSize.fm} !important;
		height: 35px;
		width: 35px;
		line-height: normal;
	}
	margin: ${(props: DateTimePickerComponentProps) => (props.noInterval ? '0px 8px' : '0px')};
`
const ErrorMsg = styled.span`
	display: flex;
	position: absolute;
	top: -17px;
	right: 0px;
	direction: rtl;
`
/////////STYLED/////////

///////INTERFACES///////
interface DateTimePickerComponentProps {
	noInterval?: boolean
	disabled?: boolean
	margin?: number
	bcg?: string
	firstDate?: boolean
	height?: number
	marginTop?: boolean
	hover?: string
}
interface DateTimePickerProps {
	startDate: Date
	endDate: Date
	startDateHandleChange: any // Function type ?
	endDateHandleChange: any // Function type ?
	startTimeHandleChange: any // Function type ?
	endTimeHandleChange: any // Function type ?
	formatDate: any
	cancelUpdateHandler: any // Function type ?
	toDayHandler: any // Function type ?
	weekSelectHandler: any // Function type ?
	monthSelectHandler: any // Function type ?
	updateDate: any // Function type ?
	noInterval: boolean
	noPastDate: boolean
	disableStartDate: boolean
	disableEndDate: boolean
	noTime?: boolean
	priorStartLimit?: Date | undefined
	priorEndLimit?: Date | undefined
}
///////INTERFACES///////

const DateTimePicker = ({ startDate, endDate, startDateHandleChange, endDateHandleChange, startTimeHandleChange, endTimeHandleChange, formatDate,
	cancelUpdateHandler, toDayHandler, weekSelectHandler, monthSelectHandler, updateDate, noInterval, noPastDate, disableStartDate = false,
	disableEndDate = false, noTime = false, priorStartLimit, priorEndLimit }: DateTimePickerProps): JSX.Element => {

	const isSameDay = moment(startDate).isSame(moment(endDate), 'day')
	const isToDay = moment(startDate).isSame(moment(), 'day')
	const dayDate = moment().calendar('sameDay')
	const selectedEndDate = moment(endDate).calendar('sameDay')
	//const [firstDate, setFirstDate] = useState(document.getElementsByClassName('react-datepicker__day--keyboard-selected'))
	const { t } = useTranslation()

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<ModalDateTimeWrapper noInterval>
			<InputsWrapper noInterval={noInterval}>
				<PaireInputWrapper noInterval={noInterval}>
					<TextAndInputWrapper>
						<TextBelowInput>
							{t('common:modal_datePicker_dateSelection_startDate')}
							{/* Date de début */}
						</TextBelowInput>
						<InputStyle>{formatDate(startDate)}</InputStyle>
					</TextAndInputWrapper>
					{noTime ? (
						''
					) : (
						<TextAndInputWrapper>
							<TextBelowInput>
								{t('common:modal_datePicker_dateSelection_startHour')}
								{/* Heure de début */}
							</TextBelowInput>
							{!noInterval && (
								<DatePicker
									selected={startDate}
									onChange={startTimeHandleChange}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption={t('common:modal_datePicker_dateSelection_Hour').toString()}
									timeFormat="HH:mm"
									dateFormat="HH:mm"
									disabled={disableStartDate}
									minTime={
										isToDay
											? noPastDate
												? moment().toDate()
												: moment().startOf('day').toDate()
											: moment().startOf('day').toDate()
									}
									maxTime={isSameDay ? moment(endDate).subtract(15, 'minutes').toDate() : moment(startDate).endOf('day').toDate()}
								/>
							)}
							{noInterval && (
								<DatePicker
									selected={startDate}
									onChange={startTimeHandleChange}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption={t('common:modal_datePicker_dateSelection_Hour').toString()}
									timeFormat="HH:mm"
									dateFormat="HH:mm"
									disabled={disableStartDate}
									minTime={
										noPastDate
											? startDate < moment().toDate()
												? moment().toDate()
												: moment().startOf('day').toDate()
											: moment().toDate()
									}
									maxTime={moment(startDate).endOf('day').toDate()}
								/>
							)}
						</TextAndInputWrapper>
					)}
				</PaireInputWrapper>
				{!noInterval && (
					<PaireInputWrapper>
						<TextAndInputWrapper>
							<TextBelowInput>
								{t('common:modal_datePicker_dateSelection_endDate')}
								{/* Date de fin */}
							</TextBelowInput>
							<InputStyle>{formatDate(endDate)}</InputStyle>
						</TextAndInputWrapper>
						{noTime ? (
							''
						) : (
							<TextAndInputWrapper>
								<TextBelowInput>
									{t('common:modal_datePicker_dateSelection_endHour')}
									{/* Heure de fin */}
								</TextBelowInput>

								{!disableStartDate && (
									<DatePicker
										selected={endDate}
										onChange={endTimeHandleChange}
										showTimeSelect
										showTimeSelectOnly
										// tenter un autre jsx avec diabled en flag
										timeIntervals={15}
										timeCaption={t('common:modal_datePicker_dateSelection_Hour').toString()}
										timeFormat="HH:mm"
										dateFormat="HH:mm"
										minTime={
											isToDay
												? disableStartDate
													? moment().add(15, 'minutes').toDate()
													: //: moment( startDate ).add( 15, 'minutes' ).toDate()
													  moment(endDate).startOf('day').toDate()
												: disableStartDate
												? moment().add(15, 'minutes').toDate()
												: //: moment( endDate ).startOf( 'day' ).toDate()
												  moment(endDate).startOf('day').toDate()
										}
										maxTime={moment(endDate).endOf('day').toDate()}
									/>
								)}
								{disableStartDate && (
									<DatePicker
										selected={endDate}
										onChange={endTimeHandleChange}
										showTimeSelect
										showTimeSelectOnly
										//disableEndDate={disableEndDate}
										disabled={disableEndDate}
										timeIntervals={15}
										timeCaption={t('common:modal_datePicker_dateSelection_Hour').toString()}
										timeFormat="HH:mm"
										dateFormat="HH:mm"
										minTime={
											dayDate === selectedEndDate
												? moment().add(15, 'minutes').toDate()
												: moment(endDate).startOf('day').toDate()
										}
										maxTime={moment(endDate).endOf('day').toDate()}
									/>
								)}
							</TextAndInputWrapper>
						)}
					</PaireInputWrapper>
				)}
			</InputsWrapper>
			<CalendarsWrapper height={300} noInterval={noInterval}>
				<DatePicker
					selected={startDate}
					onChange={startDateHandleChange}
					disabled={disableStartDate}
					locale={fr}
					maxDate={
						disableStartDate
							? moment().subtract(1, 'days').toDate()
							: noInterval
							? priorEndLimit
								? moment(priorEndLimit).toDate()
								: null
							: moment(endDate).subtract(15, 'minutes').toDate()
					}
					minDate={priorStartLimit ? moment(priorStartLimit).toDate() : noPastDate ? moment().toDate() : null}
					inline
				/>
				{!noInterval && (
					<DatePicker
						selected={endDate}
						onChange={endDateHandleChange}
						locale={fr}
						disabled={disableEndDate}
						inline
						minDate={
							disableEndDate
								? moment().add(1, 'days').toDate()
								: disableStartDate
								? moment().toDate()
								: moment(startDate).add(15, 'minutes').toDate()
						}
						maxDate={disableEndDate ? moment().subtract(1, 'days').toDate() : null}
					/>
				)}
			</CalendarsWrapper>

			<CalendarsWrapper marginTop>
				<BottomButtonWrapper noInterval={noInterval}>
					<ButtonBottom bcg={theme.colors.primary} margin={15} onClick={toDayHandler} hover={theme.colors.primary_200}>
						{t('common:common_text_today')}
						{/* Aujourd'hui */}
					</ButtonBottom>
					<ButtonBottom onClick={weekSelectHandler} bcg={theme.colors.primary} margin={15} hover={theme.colors.primary_200}>
						{t('common:common_text_week')}
						{/* Semaine */}
					</ButtonBottom>
					<ButtonBottom bcg={theme.colors.primary} onClick={monthSelectHandler} hover={theme.colors.primary_200}>
						{t('common:common_text_month')}
						{/* Mois */}
					</ButtonBottom>
				</BottomButtonWrapper>
				<BottomButtonWrapper noInterval={noInterval}>
					<ButtonBottom
						className="cancel"
						onClick={cancelUpdateHandler}
						bcg={theme.colors.danger}
						margin={10}
						hover={theme.colors.danger_200}
					>
						<img src={imgCancel} alt="" />
					</ButtonBottom>
					<ButtonBottom
						className="validate"
						onClick={updateDate}
						bcg={theme.colors.success}
						margin={15}
						disabled={!noInterval && DateFormat.dateEndIsBefore(startDate, endDate)}
						hover={theme.colors.success_200}
					>
						<img src={imgValidate} alt="" />
					</ButtonBottom>
					{/*<Button
                img={imgValidate}
                actionHandler={updateDate}
                bgColor={theme.colors.validation}
                disabled={DateFormat.dateEndIsBefore(startDate, endDate)}
            />*/}
					{!noInterval && DateFormat.dateEndIsBefore(startDate, endDate) && (
						<ErrorMsg>{t('common:common_message_datePicker_dateSelection_update_invalidRangeDate')}</ErrorMsg>
					)}
				</BottomButtonWrapper>
			</CalendarsWrapper>
		</ModalDateTimeWrapper>
	)
}

DateTimePicker.propTypes = {
	startDate: PropTypes.object,
	endDate: PropTypes.object,
	startDateHandleChange: PropTypes.func,
	endDateHandleChange: PropTypes.func,
	startTimeHandleChange: PropTypes.func,
	endTimeHandleChange: PropTypes.func,
	formatDate: PropTypes.func,
	cancelUpdateHandler: PropTypes.func,
	updateDate: PropTypes.func,
}

export default DateTimePicker
