/* eslint-disable react-hooks/exhaustive-deps */
////////LIBRARY/////////
import { cloneDeep, find, isUndefined, map } from 'lodash'
import { NextPage } from 'next'
import cookies from 'next-cookies'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
///////COMPONENTS///////
import PageActions from '../../../components/PageActions'
import { PageActionsButton, PageActionsButtonPreviousPage, PageActionsButtonReset } from '../../../components/PageActions/PageActions'
import API_TOKEN from '../../../config/AxiosConfig'
import * as R from '../../../constants/Endpoint'
import { uriList } from '../../../constants/RouteList'
import Store from '../../../helpers/Store'
import { errorManagerActionCreators, globalLoadingActionCreators, toastSuccessActionCreators } from '../../../store/actions'
import {
	Button,
	FormHandler,
	FormInputLabelWrapper,
	InputErrorMessage,
	InputLabel,
	OptionCustom,
	PageFormColumnWrapper,
	PageFormHandler,
	PageFormTitle,
	RadioInput,
	RadioInputLabel,
	RadioWrapper,
	SelectInput,
	SelectInputWrapper,
	StyledInput,
} from '../../../theme/GlobalCss'
import theme from '../../../theme/theme'

/////////STYLED/////////
type usersEditProps = {
	usersUpdateData?: any | undefined
	error?: any | undefined
}
type userEditItem = {
	[key: string]: string | number
	profileId: number
	defaultLanguageId: number
	firstName: string
	lastName: string
	email: string
	clinicId: number
	sectorId: number
	roleId: number
	username: string
}
/////////STYLED/////////

const UsersEdit: NextPage<usersEditProps> = (props): JSX.Element | null => {

	const [formStateDefaultValues, setFormStateDefaultValues] = useState({
		profileId: 0,
		defaultLanguageId: 1,
		firstName: '',
		lastName: '',
		email: '',
		clinicId: 0,
		sectorId: 0,
		roleId: 0,
		username: '',
	})
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		reset,
	} = useForm({
		defaultValues: formStateDefaultValues,
	})
	const [watcherValues, setWatcherValues] = useState<userEditItem>(formStateDefaultValues)
	const actionsErrorManager = bindActionCreators(errorManagerActionCreators, useDispatch())
	const actionsGlobalLoading = bindActionCreators(globalLoadingActionCreators, useDispatch())
	const actionsToastSuccess = bindActionCreators(toastSuccessActionCreators, useDispatch())
	const router = useRouter()
	const { t } = useTranslation()

	///////////////////////////////// CONFIG ///////////////////////////////////////

	const pageActionsConfig = {
		pageActions: [
			() => (
				<PageActionsButtonReset
					hoverBackgroundColor={theme.colors.primary_200}
					type="button"
					onClick={() => reset(formStateDefaultValues)}
					value={t('common:common_text_reset').toString()}
				/>
			),
			() => <PageActionsButton hoverBackgroundColor={theme.colors.primary_200} type="submit" value={t('common:common_text_save').toString()} />,
		],
		prevLinkButton: (
			<PageActionsButtonPreviousPage
				type="button"
				onClick={() => router.push(`${uriList.users}`)}
				value={t('common:common_text_previousPage').toString()}
			/>
		),
	}

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const fetchDataEditUser = async (data: any): Promise<any> => {
		if (!isUndefined(router.query.userId)) {
			const token = Store.get('user')
			const userEdit = await API_TOKEN(token.authenticationToken)
				.put(R.EDIT_USER(parseInt(router.query.userId?.toString())), data)
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, response: e.response }
				})
			if (!userEdit.error) {
				actionsGlobalLoading.endLoading()
				actionsToastSuccess.hydrateToast(t('usersEdit:page_usersEdit_toast_userModified'))
				router.push(`${uriList.users}`)
			} else {
				actionsGlobalLoading.endLoading()
				actionsErrorManager.createError(userEdit.response)
			}
		}
	}

	const fetchDataChangePassword = async (userId: number): Promise<any> => {
		const token = Store.get('user')
		const userChangePassword = await API_TOKEN(token.authenticationToken)
			.put(R.CHANGE_PASSWORD_USER(userId))
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (userChangePassword.error) {
			actionsErrorManager.createError(userChangePassword.response)
		}
		actionsGlobalLoading.endLoading()
	}

	const handleChangePassword = (userId: number): void => {
		actionsGlobalLoading.startLoading()
		fetchDataChangePassword(userId)
	}

	const onSubmit = (data: any): void => {
		const datas = cloneDeep(data)
		actionsGlobalLoading.startLoading()
		fetchDataEditUser(datas)
	}

	// Storing properly current values to determine actions
	const setWatcherValuesHandler = (field: string, value: any): void => {
		const obj: userEditItem = cloneDeep(watcherValues)
		obj[field] = value
		setWatcherValues(obj)
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	// Effects after update data call
	useEffect(() => {
		if (props.error) {
			actionsErrorManager.createError(props.error.response)
		} else {
			const profile = find(props.usersUpdateData.profiles, { selected: true })
			const language = find(props.usersUpdateData.languages, { selected: true })
			const clinic = find(props.usersUpdateData.clinics, { selected: true })
			const sector = find(props.usersUpdateData.sectors, { selected: true })
			const role = find(props.usersUpdateData.roles, { selected: true })

			!isUndefined(profile) && setValue('profileId', profile.profileId.toString())
			!isUndefined(language) && setValue('defaultLanguageId', language.languageId)

			setValue('firstName', props.usersUpdateData.userIdentityData.firstName)
			setValue('lastName', props.usersUpdateData.userIdentityData.lastName)
			setValue('email', props.usersUpdateData.userIdentityData.email)

			!isUndefined(clinic) && setValue('clinicId', clinic.clinicId)
			!isUndefined(sector) && setValue('sectorId', sector.sectorId)
			!isUndefined(role) && setValue('roleId', role.roleId)

			setValue('username', props.usersUpdateData.userIdentityData.username)
			setFormStateDefaultValues(getValues())
		}
	}, [props])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{!isUndefined(pageActionsConfig) && <PageActions pageActionsConfig={pageActionsConfig} />}
				{props.usersUpdateData ? (
					<PageFormHandler>
						<PageFormTitle>{t('usersEdit:page_usersEdit_form_title')}</PageFormTitle>
						<FormHandler formCols={2}>
							<PageFormColumnWrapper>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_defaultLanguageId')} * :`}</InputLabel>
									{errors.defaultLanguageId && (
										<InputErrorMessage>{errors.defaultLanguageId.message?.toString()}</InputErrorMessage>
									)}
								</FormInputLabelWrapper>
								<SelectInputWrapper hasError={!isUndefined(errors.defaultLanguageId)}>
									<SelectInput
										{...register('defaultLanguageId', {
											required: {
												value: true,
												message: t('common:common_text_error_required'),
											},
											validate: (value) => value > 0 || t('common:common_text_error_required').toString(),
										})}
										onChange={(e) => setWatcherValuesHandler('defaultLanguageId', parseInt(e.target.value))}
										className={watcherValues?.defaultLanguageId > 0 ? 'active' : ''}
									>
										<OptionCustom value="0" hidden>
											{t('usersEdit:page_usersEdit_form_placeholder_defaultLanguageId')}
										</OptionCustom>
										{map(props.usersUpdateData.languages, (elem, id) => {
											return (
												<OptionCustom key={id} value={elem.languageId}>
													{elem.languageLabel}
												</OptionCustom>
											)
										})}
									</SelectInput>
								</SelectInputWrapper>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_profileId')} * :`}</InputLabel>
									{errors.profileId && <InputErrorMessage>{errors.profileId.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<RadioWrapper>
									{map(props.usersUpdateData.profiles, (elem) => {
										return (
											<>
												<RadioInput
													type="radio"
													id={elem.profileName}
													value={elem.profileId}
													{...register('profileId', {
														required: {
															value: true,
															message: t('common:common_text_error_required'),
														},
														validate: (value) => value > 0 || t('common:common_text_error_required').toString(),
													})}
												/>
												<RadioInputLabel htmlFor={elem.profileName}>{elem.profileName}</RadioInputLabel>
											</>
										)
									})}
								</RadioWrapper>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_lastName')} * :`}</InputLabel>
									{errors.lastName && <InputErrorMessage>{errors.lastName.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<StyledInput
									type="text"
									hasError={!isUndefined(errors.lastName)}
									placeholder={t('usersEdit:page_usersEdit_form_placeholder_lastName').toString()}
									{...register('lastName', {
										required: {
											value: true,
											message: t('common:common_text_error_required'),
										},
										minLength: {
											value: 1,
											message: `1 ${t('common:common_text_charMin')}`,
										},
										maxLength: {
											value: 150,
											message: `150 ${t('common:common_text_charMax')}`,
										},
										pattern: {
											value: RegExp(/^[0-9A-Za-z\s\-\u00C0-\u00FF]+$/),
											message: t('common:common_text_invalid_format'),
										},
									})}
								/>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_firstName')} * :`}</InputLabel>
									{errors.firstName && <InputErrorMessage>{errors.firstName.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<StyledInput
									type="text"
									hasError={!isUndefined(errors.firstName)}
									placeholder={t('usersEdit:page_usersEdit_form_placeholder_firstName').toString()}
									{...register('firstName', {
										required: {
											value: true,
											message: t('common:common_text_error_required'),
										},
										minLength: {
											value: 1,
											message: `1 ${t('common:common_text_charMin')}`,
										},
										maxLength: {
											value: 150,
											message: `150 ${t('common:common_text_charMax')}`,
										},
										pattern: {
											value: RegExp(/^[0-9A-Za-z\s\-\u00C0-\u00FF]+$/),
											message: t('common:common_text_invalid_format'),
										},
									})}
								/>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_email')} * :`}</InputLabel>
									{errors.email && <InputErrorMessage>{errors.email.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<StyledInput
									type="text"
									hasError={!isUndefined(errors.email)}
									placeholder={t('usersEdit:page_usersEdit_form_placeholder_email').toString()}
									{...register('email', {
										required: {
											value: true,
											message: t('common:common_text_error_required'),
										},
										minLength: {
											value: 1,
											message: `1 ${t('common:common_text_charMin')}`,
										},
										maxLength: {
											value: 150,
											message: `150 ${t('common:common_text_charMax')}`,
										},
										pattern: {
											value: RegExp(
												/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
											),
											message: t('common:common_text_invalid_mail'),
										},
									})}
								/>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_clinicId')} * :`}</InputLabel>
									{errors.clinicId && <InputErrorMessage>{errors.clinicId.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<SelectInputWrapper hasError={!isUndefined(errors.clinicId)}>
									<SelectInput
										{...register('clinicId', {
											required: {
												value: true,
												message: t('common:common_text_error_required'),
											},
											validate: (value) => value > 0 || t('common:common_text_error_required').toString(),
										})}
										onChange={(e) => {
											if (watcherValues.profileId === 2) {
												const f = find(props.usersUpdateData.clinics, { clinicId: parseInt(e.target.value) })
												setValue('sectorId', f.clinicSectorId)
											}
											setWatcherValuesHandler('clinicId', parseInt(e.target.value))
										}}
										className={watcherValues?.clinicId > 0 ? 'active' : ''}
									>
										<OptionCustom value="0" hidden>
											{t('usersEdit:page_usersEdit_form_placeholder_clinicId')}
										</OptionCustom>
										{map(props.usersUpdateData.clinics, (elem, id) => {
											return (
												<OptionCustom key={id} value={elem.clinicId}>
													{elem.clinicCode}
												</OptionCustom>
											)
										})}
									</SelectInput>
								</SelectInputWrapper>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_sectorId')} * :`}</InputLabel>
									{errors.sectorId && <InputErrorMessage>{errors.sectorId.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<SelectInputWrapper hasError={!isUndefined(errors.sectorId)}>
									<SelectInput
										{...register('sectorId', {
											required: {
												value: true,
												message: t('common:common_text_error_required'),
											},
											validate: (value) => value > 0 || t('common:common_text_error_required').toString(),
										})}
										onChange={(e) => setWatcherValuesHandler('sectorId', parseInt(e.target.value))}
										className={watcherValues?.sectorId > 0 ? 'active' : ''}
									>
										<OptionCustom value="0" hidden>
											{t('usersEdit:page_usersEdit_form_placeholder_sectorId')}
										</OptionCustom>
										{map(props.usersUpdateData.sectors, (elem, id) => {
											return (
												<OptionCustom key={id} value={elem.sectorId}>
													{elem.sectorName}
												</OptionCustom>
											)
										})}
									</SelectInput>
								</SelectInputWrapper>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_roleId')} * :`}</InputLabel>
									{errors.roleId && <InputErrorMessage>{errors.roleId.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<SelectInputWrapper hasError={!isUndefined(errors.roleId)}>
									<SelectInput
										{...register('roleId', {
											required: {
												value: true,
												message: t('common:common_text_error_required'),
											},
											validate: (value) => value > 0 || t('common:common_text_error_required').toString(),
										})}
										onChange={(e) => setWatcherValuesHandler('roleId', parseInt(e.target.value))}
										className={watcherValues?.roleId > 0 ? 'active' : ''}
									>
										<OptionCustom value="0" hidden>
											{t('usersEdit:page_usersEdit_form_placeholder_roleId')}
										</OptionCustom>
										{map(props.usersUpdateData.roles, (elem, id) => {
											return (
												<OptionCustom key={id} value={elem.roleId}>
													{elem.roleName}
												</OptionCustom>
											)
										})}
									</SelectInput>
								</SelectInputWrapper>
							</PageFormColumnWrapper>
							<PageFormColumnWrapper>
								<FormInputLabelWrapper>
									<InputLabel>{`${t('usersEdit:page_usersEdit_form_label_username')} * :`}</InputLabel>
									{errors.username && <InputErrorMessage>{errors.username.message?.toString()}</InputErrorMessage>}
								</FormInputLabelWrapper>
								<StyledInput
									type="text"
									hasError={!isUndefined(errors.username)}
									placeholder={t('usersEdit:page_usersEdit_form_placeholder_username').toString()}
									defaultValue={props.usersUpdateData.userIdentityData.username}
									readOnly
									{...register('username', {
										required: {
											value: true,
											message: t('common:common_text_error_required'),
										},
										minLength: {
											value: 1,
											message: `1 ${t('common:common_text_charMin')}`,
										},
										maxLength: {
											value: 150,
											message: `150 ${t('common:common_text_charMax')}`,
										},
									})}
								/>
								<Button
									id="SubmitButtonUserEditChangePassword"
									type="button"
									//percentUnit={false}
									//fontSize={theme.text.fontSize.fm}
									value={t('usersEdit:page_usersEdit_button_changePassword').toString()}
									onClick={() =>
										!isUndefined(router.query.userId) && handleChangePassword(parseInt(router.query.userId.toString()))
									}
								/>
							</PageFormColumnWrapper>
						</FormHandler>
					</PageFormHandler>
				) : null}
			</form>
		</>
	)
}

export async function getServerSideProps(ctx: {
	req?: { headers: { cookie?: string | undefined } } | undefined
	query: any
}): Promise<{ props: usersEditProps }> {
	const cookie = cookies(ctx)

	if (!isUndefined(cookie.user)) {
		// cookie.user is considered as string, even if it is object ?
		// So we "cast" it as string
		const a = JSON.stringify(cookie.user)
		// And then parse it to make sure it is an exploitable object
		const token = JSON.parse(a)
		const usersUpdateData = await API_TOKEN(token.authenticationToken)
			.get(R.GET_USERS_UPDATE_DATA(ctx.query.userId))
			.then((res) => res.data)
			.catch((e) => {
				//console.log(e)
				if (!isUndefined(e.response?.data)) {
					return { error: true, response: e.response.data }
				} else {
					return { error: true, response: e.code }
				}
			})
		if (usersUpdateData.error) {
			return { props: { error: usersUpdateData.response } }
		} else {
			return { props: { usersUpdateData } }
		}
	} else {
		// TODO : If token expired, implement a redirect ?
		return { props: { error: 'NO TOKEN' } }
	}
}

export default UsersEdit
