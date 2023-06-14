////////LIBRARY/////////
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

///////INTERFACES///////
interface WindowPageOffset {
	windowPageYOffset: number
	windowPageXOffset: number
}
///////INTERFACES///////

const UseModalPosY = (showModal: any): WindowPageOffset[] => {

	const [winPos, setWinPos] = useState({
		windowPageYOffset: window.pageYOffset,
		windowPageXOffset: window.pageXOffset,
	})

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const onScrollHandler = (): void => {
		window.scrollTo(winPos.windowPageXOffset, winPos.windowPageYOffset)
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect((): void => {
		setWinPos({
			windowPageYOffset: window.pageYOffset,
			windowPageXOffset: window.pageXOffset,
		})
		if (showModal) {
			window.addEventListener('scroll', onScrollHandler)
		} else {
			window.removeEventListener('scroll', onScrollHandler)
		}
	}, [showModal])

	useEffect((): (() => void) => {
		return (): void => {
			window.removeEventListener('scroll', onScrollHandler)
		}
	})

	///////////////////////////////// RENDER ///////////////////////////////////////

	return [winPos]
}

UseModalPosY.propTypes = {
	showModal: PropTypes.bool,
}

UseModalPosY.defaultPropTypes = {}

export default UseModalPosY
