////////LIBRARY/////////
import React, { useEffect, FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { shallowEqual, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
///////COMPONENTS///////
import UseModalPosY from '../../hooks/UseModalPosY'
import theme from '../../theme/theme'
/////////ASSETS/////////
import LoadingSpinnerImage from '../../assets/images/loader/arrow-spinner.svg'

/////////STYLED/////////
const spinnerAnimation = keyframes`
	0% {transform: rotate(0deg);}
	100% {transform: rotate(-360deg);}
`
const LoadingWrapper = styled.div`
	position: absolute;
	top: ${(props: LoadingWrapperInt) => props.postop + 'px'};
	left: 0;
	display: flex;
	justify-items: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
`
const LoadingBackground = styled.div`
	position: absolute;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 100;
	width: 100vw;
	height: 100vh;
`
const ModalWrapper = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-height: 90%;
	overflow-y: auto;
	left: 50%;
	top: 50%;
	z-index: 200;
	transform: translate(-50%, -50%);
`
const TitleLoading = styled.div`
	font-size: ${theme.text.fontSize.fl};
	margin-top: 10px;
	font-weight: ${theme.text.fontWeight.medium};
	color: ${theme.colors.white};
`
const LoadingSpinner = styled.div`
	width: 64px;
	height: 60.862px;
	background-image: url(${LoadingSpinnerImage});
	background-repeat: no-repeat;
	animation: ${spinnerAnimation} 0.5s linear infinite;
	background-size: 60.862px;
	background-position: 4.7px center;
`
/////////STYLED/////////

/////////TYPES//////////
type LoadingProps = {
	suspenseMode?: boolean
}
type LoadingWrapperInt = {
	postop: number
}
/////////TYPES//////////

const Loading: FC<LoadingProps> = ({ suspenseMode = false }) => {

	const { globalLoading } = useSelector(
		(state: any) => ({
			globalLoading: state.globalLoading.loading,
		}),
		shallowEqual
	)
	const { t } = useTranslation()
	const [winPos] = UseModalPosY(globalLoading)
	const posTop = winPos.windowPageYOffset

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (globalLoading) {
			document.body.style.overflow = 'hidden'
			document.body.style.paddingRight = '10px'
		}
		return () => {
			document.body.style.overflow = ''
			document.body.style.paddingRight = ''
		}
	}, [globalLoading])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			{(globalLoading || suspenseMode) && (
				<LoadingWrapper postop={posTop}>
					<ModalWrapper>
						<LoadingSpinner />
						<TitleLoading>{t('common:common_text_loading')}</TitleLoading>
					</ModalWrapper>
					<LoadingBackground />
				</LoadingWrapper>
			)}
		</>
	)
}

Loading.propTypes = {}

export default Loading
