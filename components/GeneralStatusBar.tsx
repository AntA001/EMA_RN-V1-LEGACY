import React from 'react';
import {View, StatusBar, StyleSheet, Platform, Dimensions} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const {height, width} = Dimensions.get('window');

export const isIPhoneWithNotch = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width >= X_WIDTH && height >= X_HEIGHT) ||
      (width >= XSMAX_WIDTH && height >= XSMAX_HEIGHT)
    : false;

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios'
    ? isIPhoneWithNotch()
      ? 44
      : 20
    : StatusBar.currentHeight;
let styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

const GeneralStatusBarColor = ({backgroundColor, ...props}: any) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent {...props} />
  </View>
);
export default GeneralStatusBarColor;
