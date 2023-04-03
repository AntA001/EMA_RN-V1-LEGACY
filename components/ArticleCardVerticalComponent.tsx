import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BaseURL} from '../services/constants';
import {bold, regular, semiBold} from '../styles/fonts';

const getImageURL = (url: string) => {
  return BaseURL + url + new Date();
};

const CustomImage = memo(function CustomImage({
  item,
  setImageLoader,
  type,
}: any) {
  return (
    <Image
      style={{width: '100%', height: '100%'}}
      source={{
        uri:
          type === 'News'
            ? getImageURL(`/public/news/image/${item._id}?`)
            : getImageURL(`/public/guide-articles/image/${item._id}?`),
      }}
      onLoadEnd={() => {
        setImageLoader(false);
      }}
    />
  );
});

const ArticleCardVertical = ({navigation, index, item, type}: any) => {
  const [imageLoader, setImageLoader] = useState(true);
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    articleContainer: {
      height: 350,
      width: '100%',
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      marginBottom: 15,
      maxWidth: 500,
    },
    shadow: {
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 5,
    },
    articleDesc: {
      color: theme.colors.surfaceText,
      fontSize: 14,
      fontFamily: regular,
    },
    articleDate: {
      color: theme.colors.surfaceText,
      fontSize: 14,
      fontFamily: regular,
    },
  });

  useEffect(() => {
    if (!imageLoader) {
      setImageLoader(true);
    }
  }, [item]);

  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <TouchableOpacity
        key={index}
        style={[styles.articleContainer, styles.shadow]}
        onPress={() => {
          if (type === 'GuideArticle') {
            navigation.navigate('GuideArticlesDetail', {item: item});
          }
          if (type === 'News') {
            navigation.navigate('NewsDetail', {item: item});
          }
        }}>
        <View style={{flex: 3, overflow: 'hidden'}}>
          <ActivityIndicator
            style={
              imageLoader
                ? {
                    zIndex: 1,
                    position: 'absolute',
                    top: '50%',
                    width: '100%',
                  }
                : {display: 'none'}
            }
            color="gray"
            size="large"
          />
          <CustomImage
            type={type}
            item={item}
            setImageLoader={setImageLoader}
          />
        </View>
        <View
          style={{flex: 3, marginHorizontal: '5%', justifyContent: 'center'}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Text
                style={{
                  fontSize: type === 'News' ? 16 : 18,
                  fontFamily: bold,
                  color: '#2A64C7',
                }}
                numberOfLines={2}>
                {selectedLanguageCode === 'en'
                  ? item.titleEN
                  : selectedLanguageCode === 'el' && type === 'GuideArticle'
                  ? item.titleEL
                  : selectedLanguageCode === 'mk' && type === 'GuideArticle'
                  ? item.titleMK
                  : selectedLanguageCode === 'bg' && type === 'GuideArticle'
                  ? item.titleBG
                  : item.titleAL}
              </Text>
              {type !== 'GuideArticle' &&
                moment(item.updatedAt).isAfter(moment(item.createdAt)) && (
                  <View
                    style={{
                      zIndex: 99,
                      borderRadius: 5,
                      backgroundColor: '#3BAAFC',
                      padding: 2,
                      paddingHorizontal: 6,
                      marginLeft: 5,
                    }}>
                    <Text
                      style={{
                        flexWrap: 'wrap',
                        color: 'white',
                        fontFamily: bold,
                      }}>
                      {t('articleCard:updated')}
                    </Text>
                  </View>
                )}
            </View>
            <Text style={styles.articleDesc} numberOfLines={4}>
              {selectedLanguageCode === 'en'
                ? item.descriptionEN
                : selectedLanguageCode === 'el' && type === 'GuideArticle'
                ? item.descriptionEL
                : selectedLanguageCode === 'mk' && type === 'GuideArticle'
                ? item.descriptionMK
                : selectedLanguageCode === 'bg' && type === 'GuideArticle'
                ? item.descriptionBG
                : item.descriptionAL}
            </Text>
            {!theme.dark && (
              <>
                <View
                  style={{
                    position: 'absolute',
                    bottom: '20%',
                    height: '20%',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                  }}></View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    height: '20%',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}></View>
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '1%',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (type === 'GuideArticle') {
                  navigation.navigate('GuideArticlesDetail', {item: item});
                }
                if (type === 'News') {
                  navigation.navigate('NewsDetail', {item: item});
                }
              }}>
              <Text
                style={{
                  color: '#5185F3',
                  fontSize: 14,
                  fontFamily: regular,
                }}>
                {t('articleCard:readmore')}
              </Text>
            </TouchableOpacity>
            <Text style={styles.articleDate}>
              {moment(
                type === 'GuideArticle' ? item.createdAt : item.updatedAt,
              ).isSame(moment().add(-1, 'days'), 'd')
                ? t('time:yesterday')
                : moment(
                    type === 'GuideArticle' ? item.createdAt : item.updatedAt,
                  ).isSame(moment(), 'd')
                ? moment(
                    type === 'GuideArticle' ? item.createdAt : item.updatedAt,
                  ).fromNow()
                : moment(
                    type === 'GuideArticle' ? item.createdAt : item.updatedAt,
                  ).format('DD/MM/YY')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ArticleCardVertical;
