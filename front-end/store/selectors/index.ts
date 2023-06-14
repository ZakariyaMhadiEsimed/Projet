////////LIBRARY/////////
import { createSelector } from 'reselect'

const isSetupSelector = (state: any) => state.app.isSetup

export const getIsSetup = createSelector(isSetupSelector, (isSetup) => isSetup)
