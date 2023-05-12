////////LIBRARY/////////
import React, { FC } from 'react'
import styled from 'styled-components'
import { isUndefined } from 'lodash'
///////COMPONENTS///////
import theme from '../../../theme/theme'
import { ModalPaperCssProps } from '../../../interfaces/Interfaces'
/////////ASSETS/////////

/////////STYLED/////////
const ModalWrapper = styled.div`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 20;
	border-radius: 5px;
	width: ${(props: ModalPaperCssProps) => `${props.paperWidth}px`};
	height: ${(props: ModalPaperCssProps) => `${props.paperHeight}px`};
	background-color: ${theme.colors.white};
	max-height: 100vh;
	display: flex;
	flex-direction: row;
	overflow: auto;
`
const ModalPaperWrapper = styled.div`
	height: auto;
	width: 100%;
	padding: 20px 0px;
	overflow-y: ${(props: ModalPaperCssProps) => (props.overflow ? 'hidden' : 'auto')};
	display: flex;
	flex-direction: column;
`
const ModalHeaderWrapper = styled.div`
	display: flex;
	align-items: start;
	justify-content: ${(props: ModalHeaderWrapperProps) => (props.hasTitle ? 'space-between' : 'flex-end')};
	background-color: white;
	padding: 0px 20px;
`
export const ModalTitle = styled.div`
	font-size: ${theme.text.fontSize.fxl};
	color: ${theme.colors.dark};
	font-weight: 500;
	cursor: default;
	background-repeat: no-repeat;
	background-position: center left;
	background-size: contain;
	line-height: 30px;
	padding-bottom: 20px;
	text-align: center;
`
const ModalBodyWrapper = styled.div`
	background-color: ${theme.colors.white};
	overflow-y: ${(props: ModalPaperCssProps) => (props.overflow ? 'hidden' : 'auto')};
`
const HeaderTitleWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: flex-start;
	margin-left: ${(props: ModalPaperCssProps) => (!isUndefined(props.levelBgColor) ? '37px' : null)};

	& > img {
		margin-right: 17px;
	}
`
const ModalClose = styled.a`
	cursor: pointer;
	margin-left: 40px;
`
/////////STYLED/////////

/////////TYPES//////////

type PropsModalPaper = {
	paperHeight?: number
	paperWidth?: number
	headerTitle?: string
	childrenPaper: any
	closeModal: any
	level?: string
	customTitle?: any
	customIcon?: string
	overflow?: boolean
	unity?: string
}
/////////TYPES//////////

const ModalPaper: FC<PropsModalPaper> = ({ paperHeight, paperWidth, headerTitle, childrenPaper, closeModal, level, overflow, unity }) => {
	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<ModalWrapper paperWidth={paperWidth} paperHeight={paperHeight} levelBgColor={level} unity={unity}>
			<ModalPaperWrapper overflow={overflow}>
				<ModalHeaderWrapper>
					{headerTitle && (
						<HeaderTitleWrapper>
							<ModalTitle level={level}>{headerTitle}</ModalTitle>
						</HeaderTitleWrapper>
					)}
					<ModalClose role="button" tabIndex={0} onClick={() => closeModal()} onKeyUp={() => null}>
						<img src={close} width={13} height={13} alt="" />
					</ModalClose>
				</ModalHeaderWrapper>

				<ModalBodyWrapper overflow={overflow}>
					<div>{childrenPaper}</div>
				</ModalBodyWrapper>
			</ModalPaperWrapper>
		</ModalWrapper>
	)
}

export default ModalPaper
