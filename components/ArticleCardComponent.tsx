import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {bold, regular, semiBold} from '../styles/fonts';

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

const ArticleCard = ({navigation, item, index}: any) => {
  const {t} = useTranslation();
  return (
    <View
      style={[
        {
          height: 300,
          width: 300,
          overflow: 'hidden',
          backgroundColor: '#FFF',
          borderRadius: 10,
          marginRight: 20,
        },
        styles.shadow,
      ]}>
      <View style={{flex: 4, overflow: 'hidden'}}>
        <Image
          style={{width: '100%'}}
          source={
            index % 2 === 0
              ? require('../assets/images/mockup-1.png')
              : require('../assets/images/mockup-2.png')
          }
        />
      </View>
      <View style={{flex: 3, marginHorizontal: '5%', justifyContent: 'center'}}>
        <View style={{marginTop: '2%'}}>
          <Text
            style={{
              color: '#4F5867',
              fontSize: 14,
              fontFamily: regular,
            }}
            numberOfLines={5}>
            {item.description}
          </Text>
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '2%',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Article', {item: item});
            }}>
            <Text
              style={{
                color: '#2B6AD4',
                fontSize: 14,
                fontFamily: regular,
              }}>
              Read More
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: '#4F5867',
              fontSize: 14,
              fontFamily: regular,
            }}>
            {moment(item.createdAt).isSame(moment().add(-1, 'days'), 'd')
              ? t('time:yesterday')
              : moment(item.createdAt).isSame(moment(), 'd')
              ? moment(item.createdAt).fromNow()
              : moment(item.createdAt).format('DD/MM/YY')}{' '}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ArticleCard;
