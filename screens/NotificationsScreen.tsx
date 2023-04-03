import moment from 'moment';
import React, {useCallback, useEffect, useRef} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {notifications} from '../services/UserApi';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {bold, regular, semiBold} from '../styles/fonts';
import {SosAlertType} from '../constants/SosAlertType';

const NotificatonCard = ({
  item,
  index,
  navigation,
  setNotificationView,
}: any) => {
  const [readMore, setReadMore] = useState(false);
  const [numLines, setNumLines]: any = useState(undefined);
  const theme: any = useTheme();
  const onTextLayout = useCallback(e => {
    if (e.nativeEvent.lines.length >= 4) {
      setReadMore(true);
      setNumLines(4);
    }
  }, []);

  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '4%',
        backgroundColor: item?.sosAlert
          ? item.sosAlert?.type === SosAlertType.test
            ? '#4AD6E0'
            : item.sosAlert?.type === SosAlertType.fire
            ? '#FF0000'
            : item.sosAlert?.type === SosAlertType.police
            ? '#7E97E1'
            : item.sosAlert?.type === SosAlertType.health
            ? '#D3D3D3'
            : '#FF7F7F'
          : theme.colors.surface,
        borderRadius: 10,
        paddingVertical: '5%',
      }}
      key={`${index}_${new Date()}`}>
      <View style={{flex: 1, marginHorizontal: '5%'}}>
        <View style={{flexDirection: 'row', marginBottom: '1%'}}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                color: item?.sosAlert ? '#172C4F' : theme.colors.surfaceText,
                fontFamily: bold,
                fontSize: 16,
              }}>
              {item?.broadcastMessage
                ? item?.broadcastMessage?.title
                : item?.sosAlert?.type
                ? item.sosAlert.type.charAt(0).toUpperCase() +
                  item.sosAlert.type.slice(1) +
                  ' ' +
                  item?.sosAlertMsg
                : item?.sosAlertMsg}
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: 'flex-end',
              marginTop: '-4%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: regular,
                color: item?.sosAlert ? '#172C4F' : theme.colors.surfaceText,
              }}>
              {moment(item.createdAt).isSame(moment().add(-1, 'days'), 'd')
                ? t('time:yesterday')
                : moment(item.createdAt).isSame(moment(), 'd')
                ? moment(item.createdAt).fromNow()
                : moment(item.createdAt).format('DD/MM/YY')}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            {item?.broadcastMessage && (
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  onTextLayout={onTextLayout}
                  style={{
                    color: theme.colors.surfaceText,
                    backgroundColor: theme.colors.surface,
                    fontFamily: regular,
                    fontSize: 16,
                    alignItems: 'center',
                  }}
                  numberOfLines={numLines}>
                  {item?.broadcastMessage?.message}
                </Text>
                {readMore && (
                  <TouchableOpacity
                    onPress={() => {
                      setNotificationView(true);
                      navigation.navigate('Notification', {item});
                    }}>
                    <Text
                      style={{
                        color: theme.colors.surfaceText,
                        fontSize: 14,
                        fontFamily: regular,
                      }}>
                      {t('articleCard:readmore')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {item?.sosAlert && (
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={{
                    color: '#0044CC',
                    fontFamily: regular,
                    fontSize: 16,
                    alignItems: 'center',
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => {
                    const scheme = Platform.select({
                      ios: 'maps:0,0?q=',
                      android: 'geo:0,0?q=',
                    });
                    const latLng = `${item.sosAlert.lat},${item.sosAlert.lng}`;
                    const label = '';
                    const url: any = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`,
                    });
                    Linking.openURL(url);
                  }}>
                  {t('notifications:showMapAndLoc')}
                </Text>
              </View>
            )}
          </View>
          {item.municipality?.nameEN && (
            <View style={{alignContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text
                style={{
                  color: item?.sosAlert ? '#172C4F' : theme.colors.surfaceText,
                  fontSize: 12,
                  fontFamily: bold,
                }}>
                {selectedLanguageCode === 'en'
                  ? item.municipality.nameEN
                  : item.municipality.nameAL != '-'
                  ? item.municipality.nameAL
                  : item.municipality.nameEN}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const NotificationsScreen = ({navigation}: any) => {
  const [notificationsList, setNotificationsList]: any = useState([]);
  const [loader, setLoader] = useState(true);
  const [notificationView, setNotificationView] = useState(false);
  const theme: any = useTheme();

  const {t, i18n} = useTranslation();

  let isFocused = useIsFocused();

  const isFocusedRef = useRef(false);

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

  useEffect(() => {
    isFocusedRef.current = isFocused;
    if (isFocused) {
      if (!notificationView) {
        notifications(setNotificationsList, setLoader);
      } else {
        if (notificationView) setNotificationView(false);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage((remoteMessage: any) => {
      if (remoteMessage) {
        setLoader(true);
        if (isFocusedRef.current) {
          notifications(setNotificationsList, setLoader);
        }
      }
    });
    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <>
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
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
            {t('notifications:title')}
          </Text>
          {loader && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#2B6AD4" />
            </View>
          )}
          {!loader && notificationsList.length > 0 && (
            <ScrollView style={{flex: 1}}>
              {notificationsList.length > 0 &&
                notificationsList.map((item: any, index: number) => {
                  if (item.isRead == false) {
                    return (
                      <NotificatonCard
                        item={item}
                        navigation={navigation}
                        index={index}
                        key={`${index}_${new Date()}`}
                        setNotificationView={setNotificationView}
                      />
                    );
                  }
                })}
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 20,
                  fontFamily: bold,
                  marginBottom: '3%',
                }}>
                {t('notifications:older')}
              </Text>
              {notificationsList.length > 0 &&
                notificationsList.map((item: any, index: number) => {
                  {
                    if (item.isRead) {
                      return (
                        <NotificatonCard
                          item={item}
                          navigation={navigation}
                          index={index}
                          key={`${index}_${new Date()}`}
                          setNotificationView={setNotificationView}
                        />
                      );
                    }
                  }
                })}
            </ScrollView>
          )}
          {!loader && notificationsList.length == 0 && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: bold,
                  color: theme.colors.text,
                  fontSize: 18,
                }}>
                {t('notifications:noNotification')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};
export default NotificationsScreen;
