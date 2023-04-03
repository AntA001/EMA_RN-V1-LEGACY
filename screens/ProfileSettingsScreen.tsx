import {useIsFocused, useTheme} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/AuthContext';
import ChangeProfileImageModal from '../components/ChangeProfileImageModal';
import {BaseURL} from '../services/constants';
import {SharedData} from '../services/SharedData';
import {updateProflie} from '../services/UserApi';
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

const ProfileSettingsScreen = ({navigation}: any) => {
  const {t, i18n} = useTranslation();
  const [fname, setFName] = useState(SharedData.UserInfo.name);
  const [image, setImage]: any = useState(null);
  const [imageUrl, setImageUrl] = useState({
    uri:
      BaseURL +
      `/public/user/profile-image/${SharedData.UserInfo._id}` +
      '?' +
      new Date(),
  });
  const [changeProfile, setChangeProfile] = useState(false);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(true);
  const {info, setInfo, token, setToken}: any = useContext(AuthContext);
  const theme: any = useTheme();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setImage(null);
      setImageUrl({
        uri:
          BaseURL +
          `/public/user/image/${SharedData.UserInfo._id}` +
          '?' +
          new Date(),
      });
    }
  }, [isFocused]);

  return (
    <>
      <ChangeProfileImageModal
        modalVisible={changeProfile}
        setModalVisible={setChangeProfile}
        setImage={setImage}
      />

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
            {t('profileSettings:profileSettings')}
          </Text>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontFamily: bold,
              marginTop: '5%',
            }}>
            {t('profileSettings:labelName')}
          </Text>

          <View>
            <TextInput
              style={[
                {
                  borderRadius: 10,
                  marginTop: '1%',
                  paddingHorizontal: '5%',
                  color: theme.colors.text,
                  fontSize: 16,
                  backgroundColor: theme.colors.placeholder,
                  fontFamily: regular,
                  height: 50,
                },
                styles.shadow,
              ]}
              placeholder={t('profileSettings:inputplaceHolder')}
              placeholderTextColor={theme.colors.placeholderText}
              value={fname}
              onChangeText={(text: string) => {
                setFName(text);
              }}
            />
          </View>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: '4%',
                backgroundColor: theme.colors.surface,
                borderRadius: 10,
                height: 80,
              },
              styles.shadow,
            ]}
            onPress={() => {
              setChangeProfile(true);
            }}>
            <View style={{flex: 0.5, alignItems: 'center'}}>
              <ActivityIndicator
                style={
                  imageLoader
                    ? {
                        zIndex: 1,
                        position: 'absolute',
                        top: 0,
                        height: 60,
                        width: 60,
                      }
                    : {display: 'none'}
                }
                color="gray"
                size="small"
              />
              <Image
                style={{
                  borderRadius: 100,
                  backgroundColor: '#FFF',
                  height: 60,
                  width: 60,
                  borderWidth: 1,
                  borderColor: 'gray',
                }}
                source={image ? image : imageUrl}
                onLoadEnd={() => {
                  setImageLoader(false);
                }}
              />
            </View>
            <Text
              style={{
                flex: 1,
                color: theme.colors.surfaceText,
                fontFamily: bold,
                fontSize: 16,
              }}>
              {t('profileSettings:changeProfileImage')}
            </Text>
            <View style={{alignItems: 'center', flex: 0.25}}>
              <Icon
                style={{paddingTop: 8, paddingBottom: 8}}
                name={'chevron-right'}
                size={35}
                color={theme.colors.icon}
              />
            </View>
          </TouchableOpacity>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={{
                marginTop: '5%',
                backgroundColor: '#2B6AD4',
                height: 60,
                borderRadius: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: '5%',
                width: '100%',
              }}
              onPress={() => {
                if (!loader) {
                  setLoader(true);
                  updateProflie(
                    fname,
                    image,
                    setLoader,
                    setInfo,
                    setImage,
                    setImageUrl,
                  );
                }
              }}>
              {loader && <ActivityIndicator size={25} color="white" />}
              {!loader && (
                <>
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontSize: 16,
                      color: '#FFFFFF',
                      fontFamily: semiBold,
                    }}>
                    {t('profileSettings:save')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default ProfileSettingsScreen;
