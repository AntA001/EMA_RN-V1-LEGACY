import {useTheme} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/AuthContext';
import CategoryPasswordModal from '../components/CategoryPasswordModal';
import {SharedData} from '../services/SharedData';
import {getUserCategoryList, updateUserCategory} from '../services/UserApi';
import {bold, regular, semiBold} from '../styles/fonts';

const UserCategoryScreen = ({navigation}: any) => {
  const {t, i18n} = useTranslation();
  const [data, setData] = React.useState([]);
  const [loader, setLoader] = useState(true);
  const [userCategory, setUserCategory] = useState('');
  const [search, setSearch] = useState('');
  const [userCategoryList, setUserCategoryList] = useState([]);
  const [tempList, setTempList] = useState([]);
  const theme: any = useTheme();
  const {info, setInfo, token, setToken}: any = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem]: any = useState(null);

  const selectedLanguageCode = i18n.language;

  useEffect(() => {
    getUserCategoryList(setUserCategoryList, setLoader, setTempList);
    setUserCategory(SharedData.UserInfo.category._id);
  }, []);

  useEffect(() => {
    if (search == '') {
      let temp = tempList.length > 0 ? tempList : userCategoryList;
      let index = temp.findIndex((item: any) => item._id === userCategory);
      if (index > -1) {
        let tempM = temp[index];
        temp.splice(index, 1);
        temp.unshift(tempM);
        setUserCategoryList(temp);
      }
    }
  }, [userCategoryList, userCategory]);

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

  const searched = (term: string) => {
    if (term != '') {
      let keyword = term.toLowerCase();
      let searched = tempList;
      if (selectedLanguageCode == 'al') {
        searched = searched.filter((cat: any) =>
          cat.nameAL.toLowerCase().includes(keyword),
        );
      } else if (selectedLanguageCode == 'el') {
        searched = searched.filter((cat: any) =>
          cat.nameEL.toLowerCase().includes(keyword),
        );
      } else if (selectedLanguageCode == 'mk') {
        searched = searched.filter((cat: any) =>
          cat.nameMK.toLowerCase().includes(keyword),
        );
      } else if (selectedLanguageCode == 'bg') {
        searched = searched.filter((cat: any) =>
          cat.nameBG.toLowerCase().includes(keyword),
        );
      } else {
        searched = searched.filter((cat: any) =>
          cat.nameEN.toLowerCase().includes(keyword),
        );
      }
      setUserCategoryList(searched);
    } else {
      if (tempList.length > 0) {
        setUserCategoryList(tempList);
      }
    }
  };

  const selectUserCategory = (id: any) => {
    setUserCategory(id);
    if (modalVisible) {
      setModalVisible(false);
      setSelectedItem(null);
    }
    updateUserCategory(id, setToken, setInfo);
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: '2%',
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          height: 60,
        }}
        onPress={() => {
          if (item._id != userCategory) {
            setSearch('');
            if (item?.locked) {
              setSelectedItem(item);
              setModalVisible(true);
            } else {
              selectUserCategory(item._id);
            }
          }
        }}>
        <Text
          style={{
            marginHorizontal: '1%',
            paddingHorizontal: '2%',
            color: theme.colors.surfaceText,
            backgroundColor: theme.colors.surface,
            width: '85%',
            fontFamily: regular,
            fontSize: 16,
          }}>
          {selectedLanguageCode === 'en'
            ? item.nameEN
            : selectedLanguageCode === 'al'
            ? item.nameAL
            : selectedLanguageCode === 'mk'
            ? item.nameMK
            : selectedLanguageCode === 'bg'
            ? item.nameBG
            : item.nameEL}
        </Text>
        {item._id == userCategory && (
          <TouchableOpacity style={{alignItems: 'center', width: '10%'}}>
            <Icon
              style={{paddingTop: 8, paddingBottom: 8}}
              name={'check-circle-outline'}
              size={30}
              color="#2B6AD4"
            />
          </TouchableOpacity>
        )}
        {item._id != userCategory && item?.locked && (
          <View style={{alignItems: 'center', width: '10%'}}>
            <Icon
              style={{paddingTop: 8, paddingBottom: 8}}
              name={'lock-outline'}
              size={25}
              color="#2B6AD4"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <CategoryPasswordModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedItem={selectedItem}
        selectUserCategory={selectUserCategory}
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
            {t('userCategory:title')}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: bold,
              color: theme.colors.text,
              marginTop: '2%',
              marginRight: '6%',
            }}>
            {t('userCategory:selectYourUserCategory')}
          </Text>
          {!loader && tempList.length > 0 && (
            <TextInput
              style={[
                {
                  borderRadius: 10,
                  marginTop: '5%',
                  paddingHorizontal: '5%',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.placeholder,
                  height: 50,
                },
              ]}
              placeholder={t('userCategory:search')}
              placeholderTextColor={theme.colors.placeholderText}
              onChangeText={text => {
                setSearch(text);
                searched(text);
              }}
              value={search}
            />
          )}
          {loader && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={40} color="#2B6AD4" />
            </View>
          )}
          {!loader && userCategoryList.length == 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: bold,
                  color: 'black',
                  fontSize: 18,
                }}>
                {t('userCategory:noUserCategories')}
              </Text>
            </View>
          )}
          {!loader && userCategoryList.length > 0 && (
            <FlatList
              renderItem={renderItem}
              data={userCategoryList}
              keyExtractor={(item: any, index: number) => String(index)}
              style={{flex: 1, marginVertical: '5%'}}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default UserCategoryScreen;
