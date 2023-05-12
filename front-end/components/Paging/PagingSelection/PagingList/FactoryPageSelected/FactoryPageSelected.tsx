////////LIBRARY/////////
import React, { FC } from 'react'
import styled from 'styled-components'
import { last } from 'lodash'
import { UseFormRegister } from 'react-hook-form'
///////COMPONENTS///////
import { NumberPageLabelProps } from '../PagingList'
import theme from '../../../../../theme/theme'

/////////STYLED/////////
const NumberPageLabel = styled.label`
	display: flex;
	height: 32px;
	width: 32px;
	justify-content: center;
	align-items: center;
	background-color: ${(props: NumberPageLabelProps) => (props.isActive ? theme.colors.primary : theme.colors.white)};
	color: ${(props: NumberPageLabelProps) => (props.isActive ? theme.colors.white : theme.colors.dark_100)};
	cursor: pointer;
	border: ${(props: NumberPageLabelProps) => (props.isActive ? 'none' : `1px solid ${theme.colors.light_400}`)};
`
const NumberPageInput = styled.input`
	display: none;
	height: 32px;
	width: 32px;
	justify-content: center;
	align-items: center;
	background-color: ${theme.colors.white};
`
/////////STYLED/////////

/////////TYPES//////////
type FactoryPageSelectedProps = {
	options: any[string | number]
	handleSwapPage: (opt: any) => void
	register: UseFormRegister<any>
	pageValue: string | number
}
/////////TYPES//////////

const FactoryPageSelected: FC<FactoryPageSelectedProps> = ({ options, handleSwapPage, pageValue, register }) => {
	
	const lastOption = last<any>(options) - 1
	const lastOptionStr = lastOption.toString()

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			{(pageValue === '0' || options.length < 3) && (
				<NumberPageLabel isActive={pageValue === '1'}>
					<NumberPageInput type="radio" name="tmpGoTo" {...register} value={1} onClick={() => handleSwapPage(1)} />
					{2}
				</NumberPageLabel>
			)}
			{options.length > 2 && pageValue === lastOptionStr && (
				<NumberPageLabel isActive={false}>
					<NumberPageInput
						type="radio"
						name="tmpGoTo"
						{...register}
						value={lastOption - 1}
						onClick={() => handleSwapPage(lastOption - 1)}
					/>
					{lastOptionStr}
				</NumberPageLabel>
			)}
			{pageValue !== '0' && pageValue !== lastOptionStr && options.length > 2 && (
				<NumberPageLabel isActive={true}>
					<NumberPageInput type="radio" name="tmpGoTo" {...register} value={pageValue} onClick={() => handleSwapPage(options[pageValue])} />
					{options[pageValue]}
				</NumberPageLabel>
			)}
		</>
	)
}

export default FactoryPageSelected
