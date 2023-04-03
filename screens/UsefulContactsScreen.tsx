import {useTheme} from '@react-navigation/native';
import React, {useContext, useEffect, useRef} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {showMessage} from 'react-native-flash-message';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/AuthContext';
import Header from '../components/HeaderComponent';
import {usefulContactList} from '../services/UserApi';
import {bold, regular, semiBold} from '../styles/fonts';

const UsefulContactsScreen = ({navigation}: any) => {
  const [usefulContact, setUsefulContact]: any = useState([]);
  const [loader, setLoader] = useState(true);
  const {info, setInfo, token, setToken, unRead, setUnRead}: any =
    useContext(AuthContext);
  const {t, i18n} = useTranslation();
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    mainContainer: {flex: 1, backgroundColor: theme.colors.background},
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontFamily: bold,
    },
    noContenttext: {
      color: theme.colors.text,
      width: '100%',
      textAlign: 'center',
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '4%',
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      paddingVertical: 5,
      minHeight: 80,
      maxWidth: 500,
    },
    contactInitials: {
      fontSize: 20,
      color: '#fff',
      fontFamily: bold,
    },
    contactTitle: {
      color: theme.colors.surfaceText,
      fontFamily: bold,
      fontSize: 16,
    },
    contactText: {
      color: theme.colors.surfaceText,
      fontFamily: regular,
      fontSize: 16,
    },
  });

  useEffect(() => {
    usefulContactList(setUsefulContact, setLoader);
  }, [token]);

  const nameInitials = (item: any) => {
    let title = i18n.language === 'en' ? item.titleEN : item.titleAL;
    if (
      title.split(' ').length > 1 &&
      title.split(' ')[1] !== '' &&
      title.split(' ')[0] !== ''
    ) {
      return (
        title.split(' ')[0][0].toUpperCase() +
        title.split(' ')[1][0].toUpperCase()
      );
    } else {
      return title[0].toUpperCase();
    }
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            width: '100%',
            textAlign: 'center',
          }}>
          No Content to show
        </Text>
      </View>
    );
  };

  const renderItem = (item: any, index: string) => {
    return (
      <View style={{width: '100%', alignItems: 'center'}} key={index}>
        <View style={styles.contactItem}>
          <View style={{flex: 0.5, alignItems: 'center'}}>
            <View
              style={{
                height: 60,
                width: 60,
                alignItems: 'center',
                backgroundColor: '#2A64C7',
                borderRadius: 50,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.contactInitials}>{nameInitials(item)}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.contactTitle}>
              {i18n.language === 'en'
                ? item.titleEN
                : item.titleAL
                ? item.titleAL
                : item.titleEN}
            </Text>
            <Text style={styles.contactText}>{item.contact}</Text>
          </View>
          <View style={{flex: 0.18}}></View>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              backgroundColor: '#2BD486',
              borderRadius: 100,
              marginRight: 15,
              alignItems: 'center',
            }}
            onPress={() => {
              if (item?.contact) Linking.openURL(`tel:${item?.contact}`);
              else {
                showMessage({
                  message: 'No phone number found',
                  type: 'warning',
                  icon: 'danger',
                });
              }
            }}>
            <Icon
              style={{paddingTop: 8, paddingBottom: 8}}
              name={'phone'}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Accordian = ({item, index}: any) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: item?.color ? item.color : '#F0EAD6',
          marginVertical: 5,
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 10,
          maxWidth: 500,
        }}>
        <TouchableOpacity
          onPress={() => {
            setCollapsed(!collapsed);
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: bold,
                marginLeft: '5%',
                flex: 1,
              }}>
              {i18n.language === 'en'
                ? item.nameEN
                : i18n.language === 'al'
                ? item.nameAL
                : i18n.language === 'mk'
                ? item.nameMK
                : i18n.language === 'bg'
                ? item.nameBG
                : item.nameEL}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: semiBold,
                }}>
                {item.contacts.length}
              </Text>
              <Icon
                name={collapsed ? 'menu-down-outline' : 'menu-up-outline'}
                color="black"
                size={40}
                style={{paddingBottom: 2}}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={collapsed} align="center">
          <View style={{marginHorizontal: 10, paddingTop: 20}}>
            {item.contacts.map((contact: any, i: number) => {
              return renderItem(contact, index.toString() + i.toString());
            })}
          </View>
        </Collapsible>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} />
      <View
        style={{
          marginHorizontal: '5%',
          flex: 1,
        }}>
        <Text style={styles.title}>{t('useful:title')}</Text>
        {loader && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={40} color="#2B6AD4" />
          </View>
        )}
        {!loader && usefulContact.length > 0 && (
          <ScrollView>
            {usefulContact.map((category: any, index: number) => {
              return (
                <Accordian
                  item={category}
                  index={index}
                  key={index.toString()}
                />
              );
            })}
          </ScrollView>
        )}
        {!loader && usefulContact.length == 0 && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: bold,
                color: theme.colors.text,
                fontSize: 18,
              }}>
              {t('useful:noContact')}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UsefulContactsScreen;
