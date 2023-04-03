import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Linking,
  RefreshControl,
  AppState,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArticleCardVertical from '../components/ArticleCardVerticalComponent';
import { AuthContext } from '../components/AuthContext';
import Header from '../components/HeaderComponent';
import { BaseURL } from '../services/constants';
import { emergencyHomeContactList, NewsList } from '../services/UserApi';
import { bold, regular, semiBold } from '../styles/fonts';
import { useTheme } from '@react-navigation/native';

const CustomImage = memo(function CustomImage({ item, setImageLoader }: any) {
  return (
    <Image
      style={{
        backgroundColor: '#FFF',
        height: '100%',
        width: 180,
      }}
      source={{
        uri:
          BaseURL +
          `/public/emergency-contacts/image/${item._id}?${new Date()}`,
      }}
      onLoadEnd={() => {
        setImageLoader(false);
      }}
    />
  );
});

const ContactCard = ({ item }: any) => {
  const [imageLoader, setImageLoader] = useState(true);
  const { t, i18n } = useTranslation();
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    cardContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      position: 'relative',
      borderRadius: 10,
      height: 140,
      width: 180,
      marginRight: 15,
      overflow: 'hidden',
    },
    text: {
      color: theme.colors.surfaceText,
      fontFamily: regular,
      fontSize: 14,
    },
  });

  useEffect(() => {
    if (!imageLoader) {
      setImageLoader(true);
    }
  }, [item]);

  const selectedLanguageCode = i18n.language;

  return (
    <View style={styles.cardContainer}>
      <View>
        <View style={{ flex: 1 }}>
          <ActivityIndicator
            style={
              imageLoader
                ? {
                  zIndex: 1,
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  width: 180,
                }
                : { display: 'none' }
            }
            color="gray"
            size="large"
          />
          <CustomImage item={item} setImageLoader={setImageLoader} />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: '3%',
          }}>
          <Text
            style={{
              color: '#2A64C7',
              fontFamily: bold,
              fontSize: 16,
            }}>
            {selectedLanguageCode === 'en'
              ? item.titleEN
              : item.titleAL
                ? item.titleAL
                : item.titleEN}
          </Text>
          <Text style={styles.text}>{item.contact}</Text>
        </View>
      </View>

      <View style={{ position: 'absolute', right: 8, top: 8 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2BD486',
            borderRadius: 100,
            height: 28,
            width: 28,
            alignItems: 'center',
            justifyContent: 'center',
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
          <Icon name={'phone'} size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }: any) => {
  const [newsList, setNewsList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [contactLoader, setContactLoader] = useState(true);
  const { info, setInfo, token, setToken, unRead, setUnRead }: any =
    useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const appState = useRef(AppState.currentState);
  const selectedLanguageCode = i18n.language;

  const theme: any = useTheme();

  const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.colors.background },
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontFamily: bold,
    },
    text: {
      fontFamily: bold,
      color: theme.colors.text,
      fontSize: 18,
    },
  });

  let retrieveData = async () => {
    try {
      const usertoken = await AsyncStorage.getItem('usertoken');
      const userinfo = await AsyncStorage.getItem('userinfo');
      const permission = await AsyncStorage.getItem('permission');
      console.log("Dashboard check permission status", permission)
      if (usertoken !== null && userinfo != null) {
        setToken(usertoken);
        setInfo(JSON.parse(userinfo));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  useEffect(() => {
    emergencyHomeContactList(setContactList, setContactLoader);
    NewsList(setNewsList, setLoader);
  }, [token]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setNewsList([]);
        setContactList([]);
        NewsList(setNewsList, setLoader);
        emergencyHomeContactList(setContactList, setContactLoader);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const renderItem = ({ item, index }: any) => {
    return (
      <ArticleCardVertical
        index={index}
        item={item}
        navigation={navigation}
        type={'News'}
      />
    );
  };

  const renderCard = ({ item, index }: any) => {
    return <ContactCard item={item} />;
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <Header navigation={navigation} />
        <View style={{ marginHorizontal: '5%' }}>
          <Text style={styles.title}>
            {selectedLanguageCode === 'en'
              ? info?.municipality.nameEN
              : info?.municipality.nameAL != '-'
                ? info?.municipality.nameAL
                : info?.municipality.nameEN}
          </Text>
        </View>
        <View style={{ marginLeft: '5%', marginTop: '5%' }}>
          {contactLoader && contactList.length == 0 && (
            <View
              style={{
                height: 140,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#2B6AD4" />
            </View>
          )}
          {!contactLoader && contactList.length == 0 && (
            <View
              style={{
                height: 140,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.text}>{t('home:noContact')}</Text>
            </View>
          )}
          {contactList.length > 0 && (
            <FlatList
              refreshControl={
                <RefreshControl
                  colors={['#2B6AD4']}
                  refreshing={contactLoader}
                  onRefresh={() => {
                    emergencyHomeContactList(setContactList, setContactLoader);
                  }}
                />
              }
              data={contactList}
              renderItem={renderCard}
              horizontal={true}
              keyExtractor={(item: any, index: number) => String(index)}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        {loader && newsList.length == 0 && (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2B6AD4" />
          </View>
        )}
        {!loader && newsList.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>{t('home:noNews')}</Text>
          </View>
        )}
        {newsList.length > 0 && (
          <FlatList
            refreshControl={
              <RefreshControl
                colors={['#2B6AD4']}
                refreshing={loader}
                onRefresh={() => {
                  NewsList(setNewsList, setLoader);
                }}
              />
            }
            data={newsList}
            renderItem={renderItem}
            keyExtractor={(item: any, index: number) => String(index)}
            style={{ marginHorizontal: '5%', marginTop: '5%' }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
