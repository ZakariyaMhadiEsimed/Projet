import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import {
	Button,
	FormHandler,
	InputErrorMessage,
	InputLabel,
	InputLabelWrapper,
	InputWrapper,
	ModalsBodyContainer,
	PageFormColumnWrapper,
	PageFormFieldWrapper,
	StyledInput,
} from '../../theme/GlobalCss'
import { Controller, useForm } from 'react-hook-form'
import { isUndefined } from 'lodash'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { PasswordInputWrapper, PasswordToggleWrapper } from '../../pages/login/Login'
import theme from '../../theme/theme'
import DatePickerInput from '../Form/DatePickerInput'
import moment from 'moment/moment'
import StyledInputPhoneNumber from '../Form/StyledInputPhoneNumber'
import StyledInputInteger from '../Form/StyledInputInteger'
import API_TOKEN, { API } from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'
import { bindActionCreators } from 'redux'
import { loginActionCreators } from '../../store/actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../interfaces/store/store.interfaces'

interface ModalRegisterProps {
	showModal: boolean
	closeModalHandler: () => void
	isEdit?: boolean
}
const ModalRegister = (props: ModalRegisterProps) => {
	const { user } = useSelector(
		(state: RootState) => ({
			user: state.user,
		}),
		shallowEqual
	)
	const defaultValues = { email: '', password: '', firstName: '', lastName: '', birthDate: '', postalAdress: '', phone: '', CA: '', taxes: '' }
	const { t } = useTranslation()
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
	const actionsLogin = bindActionCreators(loginActionCreators, useDispatch())

	const registerFormSchema = Yup.object().shape({
		firstName: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		lastName: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		birthDate: Yup.string().required('Champ requis !'),
		postalAdress: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		phone: Yup.string().required('Champ requis !').min(10, 'Format invalide !'),
		CA: Yup.string().required('Champ requis !'),
		taxes: Yup.string().required('Champ requis !'),
		email: Yup.string().email('Format invalide !').required('Champ requis !').email('Format invalide !'),
		password: Yup.string()
			.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				'Le mot de passe doit contenir des caractères mixtes (minuscules, majuscules, chiffres et symboles)'
			)
			.notOneOf(['password', '123456', 'azerty', 'admin', 'root'], 'Champ invalide')
			.required('Champs requis'),
	})

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		resolver: yupResolver(registerFormSchema),
		defaultValues,
	})

	const fetchCreateUser = async (data: any): Promise<any> => {
		const users = await API.post(R.POST_CREATE_USER(), data)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}

	const fetchGetUser = async (): Promise<any> => {
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.get(R.GET_USER())
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}

	const onSubmit = async (data: any): Promise<void> => {
		if (props.isEdit) {
			console.log('debug edit')
		} else {
			await fetchCreateUser(data).then((r) => {
				if (!isUndefined(r)) {
					actionsLogin.getLogin({ email: data.email, password: data.password })
				}
			})
		}
	}

	useEffect(() => {
		if (props.isEdit && props.showModal) {
			fetchGetUser().then((r) => {
				setValue('firstName', r.firstName)
				setValue('lastName', r.lastName)
				setValue('birthDate', r.birthDate)
				setValue('postalAdress', r.postalAdress)
				setValue('phone', r.phone)
				setValue('CA', r.CA)
				setValue('taxes', r.taxes)
				setValue('email', r.email)
				setValue('password', r.password)
			})
		}
		getValues('phone')
	}, [props.showModal])

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{props.isEdit ? 'Mes informations' : 'Inscription'}</ModalTitle>
			<ModalsBodyContainer>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormHandler formCols={3}>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Prénom</InputLabel>
									{errors.firstName && <InputErrorMessage>{errors.firstName.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`firstName`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="firstName"
											type="text"
											hasError={!isUndefined(errors.firstName)}
											placeholder={'Saisissez le prénom'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Nom</InputLabel>
									{errors.lastName && <InputErrorMessage>{errors.lastName.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`lastName`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="lastName"
											type="text"
											hasError={!isUndefined(errors.lastName)}
											placeholder={'Saisissez le nom'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Date de naissance</InputLabel>
									{errors.birthDate && <InputErrorMessage>{errors.birthDate.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`birthDate`}
									render={({ field: { onChange, value, name } }) => (
										<DatePickerInput
											onChange={onChange}
											value={value}
											name={name}
											hasError={!isUndefined(errors.birthDate)}
											maxDate={moment(new Date()).subtract(18, 'years').toDate()}
										/>
									)}
								/>
							</PageFormFieldWrapper>
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Adresse postale</InputLabel>
									{errors.postalAdress && <InputErrorMessage>{errors.postalAdress.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`postalAdress`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="postalAdress"
											type="text"
											hasError={!isUndefined(errors.postalAdress)}
											placeholder={'Saisissez votre adresse postale'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Téléphone</InputLabel>
									{errors.phone && <InputErrorMessage>{errors.phone.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`phone`}
									render={({ field: { name, value } }) => (
										<StyledInputPhoneNumber
											name={name}
											dataTestId="phone"
											setValue={setValue}
											hasError={!isUndefined(errors.phone)}
											placeholder={'Saisissez le numéro de téléphone'}
											value={value}
										/>
									)}
								/>
							</PageFormFieldWrapper>
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>CA (en €)</InputLabel>
									{errors.CA && <InputErrorMessage>{errors.CA.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`CA`}
									render={({ field: { name, value } }) => (
										<StyledInputInteger
											name={name}
											dataTestId={'CA'}
											setValue={setValue}
											hasError={!isUndefined(errors.CA)}
											placeholder={'Sasissez le CA à atteindre'}
											value={value}
										/>
									)}
								/>
							</PageFormFieldWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Taux de charge</InputLabel>
									{errors.taxes && <InputErrorMessage>{errors.taxes.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`taxes`}
									render={({ field: { name, value } }) => (
										<StyledInputInteger
											name={name}
											dataTestId="taxes"
											setValue={setValue}
											hasError={!isUndefined(errors.taxes)}
											placeholder={'Saisissez le taux de charge'}
											maxDigits={3}
											max={100}
											value={value}
										/>
									)}
								/>
							</PageFormFieldWrapper>
						</PageFormColumnWrapper>
					</FormHandler>
					<div style={{ paddingTop: '20px' }}>
						<InputWrapper>
							<InputLabelWrapper>
								<InputLabel>Email</InputLabel>
								{errors.email && <InputErrorMessage>{errors.email.message?.toString()}</InputErrorMessage>}
							</InputLabelWrapper>
							<Controller
								control={control}
								name={`email`}
								render={({ field: { onChange, value, name } }) => (
									<StyledInput
										onChange={onChange}
										value={value}
										name={name}
										data-testid="email"
										type="text"
										hasError={!isUndefined(errors.email)}
										placeholder={t('login:page_login_form_placeholder_username').toString()}
									/>
								)}
							/>
						</InputWrapper>
						<InputWrapper style={{ marginTop: '10px' }}>
							<InputLabelWrapper>
								<InputLabel>{t('login:page_login_form_label_password')}</InputLabel>
								{errors.password && (
									<InputErrorMessage data-testid="password-error-message">{errors.password.message?.toString()}</InputErrorMessage>
								)}
							</InputLabelWrapper>
							<PasswordInputWrapper>
								<Controller
									control={control}
									name={`password`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="password"
											type={visiblePassword ? 'text' : 'password'}
											hasError={!isUndefined(errors.password)}
											placeholder={t('login:page_login_form_placeholder_password').toString()}
										/>
									)}
								/>
								<PasswordToggleWrapper visiblePassword={visiblePassword} onClick={() => setVisiblePassword(!visiblePassword)} />
							</PasswordInputWrapper>
						</InputWrapper>
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
							value={props.isEdit ? 'Enregistrer' : "S'inscrire et se connecter"}
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

export default ModalRegister
