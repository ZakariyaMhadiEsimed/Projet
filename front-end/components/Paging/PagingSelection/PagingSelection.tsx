////////LIBRARY/////////
import React from 'react'
import styled from 'styled-components'
import { map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
///////COMPONENTS///////
import PagingList from './PagingList'
import { SelectInputWrapper, SelectInput } from '../../../theme/GlobalCss'
import theme from '../../../theme/theme'

/////////STYLED/////////
const PagingSelectionWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(min-content, max-content));
	grid-column-gap: 15px;
	justify-content: center;
	align-items: center;
	font-size: ${theme.text.fontSize.fs};
`
const SelectWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(5, minmax(min-content, max-content));
	grid-column-gap: 5px;
	justify-content: center;
	align-items: center;
`
const PagingWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(min-content, max-content));
	grid-column-gap: 10px;
	justify-content: center;
	align-items: center;
`
const ArrowWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	background-color: ${theme.colors.white};
	cursor: pointer;
	box-sizing: border-box;
	border: 1px solid ${theme.colors.light_400};
`
const LeftArrow = styled.div`
	border-right: 8px solid ${theme.colors.dark_100};
	border-top: 6px solid transparent;
	border-bottom: 6px solid transparent;
	transition: all 0.5s ease;
`
const RightArrow = styled.div`
	border-left: 8px solid ${theme.colors.dark_100};
	border-top: 6px solid transparent;
	border-bottom: 6px solid transparent;
	transition: all 0.5s ease;
`

const SelectInputWrapperCustom = styled(SelectInputWrapper)`
	&::after {
		border-radius: 0px;
	}
`

const SelectInputCustom = styled(SelectInput)`
	border-radius: 0px;
	height: 35px;
`
/////////STYLED/////////

/////////TYPES//////////
export type PagingSelectionProps = {
	totalPage: number
	register: UseFormRegister<any>
	setValue: UseFormSetValue<any>
	getValues: UseFormGetValues<any>
	onSubmit: (data: any) => void
}
/////////TYPES//////////

const PagingSelection: FC<PagingSelectionProps> = ({ totalPage, register, setValue, getValues, onSubmit }) => {

	const { t } = useTranslation()
	let options = new Array(totalPage || 1)
	options = map(options, (_opt, key) => key + 1)

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleNextPaging = (): void => {
		const page = Number(getValues('goToPage')) + 1 || 0
		if (totalPage - 1 < page) return
		setValue('goToPage', page.toString())
		setValue('tmpGoTo', page.toString())
		onSubmit(getValues())
	}

	const handlePrevPaging = (): void => {
		const page = Number(getValues('goToPage')) - 1 || 0
		if (0 > page) return
		setValue('goToPage', page.toString())
		setValue('tmpGoTo', page.toString())
		onSubmit(getValues())
	}

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<PagingSelectionWrapper>
			<PagingWrapper>
				<ArrowWrapper onClick={handlePrevPaging}>
					<LeftArrow />
				</ArrowWrapper>
				<PagingList
					options={options}
					setValue={setValue}
					register={register}
					getValues={getValues}
					totalPage={totalPage}
					submitHandler={onSubmit}
				/>
				<ArrowWrapper onClick={handleNextPaging}>
					<RightArrow />
				</ArrowWrapper>
			</PagingWrapper>
			<SelectWrapper>
				<p>{`${t('common:common_text_go_to_page')} :`}</p>
				<SelectInputWrapperCustom>
					<SelectInputCustom name="goToPage" {...register}>
						{map(options, (opt, key) => (
							<option key={key} value={key}>
								{opt}
							</option>
						))}
					</SelectInputCustom>
				</SelectInputWrapperCustom>
			</SelectWrapper>
		</PagingSelectionWrapper>
	)
}

export default PagingSelection
