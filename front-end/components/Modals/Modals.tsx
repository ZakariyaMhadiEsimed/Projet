////////LIBRARY/////////
import React, { FC } from 'react'
import styled from 'styled-components'
///////COMPONENTS///////
import ModalPaper from './ModalPaper/ModalPaper'
import UseModalPosY from '../../hooks/UseModalPosY'
import theme from '../../theme/theme'

/////////STYLED/////////
const ModalsWrapper = styled.div`
	position: ${(props: PropsModal) => (props.insideModal ? 'fixed' : 'fixed')};
	top: ${(props: PropsModal) => (props.insideModal ? props.postop + 'px' : '0px')};
	top: 0px;
	left: 0;
	display: flex;
	justify-items: center;
	align-items: center;
	width: ${(props: PropsModal) => (props.insideModal ? '100%' : '100vw')};
	height: ${(props: PropsModal) => (props.insideModal ? '100%' : '100vh')};
	overflow: hidden;
	z-index: ${(props: PropsModal) => (props.insideModalResponse ? '20' : '10')};
	color: ${theme.colors.dark};
	border-radius: ${(props: PropsModal) => (props.insideModal ? '20px' : '0px')};
`
const ModalBackground = styled.div`
	background-color: rgba(0, 0, 0, 0.6);
	position: absolute;
	z-index: 15;
	width: 100vw;
	height: 100vh;
	top: 0px;
	opacity: 0.5;
`
/////////STYLED/////////

/////////TYPES//////////
type PropsModal = {
	showModal?: boolean
	closeModalHandler?: any
	children?: any
	headerTitle?: string
	width?: number
	height?: number
	level?: string
	postop?: number
	insideModal?: boolean
	insideModalResponse?: boolean
	customTitle?: any
	customIcon?: string
	hideOverflow?: boolean
}
/////////TYPES//////////

const Modals: FC<PropsModal> = ({ showModal,  closeModalHandler, headerTitle, children, width, height, level, insideModal, insideModalResponse, customTitle, customIcon, hideOverflow }) => {

	const [winPos] = UseModalPosY(showModal)
	const posTop = winPos.windowPageYOffset

	///////////////////////////////// RENDER ///////////////////////////////////////

	return showModal ? (
		<ModalsWrapper postop={posTop} insideModal={insideModal} insideModalResponse={insideModalResponse}>
			<ModalPaper
				closeModal={closeModalHandler}
				headerTitle={headerTitle}
				paperWidth={width}
				paperHeight={height}
				level={level}
				childrenPaper={children}
				customTitle={customTitle}
				customIcon={customIcon}
				overflow={hideOverflow}
			></ModalPaper>
			<ModalBackground onClick={closeModalHandler} />
		</ModalsWrapper>
	) : null
}

export default Modals
