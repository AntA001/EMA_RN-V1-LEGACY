import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {bold, regular, semiBold} from '../styles/fonts';
import moment from 'moment';
import 'moment/locale/sq';
import 'moment/locale/el';
import 'moment/locale/mk';
import 'moment/locale/bg';
import {AuthContext} from '../components/AuthContext';
import { useTheme } from '@react-navigation/native';
import { themes } from '../styles/themes';

const LANGUAGES = [{code: 'en', name: 'English'}];

const LanguageSettingsScreen = ({navigation}: any) => {
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const {info}: any = useContext(AuthContext);
  const [languages, setLanguages] = useState(LANGUAGES);
  const theme: any = useTheme();
  
  useEffect(() => {
    let language = info.municipality.country?.nativeLanguage;

    if (language) {
      if (!languages.find(lang => lang.code === language.code)) {
        let temp = [...LANGUAGES, language];
        setLanguages(temp);
      }
    }
  }, [info]);

  const setLanguage = (code: any) => {
    if (code === 'al') {
      moment.locale('sq');
    } else if (code === 'el') {
      moment.locale('el');
    }else if (code === 'mk') {
      moment.locale('mk');
    }else if (code === 'bg') {
      moment.locale('bg');
    } else {
      moment.locale('en');
    }
    return i18n.changeLanguage(code);
  };

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
  });
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.backgroundColor}}>
        <View style={{marginHorizontal: '5%', zIndex: 1}}>
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
            {t('languageSettings:languageTitle')}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontFamily: bold,
              color: theme.colors.text,
              marginTop: '2%',
              marginRight: '6%',
            }}>
            {t('languageSettings:languageSelector')}
          </Text>
          {languages.map(language => {
            const selectedLanguage = language.code === selectedLanguageCode;
            return (
              <TouchableOpacity
                key={language.code}
                disabled={selectedLanguage}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '5%',
                  backgroundColor: theme.colors.surface,
                  borderRadius: 10,
                  height: 60,
                }}
                onPress={() => {
                  setLanguage(language.code);
                }}>
                <Text
                  style={{
                    marginHorizontal: '1%',
                    paddingHorizontal: '2%',
                    color: theme.colors.surfaceText,
                    backgroundColor: theme.colors.surface,
                    width: '85%',
                    fontFamily: regular,
                    fontSize: 16,
                  }}>
                  {language.name}
                </Text>
                {language.code === selectedLanguageCode && (
                  <View style={{alignItems: 'center', width: '10%'}}>
                    <Icon
                      style={{paddingTop: 8, paddingBottom: 8}}
                      name={'check-circle-outline'}
                      size={30}
                      color="#2B6AD4"
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </>
  );
};

export default LanguageSettingsScreen;
