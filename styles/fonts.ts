import {Platform} from 'react-native';

export const bold = Platform.OS === 'ios'? 'SFUIDisplay-Bold': 'SF-UI-Display-Bold'  
export const semiBold = Platform.OS === 'ios'? 'SFUIDisplay-Semibold':'SF-UI-Display-Semibold'
export const regular = Platform.OS === 'ios'? 'SFUIDisplay-Regular':'SF-UI-Display-Regular'
export const light = Platform.OS === 'ios'? 'SFUIDisplay-Light':'SF-UI-Display-Light'