////////LIBRARY/////////
import { isUndefined } from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { Controller, useFormContext, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
///////COMPONENTS///////
import Head from 'next/head'
import { useRouter } from 'next/router'
import { RootState } from '../../interfaces/store/store.interfaces'
import { loginActionCreators } from '../../store/actions'
import {
	Button,
	CheckboxWrapper,
	InputErrorMessage,
	InputLabel,
	InputLabelWrapper,
	InputWrapper,
	StyledInput,
	StyledLink,
	StyledText,
} from '../../theme/GlobalCss'
import theme from '../../theme/theme'
/////////ASSETS/////////
import GCALogo from '../../assets/images/login/logo.svg'
import PasswordToggleIcon from '../../assets/icones/login/eye-close.svg'
import VisiblePasswordToggleIcon from '../../assets/icones/login/eye.svg'
import ModalRegister from '../../components/Login/ModalRegister'

/////////STYLED/////////
const LoginLayout = styled.div`
	height: 100vh;
	max-width: 100vw;
	display: flex;
	flex-direction: row;
`
const LoginLayoutImg = styled.div`
	width: 50%;
	height: 100%;
	& > img {
		width: 50%;
		height: 100%;
	}
	background-image: url(${GCALogo});
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
`
const LoginLayoutForm = styled.div`
	width: 50%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`
const LoginFormWrapper = styled.div`
	height: auto;
	width: 430px;
	display: flex;
	flex-direction: column;
	& > form {
		margin-top: 20px;
		display: grid;
		grid-row-gap: 25px;
	}
`
export const PasswordInputWrapper = styled.div`
	display: flex;
	position: relative;
	& > input {
		position: relative;
		padding-right: 50px;
		width: 100%;
	}
`
export const PasswordToggleWrapper = styled.div`
	background-image: url(${(props: PasswordToggleWrapperProps) => (props.visiblePassword ? VisiblePasswordToggleIcon : PasswordToggleIcon)});
	background-color: ${theme.colors.light_500};
	background-repeat: no-repeat;
	background-position: center;
	width: 50px;
	z-index: 5;
	position: absolute;
	height: calc(100% - 2px);
	top: 1px;
	right: 1px;
	border-bottom-right-radius: 5px;
	border-top-right-radius: 5px;
`
const LoginFormTitle = styled.span`
	font-size: 30px;
	font-weight: ${theme.text.fontWeight.medium};
	margin-bottom: 5px;
`
const LoginFormText = styled.span`
	color: ${theme.colors.secondary_400};
`
/////////STYLED/////////

///////INTERFACES///////
interface PasswordToggleWrapperProps {
	visiblePassword: boolean
}
///////INTERFACES///////

const Login: FC<any> = ({ mockLogin }) => {
	const { user } = useSelector(
		(state: RootState) => ({
			user: state.user,
		}),
		shallowEqual
	)
	const actionsLogin = bindActionCreators(loginActionCreators, useDispatch())
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
	const router = useRouter()
	const defaultValues = { email: '', password: '' }
	const { t } = useTranslation()
	const [showModalRegister, setShowModalRegister] = useState<boolean>(false)

	///////////////////////////////// CONFIG ///////////////////////////////////////

	// BROWSER TAB TITLE
	let title = ''
	switch (process.env.NEXT_PUBLIC_REACT_APP_TARGET) {
		case 'development':
			title = 'Dev-Projet'
			break
		default:
			title = 'Projet'
	}

	const loginFormSchema = Yup.object().shape({
		email: Yup.string().email('Format invalide !').required('Champ requis !'),
		password: Yup.string().min(1, 'Un caractère minimum !').max(150, 'Nombre de caractères trop élevé !').required('Champs requis !'),
	})

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		reset,
	} = useForm({
		resolver: yupResolver(loginFormSchema),
		defaultValues,
	})

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const onSubmit = async (data: any): Promise<void> => {
		console.log('debug click', data)
		if (!isUndefined(mockLogin)) {
			await mockLogin(data.email, data.password)
			return
		}
		const user = {
			email: data.email,
			password: data.password,
			rememberMe: data.rememberMe,
		}
		actionsLogin.getLogin(user)
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////
	// Redirect if connected
	useEffect(() => {
		if (user.isConnected) {
			//router.push(uriList.dashboard)
		}
	}, [user.isConnected, router])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<ModalRegister showModal={showModalRegister} closeModalHandler={() => setShowModalRegister(false)} />
			<LoginLayout>
				<LoginLayoutImg />
				<LoginLayoutForm>
					<LoginFormWrapper>
						<form onSubmit={handleSubmit(onSubmit)}>
							<LoginFormTitle>{t('login:page_login_title')}</LoginFormTitle>
							<LoginFormText>{t('login:page_login_text_description')}</LoginFormText>
							<InputWrapper>
								<InputLabelWrapper>
									<InputLabel>{t('login:page_login_form_label_username')}</InputLabel>
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
										<InputErrorMessage data-testid="password-error-message">
											{errors.password.message?.toString()}
										</InputErrorMessage>
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
							<CheckboxWrapper>
								<input type="checkbox" />
								<label>{t('login:page_login_checkbox_rememberMe')}</label>
							</CheckboxWrapper>
							<StyledLink align={'right'} onClick={() => setShowModalRegister(true)}>
								S'inscrire
							</StyledLink>
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
						</form>
					</LoginFormWrapper>
				</LoginLayoutForm>
			</LoginLayout>
		</>
	)
}
export default Login
