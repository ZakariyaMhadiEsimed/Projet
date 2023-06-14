////////LIBRARY/////////
import React, { useRef, useState, Fragment, FC } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'
///////COMPONENTS///////
import PaperList from './PaperList'
import UseOutsideClick from '../../hooks/UseOutsideClick'
/////////ASSETS/////////
import SelectDropdownDefaultIcon from '../../assets/icones/global/arrow-down.svg'
import ArrowUp from '../../assets/icones/global/arrow-up.svg'
import ArrowDown from '../../assets/icones/global/arrow-down.svg'
import { DropdownCheckboxProps, PaperWrapperProps } from '../../interfaces/components/DropdownCheckbox/DropdownCheckbox.interfaces'
import theme from '../../theme/theme'
import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'

/////////STYLED/////////
const DropdownCheckboxWrapper: any = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	border-radius: 5px;
	background-color: ${theme.colors.white};
	border: 1px solid ${theme.colors.border.filters};
	cursor: pointer;
	padding: 0px 40px 0px 10px;
	height: 46px;
	&::after {
		content: '';
		width: 46px;
		height: 100%;
		pointer-events: none;
		position: absolute;
		border-radius: 0px 3px 3px 0px;
		right: 0px;
		left: unset;
		background-image: url(${SelectDropdownDefaultIcon});
		background-repeat: no-repeat;
		background-position: center;
		transition: background-color 0.1s;
	}
`
const ContentCheckBoxWrapper = styled.div`
	/*padding-top:2px;*/
`
const Paper: any = styled.div`
	height:45%;
    display: grid;
    grid-template-columns: max-content;
    grid-auto-rows: 40px;
    justify-content: stretch;
    align-items: stretch;
	
    padding: 0 20px;
	overflow-x: hidden;
	overflow-y : auto;
    max-height: 400px;
	overflow-y: auto;
	
::-webkit-scrollbar {
    width: 17px;
	height: 18px;
}
::-webkit-scrollbar-thumb {
    height: 6px;
	border-right: 10px solid rgba(0, 0, 0, 0);
	border-left:${theme.colors.backgroundScroll};
	border-top:${theme.colors.backgroundScroll},
	border-bottom:${theme.colors.backgroundScroll};
    background-clip: padding-box;
    background-color: ${theme.colors.eraser};
}
::-webkit-scrollbar-button:vertical:decrement:single-button {
	background: no-repeat${theme.colors.backgroundScroll};
	background-image: url(${ArrowUp});
	height:10px;
	background-position: center bottom;
	border-right: 10px solid white;
}
::-webkit-scrollbar-button:vertical:increment:single-button {
	background: no-repeat${theme.colors.backgroundScroll};
	background-image: url(${ArrowDown});
	height:10px;
	background-position: center bottom;
	border-right: 10px solid white;	
}
::-webkit-scrollbar-track-piece{
	background-color: ${theme.colors.backgroundScroll};
	border-right: 10px solid white;
}		
`
const DropdownCheckboxLabel = styled.label`
	line-height: 32px;
	margin-right: 5px;
`
const PaperWrapper = styled.div`
	padding: ${(props: PaperWrapperProps) => (props.dataSize > 10 ? ' 10px 0px 10px' : '')};
	background-color: ${theme.colors.white};
	border: 1px solid ${theme.colors.border.filters};
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
	position: absolute;
	top: ${(props: PaperWrapperProps) => props.topPosition + 'px'};
	right: ${(props: PaperWrapperProps) => (props.rtl ? '0' : 'inherit')};
	left: ${(props: PaperWrapperProps) => (props.rtl ? 'inherit' : '0')};
	transition: all 50ms;
	z-index: 10;
	transform-origin: top;
	transform: scaleY(
		${({ menuTransition }) => {
			switch (menuTransition) {
				case 'entering':
					return '0'
				case 'entered':
					return '1'
				case 'exiting':
					return '0'
				case 'exited':
					return '0'
				default:
					return '0'
			}
		}}
	);
`
/////////STYLED/////////

const DropdownCheckbox: FC<DropdownCheckboxProps> = ({
	data,
	paperTopPosition,
	title,
	toTranslate,
	rtl,
	selectActionsHandler,
	dropColor,
	submitOnClose,
	target,
	radio = false,
	eraserColor,
	label = '',
	pics = [],
	prefixTranslation,
}) => {
	const [showPaper, setShowPaper] = useState(false)
	const refDropdownCheckbox = useRef()
	const { t } = useTranslation()

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleShowPaper = (): void => {
		setShowPaper(!showPaper)
	}

	const handleClosePaperCheckbox = (): void => {
		!isUndefined(submitOnClose) && submitOnClose()
		setShowPaper(false)
	}

	const checkBoxHandler = (id: number | string, checked: boolean, target: string, radio?: boolean): void => {
		selectActionsHandler(id, checked, target, radio)
		// In radio mode, when we click element, we close instantly the paper
		if (radio) {
			setShowPaper(false)
		}
	}

	UseOutsideClick(refDropdownCheckbox, handleClosePaperCheckbox)

	///////////////////////////////// RENDER ///////////////////////////////////////
	
	return (
		<Fragment>
			{label.length > 0 && <DropdownCheckboxLabel>{label}</DropdownCheckboxLabel>}
			<DropdownCheckboxWrapper blueColor={dropColor} onClick={handleShowPaper} eraserColor={eraserColor} ref={refDropdownCheckbox}>
				<ContentCheckBoxWrapper>{t(title)}</ContentCheckBoxWrapper>
				<Transition
					in={showPaper}
					timeout={{
						appear: 0,
						enter: 0,
						exit: 300,
					}}
					mountOnEnter
					unmountOnExit
				>
					{(state: any) => (
						<PaperWrapper topPosition={paperTopPosition} menuTransition={state} dataSize={data.length} rtl={rtl}>
							<Paper>
								<PaperList
									data={data}
									toTranslate={toTranslate}
									checkBoxHandler={checkBoxHandler}
									target={target}
									radio={radio}
									pics={pics}
									prefixTranslation={prefixTranslation}
								/>
							</Paper>
						</PaperWrapper>
					)}
				</Transition>
			</DropdownCheckboxWrapper>
		</Fragment>
	)
}

export default DropdownCheckbox
