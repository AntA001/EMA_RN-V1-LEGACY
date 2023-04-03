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
import {SharedData} from '../services/SharedData';
import {MuniciplityList, updateMunicipality} from '../services/UserApi';
import {bold, regular, semiBold} from '../styles/fonts';

const MunicipalityScreen = ({navigation}: any) => {
  const {t, i18n} = useTranslation();
  const [data, setData] = React.useState([]);
  const [loader, setLoader] = useState(true);
  const [municipality, setMunicipality] = useState('');
  const [search, setSearch] = useState('');
  const [municipalityList, setMunicipalityList] = useState([]);
  const [tempList, setTempList] = useState([]);

  const {info, setInfo, token, setToken}: any = useContext(AuthContext);
  const selectedLanguageCode = i18n.language;

  const theme: any = useTheme();

  useEffect(() => {
    MuniciplityList(setMunicipalityList, setLoader, setTempList);
    setMunicipality(SharedData.UserInfo.municipality._id);
  }, []);

  useEffect(() => {
    if (search == '') {
      let temp = tempList.length > 0 ? tempList : municipalityList;
      let index = temp.findIndex((item: any) => item._id === municipality);
      if (index > -1) {
        let tempM = temp[index];
        temp.splice(index, 1);
        temp.unshift(tempM);
        setMunicipalityList(temp);
      }
    }
  }, [municipalityList, municipality]);

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
    mainContainer: {flex: 1, backgroundColor: theme.colors.background},
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontFamily: bold,
    },
    desc: {
      fontSize: 18,
      fontFamily: bold,
      color: theme.colors.text,
      marginTop: '2%',
      marginRight: '6%',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: '2%',
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      height: 60,
    },
    listText: {
      marginHorizontal: '1%',
      paddingHorizontal: '2%',
      color: theme.colors.text,
      width: '85%',
      fontFamily: regular,
      fontSize: 16,
    },
    input: {
      borderRadius: 10,
      marginTop: '5%',
      paddingHorizontal: '5%',
      color: theme.colors.text,
      backgroundColor: theme.colors.placeholder,
      height: 50,
    },
    backBtn: {
      marginVertical: '3%',
      backgroundColor: theme.colors.surface,
      height: 40,
      width: 40,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const searched = (term: string) => {
    if (term != '') {
      let keyword = term.toLowerCase();
      let searched = tempList;
      if (selectedLanguageCode == 'en') {
        searched = searched.filter((mun: any) =>
          mun.nameEN.toLowerCase().includes(keyword),
        );
        setMunicipalityList(searched);
      } else {
        searched = searched.filter((mun: any) =>
          mun.nameAL.toLowerCase().includes(keyword),
        );
        setMunicipalityList(searched);
      }
    } else {
      if (tempList.length > 0) {
        setMunicipalityList(tempList);
      }
    }
  };

  const selectMunicipality = (id: any) => {
    setMunicipality(id);
    updateMunicipality(id, setToken, setInfo);
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          if (item._id != municipality) {
            setSearch('');
            selectMunicipality(item._id);
          }
        }}>
        <Text style={styles.listText}>
          {selectedLanguageCode === 'en'
            ? item.nameEN
            : item.nameAL != '-'
            ? item.nameAL
            : item.nameEN}
        </Text>
        {item._id == municipality && (
          <TouchableOpacity style={{alignItems: 'center', width: '10%'}}>
            <Icon
              style={{paddingTop: 8, paddingBottom: 8}}
              name={'check-circle-outline'}
              size={30}
              color="#2B6AD4"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={{marginHorizontal: '5%', flex: 1}}>
          <View>
            <TouchableOpacity
              style={[styles.backBtn, styles.shadow]}
              onPress={() => {
                navigation.goBack();
              }}>
              {<Icon name="arrow-left" size={25} color={theme.colors.icon} />}
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{t('municipality:title')}</Text>
          <Text style={styles.desc}>
            {t('municipality:selectyourmunicipality')}
          </Text>
          {!loader && tempList.length > 0 && (
            <TextInput
              style={[styles.input]}
              placeholder={t('municipality:search')}
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
          {!loader && municipalityList.length == 0 && (
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
                {t('municipality:noMunicipalities')}
              </Text>
            </View>
          )}
          {!loader && municipalityList.length > 0 && (
            <FlatList
              renderItem={renderItem}
              data={municipalityList}
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

export default MunicipalityScreen;
