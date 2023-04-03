import {useTheme} from '@react-navigation/native';
import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/AuthContext';
import {bold, regular, semiBold} from '../styles/fonts';

const getUserCategory = (info: any, languageCode: string) => {
  return languageCode === 'en'
    ? info?.category?.nameEN
    : languageCode === 'mk'
    ? info?.category?.nameMK
    : languageCode === 'bg'
    ? info?.category?.nameBG
    : languageCode === 'el'
    ? info?.category?.nameEL
    : languageCode === 'al'
    ? info?.category?.nameAL
    : info?.category?.nameEN;
};

const SettingsScreen = ({navigation}: any) => {
  const {t, i18n} = useTranslation();
  const {info, setInfo, token, setToken}: any = useContext(AuthContext);
  const selectedLanguageCode: string = i18n.language;
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    shadow: {
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
    settingItem: {
      backgroundColor: theme.colors.surface,
      height: 100,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: '5%',
    },
  });

  return (
    <>
      <View style={{flex: 1, backgroundColor: theme.colors.backgroundColor}}>
        <View style={{marginHorizontal: '5%', flex: 1}}>
          <View>
            <TouchableOpacity
              style={[
                {
                  marginVertical: '3%',
                  backgroundColor: theme.colors.surface,
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                styles.shadow,
              ]}
              onPress={() => {
                navigation.goBack();
              }}>
              {<Icon name="arrow-left" size={25} color={theme.colors.icon} />}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 26,
              fontFamily: bold,
            }}>
            {t('generalSettings:generalSettings')}
          </Text>
          <View style={{marginVertical: '5%'}}>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 0.5,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                },
                styles.shadow,
              ]}
              onPress={() => {
                navigation.navigate('Municipality');
              }}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {t('generalSettings:municipalty')}
                </Text>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {selectedLanguageCode === 'en'
                    ? info?.municipality?.nameEN
                    : info?.municipality?.nameAL !== '-'
                    ? info?.municipality?.nameAL
                    : info?.municipality?.nameEN}
                </Text>
              </View>

              <View style={{alignItems: 'flex-end', flex: 0.25}}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={'chevron-right'}
                  size={30}
                  color={theme.colors.icon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 0.5,
                },
                styles.shadow,
              ]}
              onPress={() => {
                navigation.navigate('UserCategory');
              }}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {t('generalSettings:userCategory')}
                </Text>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {getUserCategory(info, selectedLanguageCode)}
                </Text>
              </View>

              <View style={{alignItems: 'flex-end', flex: 0.25}}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={'chevron-right'}
                  size={30}
                  color={theme.colors.icon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 0.5,
                },
                styles.shadow,
              ]}
              onPress={() => {
                navigation.navigate('LanguageSettings');
              }}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {t('generalSettings:applicationLanguage')}
                </Text>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {selectedLanguageCode === 'en'
                    ? 'English'
                    : selectedLanguageCode === 'el'
                    ? 'ελληνικά'
                    : selectedLanguageCode === 'mk'
                    ? 'македонски'
                    : selectedLanguageCode === 'bg'
                    ? 'български'
                    : 'shqip'}{' '}
                </Text>
              </View>

              <View style={{alignItems: 'flex-end', flex: 0.25}}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={'chevron-right'}
                  size={30}
                  color={theme.colors.icon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                },
                styles.shadow,
              ]}
              onPress={() => {
                navigation.navigate('ThemeSettings');
              }}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {t('generalSettings:theme')}
                </Text>
                <Text
                  style={{
                    color: theme.colors.surfaceText,
                    fontSize: 18,
                    fontFamily: regular,
                  }}>
                  {theme.dark
                    ? t('generalSettings:dark')
                    : t('generalSettings:light')}
                </Text>
              </View>

              <View style={{alignItems: 'flex-end', flex: 0.25}}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={'chevron-right'}
                  size={30}
                  color={theme.colors.icon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;
