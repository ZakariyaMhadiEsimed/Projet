////////LIBRARY/////////
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import React, { FC, Suspense } from 'react'
///////COMPONENTS///////
import '../styles/globals.css'
import '../styles/react-datepicker.css'
import { wrapper } from '../store/configureStore'
import { AppProps } from 'next/app'
import ProtectedRoutes from '../routes/ProtectedRoutes'
import GlobalStyle from '../theme/GlobalStyle'
import '../i18n'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorBoundaryModal from '../components/Modals/ErrorBoundaryModal'
import { errorManagerActionCreators } from '../store/actions'
import Loading from '../components/Loading'

const WrappedApp: FC<AppProps> = ({ Component, pageProps, router }) => {

	const actionsError = bindActionCreators(errorManagerActionCreators, useDispatch())

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<GlobalStyle />
			<Suspense fallback={<Loading suspenseMode={true} />}>
				<ErrorBoundary
					onError={(error, componentStack) => {
						actionsError.createError(undefined)
						console.log('boundary error', error.message, componentStack)
					}}
					fallbackRender={(props) => {
						return <ErrorBoundaryModal error={props.error} resetErrorBoundary={props.resetErrorBoundary} />
					}}
				>
					<ProtectedRoutes router={router}>
						<Component {...pageProps} />
					</ProtectedRoutes>
				</ErrorBoundary>
			</Suspense>
		</>
	)
}

export default wrapper.withRedux(WrappedApp)
