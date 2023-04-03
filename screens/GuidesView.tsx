import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';
import {bold, regular, semiBold} from '../styles/fonts';

function LoadingIndicatorView() {
  return <ActivityIndicator color="gray" size="large" />;
}

const GuidesView = ({navigation, route}: any) => {
  const item = route.params.item;

  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;

  let html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #F3F8FF"> 
${
  selectedLanguageCode === 'en'
    ? item.articleEN
    : selectedLanguageCode === 'al'
    ? item.articleAL
    : selectedLanguageCode === 'mk'
    ? item.articleMK
    : selectedLanguageCode === 'bg'
    ? item.articleBG
    : item.articleEL
}
<script>
var imgs = document.getElementsByTagName("img"); 
for(var i = 0; i < imgs.length; i++ ) {
  document.getElementsByTagName("img")[i].style.maxWidth = "310px"
}
</script>
</body>
</html>`;

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
                navigation.navigate('MainGuideArticles');
              }}>
              {<Icon name="arrow-left" size={25} color="#1B2F52" />}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: '5%',
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: bold,
                color: 'black',
                flex: 4,
              }}>
              {selectedLanguageCode === 'en'
                ? item.titleEN
                : selectedLanguageCode === 'al'
                ? item.titleAL
                : selectedLanguageCode === 'mk'
                ? item.titleMK
                : selectedLanguageCode === 'bg'
                ? item.titleBG
                : item.titleEL}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: semiBold,
                color: 'black',
                flex: 1,
                textAlign: 'right',
              }}>
              {moment(item.createdAt).isSame(moment().add(-1, 'days'), 'd')
                ? t('time:yesterday')
                : moment(item.createdAt).isSame(moment(), 'd')
                ? moment(item.createdAt).fromNow()
                : moment(item.createdAt).format('DD/MM/YY')}
            </Text>
          </View>

          <WebView
            originWhitelist={['*']}
            source={{html: html}}
            renderLoading={LoadingIndicatorView}
            // injectedJavaScript={`let imgs = document.getElementsByTagName("img"); for(var i = 0; i < imgs.length; i++ ) {document.getElementsByTagName("img")[i].style.width = "100px"}`}
            style={{resizeMode: 'cover', flex: 1}}
            scalesPageToFit={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default GuidesView;
