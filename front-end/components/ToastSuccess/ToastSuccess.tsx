/* eslint-disable react-hooks/exhaustive-deps */
////////LIBRARY/////////
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'
import { isEmpty } from 'lodash'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
///////COMPONENTS///////
import theme from '../../theme/theme'
import { toastSuccessActionCreators } from '../../store/actions'
/////////ASSETS/////////
import Close from '../../assets/icones/toast/close-toast.svg'
import CloseSuccess from '../../assets/icones/toast/close-toast-success.svg'
//import CloseWarning from '../../assets/icones/toast/close-toast-warning.svg'
//import CloseError from '../../assets/icones/toast/close-toast-error.svg'
//import CloseInfo from '../../assets/icones/toast/close-toast-info.svg'
//import CloseFailure from '../../assets/icones/toast/close-toast-failure.svg'

/////////STYLED/////////
const Wrapper = styled.div<ToastProps>`
	width: 100vw;
	height: 150px;
	top: ${({ transitionState }) => {
		switch (transitionState) {
			case 'entering':
				return '-150px'
			case 'entered':
				return '0px'
			case 'exiting':
				return '-150px'
			case 'exited':
				return '0px'
			default:
				return '-150px'
		}
	}};
	position: fixed;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 1s;
	z-index: 50;
`
// TODO : Implement remaining cases
const ToastWrapper = styled.div`
	height: 56px;
	width: 1470px;
	background-color: ${(props: ToastWrapperProps) => {
		switch (props.level) {
			case 'success':
				return theme.colors.success_100
			default:
				theme.colors.secondary_100
		}
	}};
	border-radius: 5px;
	border: 1px solid
		${(props: ToastWrapperProps) => {
			switch (props.level) {
				case 'success':
					return theme.colors.success_200
				default:
					theme.colors.secondary_400
			}
		}};
	& > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100%;
		padding: 18px 20px 17px 20px;
	}
`
const SuccessMessageWrapper = styled.span`
	font-size: ${theme.text.fontSize.fm};
	color: ${theme.colors.success_200};
	text-align: left;
`
const CloseToast = styled.img`
	height: 12px;
	width: 12px;
	cursor: pointer;
`
/////////STYLED/////////

///////INTERFACES///////
interface ToastProps {
	readonly transitionState: any
}
interface ToastWrapperProps {
	level: string
}
///////INTERFACES///////

/////////TYPES//////////
type ToastSuccessProps = {
	level?: string
}
/////////TYPES//////////

const ToastSuccess: FC<ToastSuccessProps> = ({ level = 'success' }) => {

	const { toastSuccess } = useSelector(
		(state: any) => ({
			toastSuccess: state.toastSuccess,
		}),
		shallowEqual
	)
	const toastSuccessAction = bindActionCreators(toastSuccessActionCreators, useDispatch())
	const [timer, setTimer] = useState(0)

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleCloseTimer = (): void => {
		setTimer(0)
		toastSuccessAction.closeToast()
	}

	const clock = (): any => {
		return setTimeout(() => {
			handleCloseTimer()
		}, 4000)
		return null
	}

	const handleCloseToast = (): void => {
		setTimer(0)
		toastSuccessAction.closeToast()
	}

	// TODO : Implement remaining cases
	const generateCloseToastIcon = (level: string): string => {
		switch (level) {
			case 'success':
				return CloseSuccess
			default:
				return Close
		}
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (toastSuccess.show) {
			if (timer !== 0) {
				clearTimeout(timer)
				handleCloseTimer()
				setTimeout(() => {
					toastSuccessAction.openNext()
				}, 500)
				return
			}
			setTimer(clock())
		}
	}, [toastSuccess])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<Transition
			in={toastSuccess.show}
			timeout={{
				appear: 0,
				enter: 0,
				exit: 3000,
			}}
			mountOnEnter
			unmountOnExit
		>
			{(state: any) => (
				<Wrapper transitionState={state}>
					<ToastWrapper level={level}>
						<div>
							<SuccessMessageWrapper>
								{!isEmpty(toastSuccess.successMsgParams) ? toastSuccess.successMsgParams : toastSuccess.tamponClose}
							</SuccessMessageWrapper>
							<CloseToast src={generateCloseToastIcon(level)} onClick={handleCloseToast} />
						</div>
					</ToastWrapper>
				</Wrapper>
			)}
		</Transition>
	)
}

export default ToastSuccess
