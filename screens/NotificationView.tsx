import moment from 'moment';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {bold, regular, semiBold} from '../styles/fonts';

const NotificationViewScreen = ({route, navigation}: any) => {
  const notificationItem = route.params.item;
  const {t, i18n} = useTranslation();

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F8FF'}}>
        <View style={{marginHorizontal: '5%', flex: 1}}>
          <View>
            <TouchableOpacity
              style={{
                marginTop: '3%',
                backgroundColor: '#FFFFFF',
                height: 40,
                width: 40,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              {<Icon name="arrow-left" size={25} color="#1B2F52" />}
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: '5%',
              }}>
              <Text
                style={{
                  flex: 2,
                  fontSize: 22,
                  fontFamily: bold,
                  color: 'black',
                }}>
                {notificationItem.broadcastMessage.title}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontFamily: semiBold,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {moment(notificationItem.createdAt).isSame(
                  moment().add(-1, 'days'),
                  'd',
                )
                  ? t('time:yesterday')
                  : moment(notificationItem.createdAt).isSame(moment(), 'd')
                  ? moment(notificationItem.createdAt).fromNow()
                  : moment(notificationItem.createdAt).format('DD/MM/YY')}
              </Text>
            </View>
            <Text
              style={{
                color: '#4F5867',
                fontSize: 14,
                marginVertical: '5%',
                fontFamily: regular,
              }}>
              {notificationItem.broadcastMessage.message}
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};
export default NotificationViewScreen;
