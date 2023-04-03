import {useTheme} from '@react-navigation/native';
import React from 'react';
import {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {bold, regular, semiBold} from '../styles/fonts';

const WelcomeScreen = ({navigation}: any) => {
  const theme: any = useTheme();

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={{flex: 1, backgroundColor: theme.colors.surface}}>
      <View
        style={{flex: 0.75, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={require('../assets/images/welcome.png')} style={Dimensions.get('screen').height < 700 ? {width: 250, height: 250}:{}} />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: '#FFF',
            alignItems: 'center',
            justifyContent: 'center',
            height: 120,
            width: 120,
            marginTop: Dimensions.get('screen').height < 700 ? 40 : 20
          }}>
          <Image
            style={{
              height: 80,
              width: 80,
            }}
            source={require('../assets/images/logo-new.png')}
          />
        </View>

        <Text
          style={{
            marginTop: '5%',
            fontSize: 18,
            fontFamily: regular,
            color: '#FFF',
          }}>
          Welcome to,
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: bold,
            textAlign: 'center',
            color: '#FFF',
            marginHorizontal: 10,
          }}>
          Emergency Management Application
        </Text>
        <View>
          <TouchableOpacity
            style={{
              marginTop: '5%',
              backgroundColor: '#FFFFFF',
              height: 60,
              borderRadius: 10,
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: '5%',
              width: 200,
            }}
            onPress={() => {
              navigation.navigate('Phone');
            }}>
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: '#2B6AD4',
                fontSize: 16,
                fontFamily: semiBold,
              }}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;
