////////LIBRARY/////////
import { createGlobalStyle } from 'styled-components'
///////COMPONENTS///////
import theme from './theme'

const GlobalStyle = createGlobalStyle`
    *{color: ${theme.colors.dark_100};font-size: ${theme.text.fontSize.fs};}
`

export default GlobalStyle
