import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {logOut} from '../services/AuthenticationAPI';
import DrawerProfileContent from './DrawerProfileContent';
import {useTranslation} from 'react-i18next';
import {bold, regular, semiBold} from '../styles/fonts';
import {useTheme} from '@react-navigation/native';
import {AuthContext} from './AuthContext';
import {BaseURL} from '../services/constants';

const DrawerContent = (props: any) => {
  const [imageLoader, setImageLoader] = useState(false);
  const {t, i18n} = useTranslation();
  const [image, setImage] = useState(require('../assets/images/logo-text.png'));
  const {info, setInfo, token, setToken}: any = useContext(AuthContext);

  const theme: any = useTheme();

  const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      borderTopColor: theme.colors.border,
      borderTopWidth: 0.5,
    },

    drawerItemLabel: {
      flex: 1,
      fontSize: 18,
      color: theme.colors.surfaceText,
      fontFamily: regular,
      marginLeft: '1%',
    },
    drawerItem: {
      flex: 1,
      padding: 15,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 0.5,
      backgroundColor: '#FFF',
    },
    container: {flex: 1, backgroundColor: theme.colors.surface},
  });

  const setLanguage = (code: any) => {
    return i18n.changeLanguage(code);
  };

  useEffect(() => {
    if (info?.municipality?.logo) {
      setImage({
        uri:
          BaseURL +
          '/public/municipality/image/' +
          info.municipality._id +
          '?updatedAt=' +
          info?.updatedAt,
      });
    }
  }, [info]);

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 100,
            alignItems: 'flex-end',
            marginHorizontal: '2%',
            marginVertical: '1%',
          }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.toggleDrawer();
            }}>
            <Icon
              name="close-circle-outline"
              size={35}
              style={{padding: 4}}
              color={theme.colors.icon}
            />
          </TouchableOpacity>
        </View>
        <DrawerProfileContent />
        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
            <TouchableOpacity
              style={[
                styles.drawerItem,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: getActiveRouteState(
                    props.state.routes,
                    props.state.index,
                    'ProfileSettings',
                  )
                    ? '#819ECE'
                    : theme.colors.surface,
                },
              ]}
              onPress={() => {
                props.navigation.navigate('ProfileSettings');
              }}>
              <Text style={styles.drawerItemLabel}>{t('drawer:profile')}</Text>
              <View style={{alignItems: 'center', flex: 0.25}}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={'chevron-right'}
                  size={30}
                  color="#A6AEBC"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.drawerItem,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: getActiveRouteState(
                    props.state.routes,
                    props.state.index,
                    'EmergencyContact',
                  )
                    ? '#819ECE'
                    : theme.colors.surface,
                },
              ]}
              onPress={() => {
                props.navigation.navigate('EmergencyContact');
              }}>
              <Text style={styles.drawerItemLabel}>
                {t('drawer:personalemergencycontacts')}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flex: 0.25,
                }}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={'chevron-right'}
                  size={30}
                  color="#A6AEBC"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.drawerItem,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: getActiveRouteState(
                    props.state.routes,
                    props.state.index,
                    'Settings',
                  )
                    ? '#819ECE'
                    : theme.colors.surface,
                },
              ]}
              onPress={() => {
                props.navigation.navigate('Settings');
              }}>
              <Text style={styles.drawerItemLabel}>
                {t('drawer:generalSettings')}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flex: 0.25,
                }}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8, flex: 0.25}}
                  name={'chevron-right'}
                  size={30}
                  color="#A6AEBC"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.drawerItem,
                {backgroundColor: theme.colors.surface},
              ]}
              onPress={() => {
                logOut(props.navigation, setLanguage);
              }}>
              <Text
                style={[
                  styles.drawerItemLabel,
                  {paddingTop: 8, paddingBottom: 8},
                ]}>
                {t('drawer:logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '5%',
          }}>
          <Image style={{height:  Dimensions.get('screen').height < 700 ?110:120, width: Dimensions.get('screen').height < 700 ? 110:120}} source={image} />
          {/* 
          <Text
            style={{
              fontSize: 16,
              fontFamily: regular,
              textAlign: 'center',
              width: '80%',
              color: 'black',
            }}>
            {t('drawer:title')}
          </Text> */}
        </View>
      </View>
    </>
  );
};

const getActiveRouteState = function (routes: any, index: any, name: any) {
  return routes[index].name === name;
};

export default DrawerContent;
