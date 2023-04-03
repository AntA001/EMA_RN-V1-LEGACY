import {useTheme} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  RefreshControl,
  FlatList,
  StyleSheet,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArticleCardVertical from '../components/ArticleCardVerticalComponent';
import {AuthContext} from '../components/AuthContext';
import Header from '../components/HeaderComponent';
import {Guides} from '../services/UserApi';
import {bold, regular, semiBold} from '../styles/fonts';

const GuidesScreen = ({navigation}: any) => {
  const [loader, setLoader] = useState(true);
  const [guidesList, setGuidesList] = useState([]);
  const {info, setInfo, token, setToken, unRead, setUnRead}: any =
    useContext(AuthContext);
  const {t, i18n} = useTranslation();
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    mainContainer: {flex: 1, backgroundColor: theme.colors.background},
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontFamily: bold,
    },
    text: {
      fontFamily: bold,
      color: 'black',
      fontSize: 18,
    },
  });

  useEffect(() => {
    Guides(setGuidesList, setLoader);
  }, [token]);

  // const renderItem = ({ item, index }: any) => {
  //   return <ArticleCard index={index} item={item} navigation={navigation} />;
  // };

  const renderItem = ({item, index}: any) => {
    return (
      <ArticleCardVertical
        index={index}
        item={item}
        navigation={navigation}
        type={'GuideArticle'}
      />
    );
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <Header navigation={navigation} />
        <View style={{marginHorizontal: '5%'}}>
          <Text style={styles.title}>{t('guides:title')}</Text>
        </View>
        {loader && guidesList.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#2B6AD4" />
          </View>
        )}
        {!loader && guidesList.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>{t('guides:noGuides')}</Text>
          </View>
        )}
        {guidesList.length > 0 && (
          <FlatList
            data={guidesList}
            renderItem={renderItem}
            keyExtractor={(item: any, index: number) => String(index)}
            style={{marginHorizontal: '5%', marginTop: '5%'}}
            showsVerticalScrollIndicator={false}
          />
        )}
        {/* <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: '1%',
                    marginHorizontal: '5%',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 18,
                      fontFamily: bold,
                    }}>
                    Top Viewed Articles
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('GuidesView', {
                        label: 'Top Viewed Articles',
                      });
                    }}>
                    <Text
                      style={{
                        color: '#2B6AD4',
                        fontSize: 18,
                        fontFamily: semiBold,
                      }}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={guidesList}
                  renderItem={renderItem}
                  horizontal={true}
                  style={{
                    marginLeft: '5%',
                  }}
                  contentContainerStyle={{ padding: '5%', paddingLeft: '1%' }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: '1%',

                    marginHorizontal: '5%',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 18,
                      fontFamily: bold,
                    }}>
                    International
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('GuidesView', {
                        label: 'International',
                      });
                    }}>
                    <Text
                      style={{
                        color: '#2B6AD4',
                        fontSize: 18,
                        fontFamily: semiBold,
                      }}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={guidesList}
                  renderItem={renderItem}
                  horizontal={true}
                  style={{
                    marginLeft: '5%',
                  }}
                  contentContainerStyle={{ padding: '5%', paddingLeft: '1%' }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: '1%',
                    marginHorizontal: '5%',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 18,
                      fontFamily: bold,
                    }}>
                    Local
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('GuidesView', { label: 'Local' });
                    }}>
                    <Text
                      style={{
                        color: '#2B6AD4',
                        fontSize: 18,
                        fontFamily: semiBold,
                      }}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={guidesList}
                  renderItem={renderItem}
                  horizontal={true}
                  style={{
                    marginLeft: '5%',
                  }}
                  contentContainerStyle={{ padding: '5%', paddingLeft: '1%' }}
                  showsHorizontalScrollIndicator={false}
                />
              </View> */}
      </SafeAreaView>
    </>
  );
};

export default GuidesScreen;
