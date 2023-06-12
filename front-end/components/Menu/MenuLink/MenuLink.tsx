////////LIBRARY/////////
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Transition } from 'react-transition-group'
import { map, isEmpty, isUndefined } from 'lodash'
import { FC } from 'react'
///////COMPONENTS///////
//import UserAuthorizationLayout from '../../../../components/UserAuthorizationLayout'
import theme from '../../../theme/theme'
import { useRouter } from 'next/router'
/////////ASSETS/////////
import DropIcon from '../../../assets/icones/menu/menu-open-close.svg'

/////////STYLED/////////
const MenuLinkWrapper = styled.div`
	display: flex;
	flex-direction: row;
	background-color: ${(props: MenuLinkWrapperProps) => (props.isCurrentLink ? theme.colors.menu_dark : theme.colors.light_500)};
	overflow: hidden;
	&:hover {
		background-color: ${theme.colors.menu_dark};
	}
`
const LinkWrapper = styled(Link)`
	width: 100%;
	text-decoration: none;
	cursor: pointer;
	${(props: LinkWrapperProps) => (props.isCurrentLink ? `& > div div {color: ${theme.colors.primary_200}}` : '')}
	&:hover > div div {
		color: ${theme.colors.primary_500};
	}
`
const LinkWrapperDiv = styled.div`
	width: 100%;
	text-decoration: none;
	${(props: LinkWrapperProps) => (props.isCurrentLink ? `& > div > div {color: ${theme.colors.primary_200}}` : '')}
	&:hover > div > div {
		color: ${theme.colors.primary_500};
	}
`
const MenuText = styled.div`
	overflow: hidden;
	font-size: ${theme.text.fontSize.fs};
	color: ${theme.colors.dark_100};
	display: inline-block;
`
const MenuNested = styled.div`
	display: block;
	max-height: ${(props: MenuNestedProps) =>
		({ transitionstate }: any) => {
			switch (transitionstate) {
				case 'entering':
					return '0px'
				case 'entered':
					return `${props.itemsNumber * 55}px`
				case 'exiting':
					return '0px'
				case 'exited':
					return '0px'
				default:
					return null
			}
		}};
	transition: all 0.1s;
`
const MenuNestedLink = styled(Link)`
	text-decoration: none;
`
const NestedMenuText = styled.div`
	overflow: hidden;
	display: flex;
	align-items: center;
	font-size: ${theme.text.fontSize.fs};
	color: ${(props: NestedMenuTextProps) => (props.isCurrentLink ? theme.colors.primary_200 : theme.colors.secondary_100)};
`
const MenuIcon = styled.div`
	width: 55px;
	height: 55px;
	background-image: url('${(props: MenuIconProps) => props.src}');
	background-position: center;
	cursor: pointer;
	background-repeat: no-repeat;
	display: inline-block;
`
const DropMenu = styled.img`
	max-height: 15px;
	max-width: 15px;
`
const MenuWrapper = styled.div`
	display: grid;
	grid-template-columns: min-content 1fr min-content;
	align-items: center;
	column-gap: 5px;
	grid-template-rows: 55px;
	position: relative;
	${(props: MenuWrapperProps) =>
		props.isToggleNested
			? `
			background-color: ${theme.colors.menu_dark};
			& > div+div {
				color: ${theme.colors.secondary_100};
			};
			::before {
				content: '';
				height: 100%;
				width: 5px;
				background-color: ${theme.colors.primary_200};
				position: absolute;
				top: 0px;
			}`
			: ''}
`
const NestedLinkWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	align-items: center;
	padding: 5px 5px 5px 60px;
	background-color: ${theme.colors.menu_dark};
	box-sizing: border-box;
	min-height: 55px;
	transition: background-color 0.1s;
	:hover > div {
		color: ${theme.colors.primary_500};
	}
`
const DropImgWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	transform: rotate(${(props: DropImgWrapperProps) => (props.isToggleNested ? 0 : 180)}deg);
	margin-right: 15px;
`
/////////STYLED/////////

/////////TYPES//////////
type MenuLinkWrapperProps = {
	isCurrentLink: boolean | undefined
}
type LinkWrapperProps = {
	isCurrentLink: boolean | undefined
}
type NestedMenuTextProps = {
	isCurrentLink: boolean | undefined
}
type MenuLinkProps = {
	text?: string
	icon?: any
	nested: boolean
	specAction?: any
	specActionIcon?: any
	subMenus?: any
	toggledNested?: any
	handleSetToggledNested?: any
	menuId?: number
	isCurrentLink?: boolean | undefined
	link?: string
}
type MenuIconProps = {
	src: string | undefined
}
type MenuWrapperProps = {
	isToggleNested: boolean
}
type DropImgWrapperProps = {
	isToggleNested: boolean
}
type MenuNestedProps = {
	itemsNumber: number
	transitionstate: string
}
/////////TYPES//////////

const MenuLink: FC<MenuLinkProps> = ({
	text,
	icon,
	nested,
	specAction,
	specActionIcon,
	subMenus,
	toggledNested,
	handleSetToggledNested,
	menuId,
	isCurrentLink,
	link,
}) => {
	const router = useRouter()
	const isMenuLinkToggled = !isEmpty(toggledNested) ? toggledNested.toggle : false

	///////////////////////////////// HANDLE ///////////////////////////////////////

	// Used to check if we need to render a div (with nested links) or an 'a' tag for direct link
	const linkRender = (children: any): JSX.Element => {
		return isEmpty(subMenus) ? (
			<LinkWrapper
				isCurrentLink={isCurrentLink}
				href={link}
				onClick={() => {
					nested && handleSetToggledNested(menuId)
				}}
			>
				{children}
			</LinkWrapper>
		) : (
			<LinkWrapperDiv isCurrentLink={isCurrentLink} onClick={() => nested && handleSetToggledNested(menuId)}>
				{children}
			</LinkWrapperDiv>
		)
	}

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<MenuLinkWrapper /*onClick={nested && specAction} */ isCurrentLink={isCurrentLink}>
			{linkRender(
				<>
					<MenuWrapper isToggleNested={isMenuLinkToggled}>
						<MenuIcon onClick={specActionIcon} src={icon}></MenuIcon>
						<MenuText>{text}</MenuText>
						{nested && (
							<DropImgWrapper isToggleNested={isMenuLinkToggled}>
								<DropMenu src={DropIcon} alt="" />
							</DropImgWrapper>
						)}
					</MenuWrapper>
					{nested && (
						<Transition
							in={nested && isMenuLinkToggled}
							timeout={{
								appear: 0,
								enter: 0,
								exit: 300,
							}}
							mountOnEnter
							unmountOnExit
						>
							{(state: any) => (
								<MenuNested itemsNumber={subMenus.length} transitionstate={state}>
									{map(subMenus, (elem) => (
										// <UserAuthorizationLayout name={elem.requiredRight}>
										<MenuNestedLink href={elem.link}>
											<NestedLinkWrapper>
												<NestedMenuText
													isCurrentLink={
														(!isUndefined(elem.link) && router.pathname.includes(elem.link)) ||
														elem.link === router.pathname
													}
												>
													{elem.title}
												</NestedMenuText>
											</NestedLinkWrapper>
										</MenuNestedLink>
										// </UserAuthorizationLayout>
									))}
								</MenuNested>
							)}
						</Transition>
					)}
				</>
			)}
		</MenuLinkWrapper>
	)
}

export default MenuLink
