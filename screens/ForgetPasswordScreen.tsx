import {useTheme} from '@react-navigation/native';
import React from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ForgetPassword} from '../services/AuthenticationAPI';
import {bold, regular, semiBold, light} from '../styles/fonts';

const ForgetPasswordScreen = ({navigation}: any) => {
  const [email, setEmail] = React.useState('');
  const [loader, setLoader] = useState(false);
  const {t, i18n} = useTranslation();
  const theme: any = useTheme();

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <View style={{marginHorizontal: '5%', zIndex: 1}}>
          <View>
            <TouchableOpacity
              style={{
                marginTop: '3%',
                backgroundColor: theme.colors.surface,
                height: 40,
                width: 40,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom: '5%',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              {<Icon name="arrow-left" size={25} color={theme.colors.icon} />}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 26,
              fontFamily: bold,
              color: theme.colors.text,
            }}>
            {t('forgetPassword:title')}
          </Text>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontFamily: regular,
              marginRight: '6%',
            }}>
            {t('forgetPassword:desc')}
          </Text>
          <View>
            <TextInput
              style={[
                {
                  borderRadius: 10,
                  marginTop: '5%',
                  paddingHorizontal: '5%',
                  color: theme.colors.text,
                  fontSize: 16,
                  backgroundColor: theme.colors.placeholder,
                  fontFamily: regular,
                  height: 50,
                },
              ]}
              placeholder={t('forgetPassword:placeholder')}
              placeholderTextColor={theme.colors.placeholderText}
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
              }}
            />
            <Text
              style={{
                marginTop: '1%',
                color: '#8199C2',
                fontSize: 14,
                fontFamily: light,
              }}>
              {t('forgetPassword:emailPhoneExample')}
            </Text>
          </View>
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
              ForgetPassword(email, setLoader, navigation);
            }}>
            {loader && <ActivityIndicator size={25} color="white" />}
            {!loader && (
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#FFFFFF',
                }}>
                {t('forgetPassword:btn')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Image
          style={{
            position: 'absolute',
            height: Dimensions.get('window').width / 1.7,
            width: Dimensions.get('window').width / 1.7,
            bottom: 0,
            alignSelf: 'center',
            zIndex: 0,
            marginBottom: '2%',
          }}
          source={require('../assets/images/sign-in.png')}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    color: 'red',
    fontFamily: light,
  },
});

const shadowStyles = StyleSheet.create({
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
});

export default ForgetPasswordScreen;
