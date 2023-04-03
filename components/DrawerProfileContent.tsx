import React, {useContext, useEffect, useState} from 'react';
import {View, Image, Text, ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import {BaseURL} from '../services/constants';
import {SharedData} from '../services/SharedData';
import {AuthContext} from './AuthContext';
import {bold, regular, semiBold} from '../styles/fonts';
import {useTheme} from '@react-navigation/native';

const DrawerProfileContent = (props: any) => {
  const [imageLoader, setImageLoader] = useState(true);
  const [profile, setProfile]: any = useState(null);

  const {info, setInfo, token, setToken}: any = useContext(AuthContext);

  const theme: any = useTheme();

  const styles = StyleSheet.create({
    name: {
      color: theme.colors.surfaceText,
      fontSize: 22,
      fontFamily: bold,
      textAlign: 'center',
    },
    email: {
      color: theme.colors.surfaceText,
      fontSize: 16,
      fontFamily: regular,
    },
  });

  const [image, setImage] = useState({
    uri:
      BaseURL +
      `/public/user/profile-image/${SharedData.UserInfo._id}` +
      '?' +
      new Date(),
  });

  useEffect(() => {
    setImage({
      uri:
        BaseURL +
        `/public/user/profile-image/${SharedData.UserInfo._id}` +
        '?' +
        new Date(),
    });
    if (info) {
      setProfile(info);
    }
  }, [info]);

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          marginBottom: Dimensions.get('screen').height < 700 ? '2%' : '5%',
          marginHorizontal: 25,
          marginTop: Dimensions.get('screen').height < 700 ? 25:50
        }}>
        <ActivityIndicator
          style={
            imageLoader
              ? {
                  position: 'absolute',
                  zIndex: 1,
                  borderRadius: 100,
                  backgroundColor: '#FFF',
                  height: Dimensions.get('screen').height < 700 ? 110 : 120,
                  width: Dimensions.get('screen').height < 700 ? 110 : 120,
                  marginVertical: '5%',
                }
              : {display: 'none'}
          }
          color="gray"
          size="large"
        />
        <Image
          style={{
            borderRadius: 100,
            backgroundColor: '#FFF',
            height: Dimensions.get('screen').height < 700 ? 110 : 120,
            width: Dimensions.get('screen').height < 700 ? 110 : 120,
            marginVertical:  Dimensions.get('screen').height < 700 ? "2%":'5%',
          }}
          source={image}
          onLoadEnd={() => {
            setImageLoader(false);
          }}
        />
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>
    </>
  );
};
export default DrawerProfileContent;
