////////LIBRARY/////////
import React, { FC } from 'react'
import styled from 'styled-components'
import { last } from 'lodash'
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
///////COMPONENTS///////
import FactoryPageSelected from './FactoryPageSelected'
import theme from '../../../../theme/theme'

/////////STYLED/////////
const PagingListWrapper = styled.div`
	display: flex;
	grid-template-columns: max-content;
	grid-column-gap: 5px;
	justify-content: center;
	align-items: center;
`
const NumberPageLabel = styled.label`
	display: flex;
	height: 32px;
	width: 32px;
	justify-content: center;
	align-items: center;
	background-color: ${(props: NumberPageLabelProps) => (props.isActive ? theme.colors.primary : theme.colors.white)};
	cursor: pointer;
	color: ${(props: NumberPageLabelProps) => (props.isActive ? theme.colors.white : theme.colors.neutral_900)};
	border: ${(props: NumberPageLabelProps) => (props.isActive ? 'none' : `1px solid ${theme.colors.border.paging}`)};
	box-sizing: border-box;
	border-radius: 8px;
	${(props: NumberPageLabelProps) => props.isActive && `box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);`}
`
const NumberPageInput = styled.input`
	display: none;
	height: 32px;
	width: 32px;
	border-radius: 50%;
	justify-content: center;
	align-items: center;
	background-color: ${theme.colors.white};
`
const ToContinue = styled.p`
	display: flex;
	margin: 0 0;
	padding: 0 0;
`
/////////STYLED/////////

/////////TYPES//////////
export type NumberPageLabelProps = {
	isActive?: boolean
}
type PagingListProps = {
	submitHandler: (data: any) => void | undefined
	options: any[]
	totalPage: number
	register: UseFormRegister<any>
	setValue: UseFormSetValue<any>
	getValues: UseFormGetValues<any>
}
/////////TYPES//////////

const PagingList: FC<PagingListProps> = ({ options, register, setValue, getValues, totalPage, submitHandler }: any) => {
	const lastOption = last<any>(options).toString()

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleSwapPage = (opt: any): void => {
		setValue('goToPage', opt.toString())
	}

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<PagingListWrapper>
			<NumberPageLabel isActive={getValues('goToPage') === '0'}>
				<NumberPageInput
					type="radio"
					name="tmpGoTo"
					value="0"
					//ref={register}
					{...register}
					onClick={() => {
						let submitAsked = false
						if (getValues('tmpGoTo') !== getValues('goToPage')) submitAsked = true
						handleSwapPage('0')
						if (submitAsked) submitHandler(getValues())
					}}
				/>
				{options[0]}
			</NumberPageLabel>

			{getValues('goToPage') > 1 && totalPage >= 4 && <ToContinue>...</ToContinue>}
			{totalPage >= 2 && (
				<FactoryPageSelected options={options} register={register} handleSwapPage={handleSwapPage} pageValue={getValues('goToPage')} />
			)}

			{getValues('goToPage') < last<any>(options) - 2 && totalPage >= 4 && <ToContinue>...</ToContinue>}

			{totalPage >= 3 && (
				<NumberPageLabel isActive={getValues('goToPage') === (last<any>(options) - 1).toString()}>
					<NumberPageInput
						type="radio"
						name="tmpGoTo"
						value={lastOption}
						{...register}
						onClick={() => handleSwapPage(options.length - 1)}
					/>
					{last(options)}
				</NumberPageLabel>
			)}
		</PagingListWrapper>
	)
}

export default PagingList
