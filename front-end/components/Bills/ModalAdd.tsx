import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import {
	Button,
	FormHandler,
	InputErrorMessage,
	InputLabel,
	InputLabelWrapper,
	ModalsBodyContainer,
	PageFormColumnWrapper,
	PageFormFieldWrapper,
	StyledInput,
} from '../../theme/GlobalCss'
import { Controller, useForm } from 'react-hook-form'
import { isEmpty, isNull, isUndefined } from 'lodash'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import theme from '../../theme/theme'
import API_TOKEN from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'
import styled from 'styled-components'
import DatePickerInput from '../Form/DatePickerInput'
import moment from 'moment'
import FormSelect from '../Form/FormSelect'
import { OptionStyled } from '../Projects/ModalAdd'
import StyledInputInteger from '../Form/StyledInputInteger'
import CloseIcon from '../../assets/icones/global/close.svg'
import { use } from 'i18next'

export const dataPayment = [
	{
		id: 1,
		label: 'Prélevement',
	},
	{
		id: 2,
		label: 'Virement',
	},
	{
		id: 3,
		label: 'Carte bancaire',
	},
	{
		id: 4,
		label: 'Chèque',
	},
]
const CloseImage = styled.a`
	cursor: pointer;
	margin-left: 20px;
	margin-top: 15px;
	background-image: url(${CloseIcon});
	background-repeat: no-repeat;
`
export const RadioListContainer = styled.div`
	display: flex;
	align-items: center;
	margin-left: 1rem;
	margin-top: 0.75rem;
	margin-bottom: 2rem;
`

interface ModalAddProps {
	showModal: boolean
	closeModalHandler: () => void
	id?: number | null
}
const ModalAdd = (props: ModalAddProps) => {
	const [dataSelect, setDataSelect] = useState<any>()
	const registerFormSchema = Yup.object().shape({
		projectId: Yup.number().required('Champ requis !').moreThan(0),
		paymentLimits: Yup.string().required('Champ requis !'),
		paymentTypeId: Yup.number().required('Champ requis !').moreThan(0),
		footer: Yup.string().required('Champs requis !'),
	})
	const [nameToDisplay, setNameToDisplay] = useState<string>('')
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(registerFormSchema),
	})
	const [rows, setRows] = useState<Array<any>>([]) // Tableau pour stocker les données des lignes
	const [count, setCount] = useState<number>(0) // Compteur pour générer des identifiants uniques pour chaque ligne
	const [total, setTotal] = useState<number>(0)
	const [rowsId, setRowsId] = useState<number>(0)
	const fetchCreateBill = async (data: any): Promise<any> => {
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.post(R.POST_CREATE_BILL(), data)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}

	const fetchUpdateBill = async (data: any): Promise<any> => {
		const token = Store.get('user')
		if (!isNull(props.id) && props.id) {
			const customer = await API_TOKEN(token.authenticationToken)
				.put(R.PUT_UPDATE_BILL(props.id), data)
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, message: JSON.stringify(e) }
				})
			if (!customer.error) {
				return customer
			}
		}
	}

	const fetchGetBill = async (id: number): Promise<any> => {
		const token = Store.get('user')
		if (!isNull(props.id)) {
			const customer = await API_TOKEN(token.authenticationToken)
				.get(R.GET_BILL(id))
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, message: JSON.stringify(e) }
				})
			if (!customer.error) {
				return customer
			}
		}
	}
	const fetchGetProjects = async (): Promise<any> => {
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.get(R.GET_PROJECT_SELECT())
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}

	const onSubmit = async (data: any): Promise<void> => {
		if (!isNull(props.id) && props.id) {
			data.isCompany = data.typeId
			data.id = props.id
			data.lines = rows
			data.total = total
			data.rowsId = rowsId
			delete data.typeId
			await fetchUpdateBill(data)
		} else {
			data.lines = rows
			data.total = total
			await fetchCreateBill(data)
		}
		props.closeModalHandler()
	}

	const addRow = () => {
		setCount((prevCount) => prevCount + 1) // Incrémentez le compteur pour générer un nouvel identifiant unique
		setRows((prevRows) => [
			...prevRows,
			{ id: count + 1, quantity: '', label: '' }, // Ajoutez une nouvelle ligne avec un identifiant unique et des valeurs par défaut pour les inputs
		])
	}

	const deleteRow = (id) => {
		const updatedRows = rows.filter((row) => row.id !== id)
		setRows(updatedRows)
	}

	useEffect(() => {
		if (props.id && props.showModal) {
			fetchGetBill(props.id).then((r) => {
				console.log('debug r : ', r)
				setValue('paymentLimits', r?.paymentLimits)
				setValue('paymentTypeId', r?.paymentTypeId)
				setValue('projectId', r?.projectId)
				setValue('footer', r?.footer)
				setTotal(r?.total)
				setNameToDisplay(r?.number)
				setRows(JSON.parse(r?.rows))
				setRowsId(r?.rowsId)
				console.log('debug content : ', r?.content)
			})
		} else setNameToDisplay('Nouveau client')
		fetchGetProjects().then((r) => setDataSelect(r))
	}, [props.showModal])

	useEffect(() => {
		if (!isEmpty(rows)) {
			let total = 0
			rows.map((row) => {
				total += row.quantity * row.price
			})
			setTotal(total)
		}
	}, [rows])

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{nameToDisplay}</ModalTitle>
			<ModalsBodyContainer>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormHandler formCols={3}>
						<PageFormColumnWrapper>
							<InputLabelWrapper>
								<InputLabel>Projet associé</InputLabel>
								{errors.projectId && <InputErrorMessage>{errors.projectId.message?.toString()}</InputErrorMessage>}
							</InputLabelWrapper>
							<Controller
								control={control}
								name={`projectId`}
								render={({ field: { onChange, value, name } }) => (
									<FormSelect
										onChange={onChange}
										value={value}
										name={name}
										label={'test'}
										placeholder={'test'}
										isPlaceHolder={value == 0 || isEmpty(value)}
										hasError={errors.projectId}
										error={errors.projectId}
										isRequired={true}
									>
										<>
											<OptionStyled key={0} value={0}>
												Choisir un projet
											</OptionStyled>
											{!isUndefined(dataSelect) &&
												dataSelect.map((item: any) => {
													return (
														<OptionStyled key={item.id} value={item.id}>
															{item.name}
														</OptionStyled>
													)
												})}
										</>
									</FormSelect>
								)}
							/>
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<InputLabelWrapper>
								<InputLabel>Date Limite de paiement</InputLabel>
								{errors.paymentLimits && <InputErrorMessage>{errors.paymentLimits.message?.toString()}</InputErrorMessage>}
							</InputLabelWrapper>
							<Controller
								control={control}
								name={`paymentLimits`}
								render={({ field: { onChange, value, name } }) => (
									<DatePickerInput
										onChange={onChange}
										value={value}
										name={name}
										hasError={!isUndefined(errors.paymentLimits)}
										minDate={moment(new Date()).toDate()}
									/>
								)}
							/>
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<InputLabelWrapper>
								<InputLabel>Type de paiement</InputLabel>
								{errors.paymentTypeId && <InputErrorMessage>{errors.paymentTypeId.message?.toString()}</InputErrorMessage>}
							</InputLabelWrapper>
							<Controller
								control={control}
								name={`paymentTypeId`}
								render={({ field: { onChange, value, name } }) => (
									<FormSelect
										onChange={onChange}
										value={value}
										name={name}
										label={'test'}
										placeholder={'test'}
										isPlaceHolder={value == 0 || isEmpty(value)}
										hasError={errors.paymentTypeId}
										error={errors.paymentTypeId}
										isRequired={true}
									>
										<>
											<OptionStyled key={0} value={0}>
												Choisir un paiement
											</OptionStyled>
											{!isUndefined(dataPayment) &&
												dataPayment.map((item: any) => {
													return (
														<OptionStyled key={item.id} value={item.id}>
															{item.label}
														</OptionStyled>
													)
												})}
										</>
									</FormSelect>
								)}
							/>
						</PageFormColumnWrapper>
					</FormHandler>
					<div style={{ marginTop: '20px', marginBottom: '10px' }}>
						{!isEmpty(rows) && (
							<div style={{ display: 'flex', marginBottom: '5px' }}>
								<div style={{ flex: '1 0 25%', marginRight: '10px', maxWidth: '70px', fontWeight: '500' }}>Qty</div>
								<div style={{ flex: '1 0 25%', marginRight: '10px', maxWidth: '70px', fontWeight: '500' }}>Prix</div>
								<div style={{ flex: '1 0 50%', fontWeight: '500' }}>Description</div>
							</div>
						)}
						{rows.map((row) => (
							<div key={row.id} style={{ display: 'flex', marginBottom: '5px' }}>
								<div style={{ flex: '1 0 25%', marginRight: '10px', maxWidth: '70px' }}>
									<StyledInputInteger
										value={row.quantity}
										onChange={(e: any) => {
											const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, quantity: e } : r))
											setRows(updatedRows)
										}}
									/>
								</div>
								<div style={{ flex: '1 0 25%', marginRight: '10px', maxWidth: '70px' }}>
									<StyledInputInteger
										value={row.price}
										onChange={(e: any) => {
											const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, price: e } : r))
											setRows(updatedRows)
										}}
									/>
								</div>
								<div style={{ flex: '1 0 50%' }}>
									<StyledInput
										type="text"
										value={row.label}
										onChange={(e) => {
											const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, label: e.target.value } : r))
											setRows(updatedRows)
										}}
									/>
								</div>
								<CloseImage onClick={() => deleteRow(row.id)}>
									<img src={close} width={13} height={13} alt="" />
								</CloseImage>
							</div>
						))}
					</div>
					<Button
						type="button"
						onClick={addRow}
						backgroundColor={theme.colors.primary}
						color={theme.colors.white}
						hoverBackgroundColor={theme.colors.primary_200}
						percentUnit={true}
						fontSize={theme.text.fontSize.fs}
						value={'Ajouter une ligne'}
					/>
					{!isNaN(total) && total != 0 && (
						<div
							style={{
								textAlign: 'right',
								fontSize: '15px',
								border: '1px solid lightgrey',
								borderRadius: '5px',
								padding: '10px',
								marginTop: '10px',
							}}
						>
							Total <span style={{ fontWeight: '500' }}>{total.toFixed(2)}€</span>
						</div>
					)}
					<div style={{ marginTop: '15px' }}>
						<PageFormFieldWrapper>
							<InputLabelWrapper>
								<InputLabel>Bas de page</InputLabel>
								{errors.footer && <InputErrorMessage>{errors.footer.message?.toString()}</InputErrorMessage>}
							</InputLabelWrapper>
							<Controller
								control={control}
								name={`footer`}
								render={({ field: { onChange, value, name } }) => (
									<StyledInput
										onChange={onChange}
										value={value}
										name={name}
										data-testid="footer"
										type="text"
										hasError={!isUndefined(errors.footer)}
										placeholder={'Saisissez le bas de page'}
									/>
								)}
							/>
						</PageFormFieldWrapper>
					</div>
					<div style={{ paddingTop: '50px' }}>
						<Button
							type="submit"
							width={100}
							height={50}
							backgroundColor={theme.colors.primary}
							color={theme.colors.white}
							hoverBackgroundColor={theme.colors.primary_200}
							percentUnit={true}
							fontSize={theme.text.fontSize.fl}
							value={props.id ? 'Enregistrer' : 'Valider'}
							onClick={() => {
								if (!errors) props.closeModalHandler()
								handleSubmit(onSubmit)
							}}
						/>
					</div>
				</form>
			</ModalsBodyContainer>
		</Modals>
	)
}

export default ModalAdd
