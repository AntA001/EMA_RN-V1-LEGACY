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
import {useTheme} from '@react-navigation/native';
import {ThemeContext} from '../components/ThemeContext';

const ThemeSettingsScreen = ({navigation}: any) => {
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const {info}: any = useContext(AuthContext);
  const theme: any = useTheme();

  let {toggleTheme} = useContext(ThemeContext);

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
    backButton: {
      marginVertical: '3%',
      backgroundColor: theme.colors.surface,
      height: 40,
      width: 40,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontFamily: bold,
    },
    desc: {
      fontSize: 18,
      fontFamily: bold,
      color: theme.colors.text,
      marginTop: '2%',
      marginRight: '6%',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '5%',
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      height: 60,
    },
    listItemText: {
      marginHorizontal: '1%',
      paddingHorizontal: '2%',
      color: theme.colors.text,
      width: '85%',
      fontFamily: regular,
      fontSize: 16,
    },
    mainContainer: {flex: 1, backgroundColor: theme.colors.background},
  });
  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <View style={{marginHorizontal: '5%', zIndex: 1}}>
          <View>
            <TouchableOpacity
              style={[styles.backButton, styles.shadow]}
              onPress={() => {
                navigation.goBack();
              }}>
              {<Icon name="arrow-left" size={25} color={theme.colors.icon} />}
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{t('themeSettings:title')}</Text>

          <Text style={styles.desc}>{t('themeSettings:desc')}</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              if (theme.dark) {
                toggleTheme();
              }
            }}>
            <Text style={styles.listItemText}>{t('themeSettings:light')}</Text>
            {!theme.dark && (
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
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              if (!theme.dark) {
                toggleTheme();
              }
            }}>
            <Text style={styles.listItemText}>{t('themeSettings:dark')}</Text>
            {theme.dark && (
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
        </View>
      </SafeAreaView>
    </>
  );
};

export default ThemeSettingsScreen;
