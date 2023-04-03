import moment from 'moment';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BaseURL} from '../services/constants';
// import {bold, regular, semiBold} from '../styles/fonts';

// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import WebView from 'react-native-webview';
import {useTheme} from '@react-navigation/native';

const ArticleScreen = ({route, navigation}: any) => {
  const itemArtcile = route.params.item;
  const [imageLoader, setImageLoader] = useState(true);
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const theme: any = useTheme();

  let html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #F3F8FF"> 
<h2>${
    selectedLanguageCode === 'en'
      ? itemArtcile.titleEN
      : itemArtcile.titleAL
      ? itemArtcile.titleAL
      : itemArtcile.titleEN
  }
         </h2>
  <h3>  ${
    moment(itemArtcile.createdAt).isSame(moment().add(-1, 'days'), 'd')
      ? t('time:yesterday')
      : moment(itemArtcile.createdAt).isSame(moment(), 'd')
      ? moment(itemArtcile.createdAt).fromNow()
      : moment(itemArtcile.createdAt).format('DD/MM/YY')
  }</h3>
<img src="${BaseURL + `/public/news/image/${itemArtcile._id}`}" />
<p>${
    selectedLanguageCode === 'en'
      ? itemArtcile.descriptionEN
      : itemArtcile.descriptionAL
      ? itemArtcile.descriptionAL
      : itemArtcile.descriptionEN
  }</p>
</body>
<script>
var imgs = document.getElementsByTagName("img"); 
for(var i = 0; i < imgs.length; i++ ) {
  document.getElementsByTagName("img")[i].style.maxWidth = "${
    Number(
      Dimensions.get('window').width -
        Dimensions.get('window').width * (12 / 100),
    ).toFixed() + 'px'
  }"
}
</script>
</html>`;

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F8FF'}}>
        <View style={{marginHorizontal: '5%', flex: 1}}>
          <View>
            <TouchableOpacity
              style={{
                zIndex: 100,
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
          <WebView
            originWhitelist={['*']}
            source={{html: html}}
            style={{resizeMode: 'cover', flex: 1}}
            scalesPageToFit={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
export default ArticleScreen;
