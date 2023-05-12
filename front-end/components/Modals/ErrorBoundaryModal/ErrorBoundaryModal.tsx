////////LIBRARY/////////
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { isUndefined } from 'lodash'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
///////COMPONENTS///////
import StringFormatter from '../../../helpers/StringFormatter'
import { Button, ButtonWrapper, ModalsBodyContainer } from '../../../theme/GlobalCss'
import theme from '../../../theme/theme'
import Modals from '..'
import { RootState } from '../../../interfaces/store/store.interfaces'
import { modalsActionCreators } from '../../../store/actions'

///////INTERFACES///////
interface ErrorBoundaryModalProps {
	error?: any
	resetErrorBoundary?: any
}

///////INTERFACES///////

const ErrorBoundaryModal: FC<ErrorBoundaryModalProps> = (props) => {
	const { modal } = useSelector(
		(state: RootState) => ({
			user: state.user,
			modal: state.modal,
		}),
		shallowEqual
	)
	const { t } = useTranslation()
	const actionsModal = bindActionCreators(modalsActionCreators, useDispatch())

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<Modals
			showModal={modal.show} //modal.show
			closeModalHandler={!modal.path.length ? actionsModal.closeModal : actionsModal.closeModalRedirect}
			headerTitle={t(modal.title).toString()}
			level={modal.level}
			insideModalResponse={modal.insideModalResponse}
		>
			<ModalsBodyContainer>
				<p>
					{StringFormatter.ResponseMessageParser(modal.message ? t(modal.message) : modal.message, modal.errorMsgParams) || modal.message}
				</p>
				{process.env.NEXT_PUBLIC_REACT_APP_TARGET === 'development' && !isUndefined(props.error) && <p>{props.error.message}</p>}
			</ModalsBodyContainer>
			{/*<TextModal>{StringFormatter.ResponseMessageParser(modal.key, modal.errorMsgParams) || modal.key}</TextModal>*/}
			<ButtonWrapper>
				<Button
					id="SubmitButtonModalErrorOK"
					type="button"
					backgroundColor={theme.colors.primary}
					color={theme.colors.white}
					hoverBackgroundColor={theme.colors.primary_hover}
					percentUnit={false}
					fontSize={theme.text.fontSize.fm}
					value={modal.path.length ? t('common:text_previous').toString() : t('common:text_ok').toString()}
					onClick={() => {
						{
							process.env.NEXT_PUBLIC_REACT_APP_TARGET === 'development' &&
								!isUndefined(props.resetErrorBoundary) &&
								props.resetErrorBoundary()
						}
						!modal.path.length ? actionsModal.closeModal() : actionsModal.closeModalRedirect()
					}}
				/>
			</ButtonWrapper>
		</Modals>
	)
}

export default ErrorBoundaryModal
