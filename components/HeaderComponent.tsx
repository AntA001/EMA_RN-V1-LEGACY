import React, {useContext} from 'react';
import {View, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {AuthContext} from './AuthContext';
import {useTheme} from '@react-navigation/native';

const styles = StyleSheet.create({
  iconContainer: {
    height: 45,
    paddingHorizontal: '0.75%',
    marginHorizontal: '0.75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Header = ({navigation}: any) => {
  const {info, setInfo, token, setToken, unRead, setUnRead}: any =
    useContext(AuthContext);

  const theme: any = useTheme();

  return (
    <View
      style={{
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '2%',
      }}>
      <View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            navigation.openDrawer();
          }}>
          {<Icon name="menu" size={35} color={theme.colors.icon} />}
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        {info?.municipality?.facebookLink && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              Linking.openURL(info?.municipality?.facebookLink).catch(() => {
                showMessage({
                  message: 'URL Invalid',
                  type: 'warning',
                  icon: 'danger',
                });
              });
            }}>
            {<Icon name="facebook" size={35} color="#0674E7" />}
          </TouchableOpacity>
        )}
        {info?.municipality?.twitterLink && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              Linking.openURL(info?.municipality?.twitterLink).catch(() => {
                showMessage({
                  message: 'URL Invalid',
                  type: 'warning',
                  icon: 'danger',
                });
              });
            }}>
            {<Icon name="twitter" size={35} color="#1D9BF0" />}
          </TouchableOpacity>
        )}
        {info?.municipality?.instagramLink && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              Linking.openURL(info?.municipality?.instagramLink).catch(() => {
                showMessage({
                  message: 'URL Invalid',
                  type: 'warning',
                  icon: 'danger',
                });
              });
            }}>
            {<Icon name="instagram" size={35} color="#CC1795" />}
          </TouchableOpacity>
        )}
        {info?.municipality?.youtubeLink && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              Linking.openURL(info?.municipality?.youtubeLink).catch(() => {
                showMessage({
                  message: 'URL Invalid',
                  type: 'warning',
                  icon: 'danger',
                });
              });
            }}>
            {<Icon name="youtube" size={35} color="#FF0000" />}
          </TouchableOpacity>
        )}
        {info?.municipality?.webLink && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              Linking.openURL(info?.municipality?.webLink).catch(() => {
                showMessage({
                  message: 'URL Invalid',
                  type: 'warning',
                  icon: 'danger',
                });
              });
            }}>
            {<Icon name="web" size={35} color="#000084" />}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            navigation.navigate('Notifications');
            setUnRead(false);
          }}>
          {unRead && (
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                top: 8,
                right: 12,
                height: 12,
                width: 12,
                backgroundColor: 'red',
                borderRadius: 100,
              }}></View>
          )}
          <Icon name="bell-outline" size={35} color={theme.colors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Header;
