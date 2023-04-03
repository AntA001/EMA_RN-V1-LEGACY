import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddContactModal from '../components/AddContactModal';
import EditContactModal from '../components/EditContactModal';
import { ContactList, deleteContact } from '../services/UserApi';
import { bold, regular, semiBold } from '../styles/fonts';

const EmergencyContactScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectItem]: any = useState('');
  const { t, i18n } = useTranslation();
  const [contact, setContact]: any = useState([]);
  const [loader, setLoader] = useState(true);
  const [addcontact, setAddContact] = useState(false);
  const [editcontact, setEditContact] = useState(false);
  const theme: any = useTheme();

  useEffect(() => {
    ContactList(setContact, setLoader);
  }, []);

  const deleteItem = (index: number) => {
    let arr = contact;
    arr.splice(index, 1);
    setContact([...arr]);
    showMessage({
      message: 'Contact Deleted SuccessFully',
      type: 'info',
      icon: 'success',
    });
  };

  const addItem = (item: any) => {
    let arr: Array<any> = contact;
    arr.push(item);
    setContact([...arr]);
    showMessage({
      message: t('addContact:messageThree'),
      type: 'info',
      icon: 'success',
    });
  };

  const editItem = (item: any) => {
    let arr: Array<any> = contact;
    arr.push(item);
    setContact([...arr]);
  };

  const nameInitials = (item: any) => {
    let lang: String = item.title;
    if (
      lang.split(' ').length > 1 &&
      lang.split(' ')[1] !== '' &&
      lang.split(' ')[0] !== ''
    ) {
      return (
        lang.split(' ')[0][0].toUpperCase() +
        lang.split(' ')[1][0].toUpperCase()
      );
    } else {
      return lang[0].toUpperCase();
    }
  };

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

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '4%',
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            height: 80,
            maxWidth: 500,
          }}>
          <View style={{ flex: 0.5, alignItems: 'center' }}>
            <View
              style={{
                height: 60,
                width: 60,
                alignItems: 'center',
                backgroundColor: '#2A64C7',
                borderRadius: 50,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#FFF',
                  fontFamily: bold,
                }}>
                {nameInitials(item)}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: theme.colors.surfaceText,
                backgroundColor: theme.colors.surface,
                fontFamily: bold,
                fontSize: 16,
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                color: theme.colors.surfaceText,
                backgroundColor: theme.colors.surface,
                fontFamily: regular,
                fontSize: 16,
              }}>
              {item.contact}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              flex: 0.35,
              justifyContent: 'space-around',
            }}>
            {/* <Icon
            style={{ paddingTop: 8, paddingBottom: 8 }}
            name={'pencil-outline'}
            size={25}
            color="#2A64C7"
            onPress={() => {
              setEditContact(true)
             setSelectItem(item) 
            }}
          /> */}

            <Icon
              style={{ paddingTop: 8, paddingBottom: 8 }}
              name={'delete-outline'}
              size={25}
              color="red"
              onPress={() => {
                deleteContact(item._id, index, deleteItem);
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <AddContactModal
        modalVisible={addcontact}
        setModalVisible={setAddContact}
        addContact={addItem}
      />
      {editcontact && (
        <EditContactModal
          modalVisible={editcontact}
          setModalVisible={setEditContact}
          addContact={editItem}
          selectedItem={selectedItem}
        />
      )}
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ marginHorizontal: '5%', flex: 1 }}>
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
            {t('personalEmergencyContacts:title')}
          </Text>
          {loader && (
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={40} color="#2B6AD4" />
            </View>
          )}
          {!loader && contact.length == 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: bold,
                  color: theme.colors.surfaceText,
                  fontSize: 18,
                }}>
                {t('personalEmergencyContacts:noContact')}
              </Text>
            </View>
          )}
          {!loader && contact.length > 0 && (
            <FlatList
              renderItem={renderItem}
              data={contact}
              style={{ flex: 1, marginVertical: '5%' }}
              showsVerticalScrollIndicator={false}
            // contentContainerStyle={{}}
            />
          )}
          {contact.length < 6 && (
            <TouchableOpacity
              style={{
                backgroundColor: '#2B6AD4',
                height: 60,
                borderRadius: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: '10%',
                width: '100%',
              }}
              onPress={() => {
                setAddContact(true);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 16,
                  color: '#FFFFFF',
                  fontFamily: semiBold,
                }}>
                {t('personalEmergencyContacts:btntText')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};
export default EmergencyContactScreen;
