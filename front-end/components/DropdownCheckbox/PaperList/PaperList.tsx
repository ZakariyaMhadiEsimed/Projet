////////LIBRARY/////////
import React, { FC, useState } from 'react'
import { map, find, isEmpty, isNull } from 'lodash'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
///////COMPONENTS///////
import { PaperListProps } from '../../../interfaces/components/PaperList/PaperList.interfaces'

/////////STYLED/////////
const PaperListWrapper = styled.div`
	display: grid;
	grid-template-columns: min-content max-content max-content;
	grid-column-gap: 10px;
	justify-content: start;
	align-items: center;
	cursor: pointer;
`
const PaperListItems = styled.label`
	cursor: pointer;
`
const PaperCheckbox = styled.input`
	cursor: pointer;
`
const PaperPic = styled.img`
	width: 16px;
	height: 16px;
`
/////////STYLED/////////

const PaperList: FC<PaperListProps> = ({ data, toTranslate, checkBoxHandler, target, radio, pics = [], prefixTranslation }): JSX.Element | null => {
	const { t } = useTranslation()
	const oneIsUncheck = !find(data, { active: false })
	const [checkAll, setCheckAll] = useState({ id: 'checkAll', label: 'common__text__filter_all', active: oneIsUncheck })

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleCheckAll = (): any => {
		checkBoxHandler(checkAll.id, checkAll.active, target, radio)
		setCheckAll((prevState) => ({
			...prevState,
			active: !prevState.active,
		}))
	}

	const handleUncheckCheckAll = (check: boolean): any => {
		if (check) {
			setCheckAll((prevState) => ({
				...prevState,
				active: false,
			}))
		}
	}

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			{data.length > 4 && !radio && (
				<PaperListWrapper onClick={handleCheckAll}>
					<PaperCheckbox id={checkAll.id} value={checkAll.label} checked={checkAll.active} type={!radio ? 'checkbox' : 'radio'} />
					<PaperListItems>{t(`common:${checkAll.label}`)}</PaperListItems>
				</PaperListWrapper>
			)}
			{map(data, (elem, id) => (
				<PaperListWrapper
					key={id}
					onClick={() => {
						handleUncheckCheckAll(elem.active)
						checkBoxHandler(elem.id, elem.active, target, radio)
					}}
				>
					<PaperCheckbox id={elem.id} value={elem.label} name={target} checked={elem.active} type={!radio ? 'checkbox' : 'radio'} />
					{!isEmpty(pics) && pics[id].id === elem.id && <PaperPic src={`${pics[id].picture}`} />}
					{!isNull(elem.label) && elem.label.includes('/') ? (
						<PaperListItems>{elem.label.split(' / ')[0] + '/' + t(elem.label.split(' / ')[1])} </PaperListItems>
					) : (
						<PaperListItems>{toTranslate ? t(`${prefixTranslation}${elem.label}`) : elem.label} </PaperListItems>
					)}
				</PaperListWrapper>
			))}
		</>
	)
}

export default PaperList
