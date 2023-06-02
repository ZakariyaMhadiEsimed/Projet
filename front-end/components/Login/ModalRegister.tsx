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
import React, { useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { PasswordInputWrapper, PasswordToggleWrapper } from '../../pages/login/Login'
import theme from '../../theme/theme'
import DatePickerInput from '../Form/DatePickerInput'

interface ModalRegisterProps {
	showModal: boolean
	closeModalHandler: () => void
}
const ModalRegister = (props: ModalRegisterProps) => {
	const defaultValues = { email: '', password: '', firstName: '', lastName: '', birthDate: '', postalAdress: '', phone: '', CA: '', taxes: '' }
	const { t } = useTranslation()
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false)

	const registerFormSchema = Yup.object().shape({
		firstName: Yup.string().required('Champ requis !').min(1, 'Un caractère minimum !').max(150, 'Nombre de caractères trop élevé !'),
		lastName: Yup.string().required('Champ requis !').min(1, 'Un caractère minimum !').max(150, 'Nombre de caractères trop élevé !'),
		birthDate: Yup.string().required('Champ requis !'),
		postalAdress: Yup.string().required('Champ requis !').min(1, 'Un caractère minimum !').max(150, 'Nombre de caractères trop élevé !'),
		phone: Yup.string().required('Champ requis !'),
		CA: Yup.string().required('Champ requis !'),
		taxes: Yup.string().required('Champ requis !'),
		email: Yup.string().email('Format invalide !').required('Champ requis !').email('Format invalide !'),
		password: Yup.string().min(1, 'Un caractère minimum !').max(150, 'Nombre de caractères trop élevé !').required('Champs requis !'),
	})

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(registerFormSchema),
		defaultValues,
	})

	const onSubmit = async (data: any): Promise<void> => {
		console.log('debug click', data)
	}

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>Inscription</ModalTitle>
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
										/*<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="birthDate"
											type="date"
											hasError={!isUndefined(errors.birthDate)}
										/>*/
										<DatePickerInput onChange={onChange} value={value} />
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
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="phone"
											type="text"
											hasError={!isUndefined(errors.phone)}
											placeholder={'Saisissez le numéro de téléphone'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>CA</InputLabel>
									{errors.CA && <InputErrorMessage>{errors.CA.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`CA`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="CA"
											type="text"
											hasError={!isUndefined(errors.CA)}
											placeholder={'Sasissez le CA à atteindre'}
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
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="taxes"
											type="text"
											hasError={!isUndefined(errors.taxes)}
											placeholder={'Saisissez le taux de charge'}
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
						<InputWrapper>
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
							value={t('login:page_login_button_login').toString()}
						/>
					</div>
				</form>
			</ModalsBodyContainer>
		</Modals>
	)
}

export default ModalRegister
