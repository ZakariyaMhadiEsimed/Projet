////////LIBRARY/////////
import { useEffect } from 'react'

const useOutsideClick = (ref, callback) => {
	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleClick = (e) => {
		if (ref.current && !ref.current.contains(e.target)) {
			callback()
		}
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		document.addEventListener('click', handleClick)

		return () => {
			document.removeEventListener('click', handleClick)
		}
	}, [])
}
export default useOutsideClick
