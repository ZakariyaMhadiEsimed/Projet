////////LIBRARY/////////
import React, { useState, useRef, useEffect, MutableRefObject, FC } from 'react'
import styled from 'styled-components'
import { shallowEqual, useSelector } from 'react-redux'
import {map, find, cloneDeep, filter, isUndefined, isEmpty} from 'lodash'
import { useTranslation } from 'react-i18next'
///////COMPONENTS///////
import MenuLink from './MenuLink'
import { uriList } from '../../constants/RouteList'
//import UserAuthorizationLayout from '../../../components/UserAuthorizationLayout'
import { userPrivileges } from '../../constants/PrivilegesList'
import { useRouter } from 'next/router'
import theme from '../../theme/theme'
import { RootState } from '../../interfaces/store/store.interfaces'
/////////ASSETS/////////
/*import MenuLogoIcon from '../../../assets/icones/menu/burger-menu-icon.svg'
import MenuCarouselBottomIcon from '../../../assets/icones/menu/menu-dropdown.svg'*/
import IconHome from '../../assets/icones/menu/home.svg'
import IconInventory from '../../assets/icones/menu/inventory.svg'
import IconStocks from '../../assets/icones/menu/stocks.svg'
import IconTracking from '../../assets/icones/menu/tracking.svg'
import IconUsers from '../../assets/icones/menu/users.svg'


/////////STYLED/////////
const MenuCarousel = styled.div`
	height: calc(100% - 316px);
	overflow-y: auto;
	overflow-x: hidden;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		width: 0px;
		background: transparent;
		display: none;
	}
	&::-webkit-scrollbar-thumb {
		background: #ff0000;
	}
`
/*const MenuCarouselBottom = styled.div`
	height: 50px;
	background-color: #242424;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url('${MenuCarouselBottomIcon}');
`*/
const MenuWrapper = styled.div`
	user-select: none;
	display: flex;
	flex-direction: column;
	width: ${
		/*({ menuTransition }: MenuWrapperProps) => {
		switch (menuTransition) {
			case 'entering':
				return '50px'
			case 'entered':
				return '200px'
			case 'exiting':
				return '200px'
			case 'exited':
				return '50px'
			default:
				return '50px'
		}
	}*/ '315px'
	};
	height: calc(100vh - 80px);
	background-color: ${theme.colors.menu_light};
	overflow-x: hidden;
	transition: all 0.1s;
`
/////////STYLED/////////

/////////TYPES//////////
type ConfigMenuItemType = {
	id: number
	title?: string
	link?: string
	icon?: any
	nested?: boolean
	subMenus?: Array<ConfigSubMenuItemType>
	toggle?: boolean
	active?: boolean
	requiredRight?: Number
}
type ConfigSubMenuItemType = {
	title: string
	link: string
	requiredRight: Number
	active?: boolean
}
/////////TYPES//////////

const Menu: FC = () => {

	const { user , privileges } = useSelector(
		(state: RootState) => ({
			user: state.user,
			privileges: state.user.identity.privileges,
		}),
		shallowEqual
	)
	// Menu Behaviour
	const [currentMenu, setCurrentMenu] = useState<Array<ConfigMenuItemType>>([])
	const [toggled, setToggled] = useState(false)
	const [toggledAll, setToggledAll] = useState(false)
	const [toggledNested, setToggledNested] = useState<Array<ConfigMenuItemType>>([])
	const router = useRouter()
	const { t } = useTranslation()
	const wrapperRef = useRef(null)

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleSetToggledNested = (id: number | string): void => {
		const nestedList = cloneDeep(toggledNested)
		nestedList.forEach((elem) => {
			if (elem.id === id) {
				elem.toggle = !elem.toggle
			} else if (toggledAll) {
				setToggledAll(!toggledAll)
			} else {
				elem.toggle = false
			}
		})
		setToggledNested(nestedList)
	}

	function useOutsideAlerter(ref: MutableRefObject<any>): void {
		useEffect(() => {
			function handleClickOutside(event: any): void {
				if (ref.current && !ref.current.contains(event.target)) {
					setToggled(false)
				}
			}
			// Bind the event listener
			document.addEventListener('mousedown', handleClickOutside)
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}, [ref])
	}

	useOutsideAlerter(wrapperRef)

	///////////////////////////////// CONFIG ///////////////////////////////////////

	const configMenu: Array<ConfigMenuItemType> = [
		{
			id: 1,
			title: t('common:menu_dashboard').toString(),
			link: uriList.home,
			icon: IconHome,
			nested: false,
			subMenus: [],
		},
		{
			id: 2,
			title: t('common:menu_users').toString(),
			link: uriList.users,
			icon: IconUsers,
			nested: false,
			subMenus: [],
			requiredRight: userPrivileges?.USERS_MANAGE_VIEW_MENU,
		},
		{
			id: 3,
			title: t('common:menu_stocks').toString(),
			icon: IconStocks,
			nested: true,
			subMenus: [
				{
					title: t('common:menu_stocks__clinic'),
					link: `${uriList.stocks}${uriList.clinicStocks}`,
					requiredRight: 1 /*userPrivileges?.STOCK_MANAGE_TRACKING_CLIENT_VIEW_MENU*/,
				},
				{
					title: t('common:menu_stocks__GCA'),
					link: `${uriList.stocks}${uriList.GCAStocks}`,
					requiredRight: userPrivileges?.STOCK_MANAGE_TRACKING_GCA_VIEW_MENU,
				},
				{
					title: t('common:menu_stocks__inventory_tracking'),
					link: `${uriList.stocks}${uriList.inventoryTracking}`,
					requiredRight: 1 /*userPrivileges?.CLIENT_INVENTORY_VIEW_MENU*/,
				},
			],
		},
		{
			id: 4,
			title: t('common:menu_tracking').toString(),
			icon: IconTracking,
			nested: true,
			subMenus: [
				{
					title: t('common:menu_tracking__return_tracking'),
					link: `${uriList.tracking}${uriList.returnTracking}`,
					requiredRight: userPrivileges?.RETURN_TRACKING_VIEW_MENU
				},
				{
					title: t('common:menu_tracking__pose_tracking'),
					link: `${uriList.tracking}${uriList.poseTracking}`,
					requiredRight: userPrivileges?.POSE_TRACKING_VIEW_MENU,
				},
			],
		},
		{
			id: 5,
			title: t('common:menu_inventory_app').toString(),
			icon: IconInventory,
			link: '',
			nested: false,
		},
	]

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (toggled) return

		handleSetToggledNested('reset')
	}, [toggled])

/*	useEffect(() => {
		const nestedMenu: Array<ConfigMenuItemType> = configMenu.filter(elem => elem.nested )
		setToggledNested(
			map(nestedMenu, (elem) => {
				return { id: elem.id, toggle: false }
			})
		)
		setCurrentMenu(configMenu)
	}, [])*/

	// We want to show the current navigation on menu
	useEffect(() => {
		const nestedMenu: Array<ConfigMenuItemType> = configMenu.filter(elem => elem.nested )
		setToggledNested(
			map(nestedMenu, (elem) => {
				let toggledMenu = false
				elem.subMenus?.forEach((subMenu) => {
					if (router.pathname === subMenu.link/* || router.pathname.includes(subMenu.link)*/) {
						toggledMenu = true
					}
				})
				return { id: elem.id, toggle: toggledMenu }
			})
		)
		//setCurrentMenu(configMenu)
	}, [router.pathname])

	// When user infos are loaded, check what is shown to user
	// Here we map all menu and subMenu to check if user have privileges to see them
	// We assign the result to active's attribute on a boolean
	useEffect(() => {
		if (!isEmpty(privileges)) {

			const cur_menu = cloneDeep(configMenu)
			map(cur_menu, (menuItem) => {
				if(!isEmpty(menuItem.subMenus)) {
					map(menuItem.subMenus, (subMenuItem) => {
						subMenuItem.active = !isUndefined(privileges.find((privilege: any) => privilege == subMenuItem.requiredRight))
					})
				}
				menuItem.active = !isUndefined(privileges.find((privilege: any) => privilege == menuItem.requiredRight)) || isUndefined(menuItem.requiredRight)
			})
			setCurrentMenu(cur_menu)
		}
	}, [user])

	///////////////////////////////// RENDER ///////////////////////////////////////
	
	return (
		<MenuWrapper ref={wrapperRef}>
			<MenuCarousel>
				{map(currentMenu, (elem, id) => {
					return elem.active ? (
						elem.nested ? (
							<MenuLink
								key={id}
								menuId={elem.id}
								specActionIcon={() =>
									// Even if toggled, we need to return something.
									// Otherwise, we cannot toggle menu at first click.
									toggled ? null : setToggled(!toggled)
								}
								text={elem.title}
								icon={elem.icon}
								nested={elem.nested}
								//canToggle={toggled}
								subMenus={elem.subMenus}
								handleSetToggledNested={handleSetToggledNested}
								toggledNested={find(toggledNested, { id: elem.id }) ?? []}
							/>
						) : (
							<MenuLink
								key={id}
								text={elem.title}
								icon={elem.icon}
								//specAction={() => !isUndefined(elem.link) && router.push(elem.link)}
								nested={false}
								isCurrentLink={elem.link === router.pathname}
								link={elem.link}
							/>
						)
					) : null
				})}
			</MenuCarousel>
		</MenuWrapper>
	)
}

Menu.propTypes = {}

export default Menu
