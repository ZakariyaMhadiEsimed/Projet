////////LIBRARY/////////
import React, { Fragment, FC } from 'react'
import styled from 'styled-components'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTranslation } from 'react-i18next'
///////COMPONENTS///////
import theme from '../../theme/theme'
import Loading from '../Loading'
import ToastSuccess from '../ToastSuccess'
import { modalsActionCreators, loginActionCreators } from '../../store/actions'
import Modals from '../Modals/Modals'
import { Button, ButtonWrapper, ModalsBodyContainer } from '../../theme/GlobalCss'
import StringFormatter from '../../helpers/StringFormatter'
import Head from 'next/head'
import { RootState } from '../../interfaces/store/store.interfaces'
import Menu from '../Menu'
import Image from 'next/image'
import { RouteObject, uriList } from '../../constants/RouteList'
import { useRouter } from 'next/router'
/////////ASSETS/////////
import GCALogo from '../../assets/images/layout/gca-logo.svg'
import IconLogout from '../../assets/icones/layout/logout.svg'

/////////STYLED/////////
const GridLayout = styled.div`
	display: grid;
	grid-template-columns: 315px auto;
	background-color: ${theme.colors.menu_dark};
`
const LayoutLogoWrapper = styled.div`
	height: 80px;

	text-align: center;
	display: flex;
	& > img {
		margin: auto auto auto 24px;
	}
`
const HeaderWrapper = styled.div`
	height: 80px;
	background-color: ${theme.colors.white};
	display: flex;
	align-items: center;
	& > img {
		margin-right: 50px;
		cursor: pointer;
		margin-left: 0px;
	}
`
const LayoutPageWrapper = styled.div`
	background-color: ${theme.colors.layout};
	padding: 30px;
`
const PageTitle = styled.h2`
	font-size: 20px;
	margin: 0px 0px 0px 50px;
	font-weight: ${theme.text.fontWeight.medium};
`
const HeaderUserInfos = styled.span`
	font-size: ${theme.text.fontSize.fl};
	font-weight: bold;
	margin-left: auto;
	margin-right: 16px;
	text-decoration: underline;
`
/////////STYLED/////////

/////////TYPES//////////
type PropsLayout = {
	children: any
	routerParams?: RouteObject
}
/////////TYPES//////////

const Layout: FC<PropsLayout> = ({ children, routerParams }) => {

	const { user, modal } = useSelector(
		(state: RootState) => ({
			user: state.user,
			modal: state.modal,
		}),
		shallowEqual
	)
	const router = useRouter()
	const actionsLogin = bindActionCreators(loginActionCreators, useDispatch())
	const { t } = useTranslation()
	const actionsModal = bindActionCreators(modalsActionCreators, useDispatch())

	///////////////////////////////// CONFIG ///////////////////////////////////////

	// BROWSER TABLE TITLE
	let title = ''
	switch (process.env.NEXT_PUBLIC_REACT_APP_TARGET) {
		case 'development':
			title = 'Dev-GC-Aesthetics'
			break
		case 'recette':
			title = 'Recette-GC-Aesthetics'
			break
		case 'pre-recette':
			title = 'Pre-Recette-GC-Aesthetics'
			break
		case 'production':
			title = 'GC-Aesthetics'
			break
		default:
			title = 'GC-Aesthetics'
	}

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<Loading />
			{
				/*user.isConnected && */ <Fragment>
					<Head>
						<title>{title}</title>
						<link rel="shortcut icon" href={'/favicon.ico'} type="image/x-icon" />
					</Head>
					<Modals
						showModal={modal?.show} //modal.show
						closeModalHandler={!modal.path.length ? actionsModal.closeModal : actionsModal.closeModalRedirect}
						headerTitle={t(modal.title).toString()}
						level={modal.level}
						insideModalResponse={modal.insideModalResponse}
					>
						<ModalsBodyContainer hasTitle={t(modal.title).toString().length > 0}>
							<p>
								{StringFormatter.ResponseMessageParser(modal.message ? t(modal.message) : modal.message, modal.errorMsgParams) ||
									modal.message}
							</p>
						</ModalsBodyContainer>
						{/*<TextModal>{StringFormatter.ResponseMessageParser(modal.key, modal.errorMsgParams) || modal.key}</TextModal>*/}
						<ButtonWrapper multiple={true}>
							<Button
								id="SubmitButtonModalErrorOK"
								type="button"
								backgroundColor={theme.colors.danger}
								color={theme.colors.white}
								hoverBackgroundColor={theme.colors.danger_200}
								percentUnit={false}
								fontSize={theme.text.fontSize.fm}
								value={modal.path.length ? t('common:common_text_previous').toString() : t('common:common_text_ok').toString()}
								onClick={() => (!modal.path.length ? actionsModal.closeModal() : actionsModal.closeModalRedirect())}
							/>
						</ButtonWrapper>
					</Modals>
					<ToastSuccess />
					<GridLayout>
						<LayoutLogoWrapper>
							<Image src={GCALogo} width="140" height="48" alt="gca-logo" />
						</LayoutLogoWrapper>
						<HeaderWrapper>
							<PageTitle>{routerParams?.titleTranslation && t(routerParams?.titleTranslation)}</PageTitle>
							{/* TODO : To change after we got currentuser informations */}
							<HeaderUserInfos>{'testprenom TESTNOM (testrole)'}</HeaderUserInfos>
							<Image
								src={IconLogout}
								alt="gca-logout"
								width="18"
								height="20"
								onClick={() => {
									router.replace(uriList.login)
									actionsLogin.getLogout('user')
								}}
							/>
						</HeaderWrapper>
						<Menu />
						<LayoutPageWrapper>{children}</LayoutPageWrapper>
					</GridLayout>
				</Fragment>
			}
		</>
	)
}

export default Layout
