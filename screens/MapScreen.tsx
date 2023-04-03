import React, {useContext, useEffect, useRef} from 'react';
import {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapPointModal from '../components/MapPointModal';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../components/AuthContext';
import {mapPointsList} from '../services/MapApi';
import {bold, regular, semiBold} from '../styles/fonts';
import {showMessage} from 'react-native-flash-message';
import Header from '../components/HeaderComponent';
import {useTheme} from '@react-navigation/native';

const MapsScreen = ({navigation}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mapPointList, setMapPointList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const theme: any = useTheme();

  const {info, setInfo, token, setToken, unRead, setUnRead}: any =
    useContext(AuthContext);
  const {t, i18n} = useTranslation();
  let mapView: any = useRef(null);

  const styles = StyleSheet.create({
    mainContainer: {flex: 1, backgroundColor: theme.colors.background},
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontFamily: bold,
    },
  });

  const goToLocation = (region: any) => {
    mapView.current?.animateToRegion(region);
  };

  useEffect(() => {
    getInitialRegion();
    mapPointsList(setMapPointList, setLoader);
  }, [info]);

  useEffect(() => {
    if (mapPointList.length > 0) {
      mapView.current?.fitToSuppliedMarkers(
        mapPointList.map((points: any) => points._id.toString()),
        true,
      );
    }
  }, [mapPointList]);
  function getInitialRegion() {
    let region = {
      latitude: info?.municipality?.lat,
      longitude: info?.municipality?.lng,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    };
    goToLocation(region);
  }

  return (
    <>
      <MapPointModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedPoint={selectedPoint}
      />
      <SafeAreaView style={styles.mainContainer}>
        <Header navigation={navigation} />
        <View style={{marginHorizontal: '5%'}}>
          <Text style={styles.title}>{t('map:map')}</Text>
        </View>
        {loader && (
          <View
            style={{
              width: '100%',
              zIndex: 10,
              position: 'absolute',
              top: '60%',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#2B6AD4" />
          </View>
        )}
        <View
          style={{
            marginTop: '5%',
            flex: 1,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            overflow: 'hidden',
          }}>
          <MapView
            ref={mapView}
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            // initialRegion={{
            //   latitude: 33.55150572382569,
            //   longitude: 73.1231014634001,
            //   latitudeDelta: 0.0922,
            //   longitudeDelta: 0.0421,
            // }}
            showsMyLocationButton={false}
            showsCompass={false}>
            {mapPointList.length > 0 &&
              mapPointList.map((item: any, index: number) => {
                return (
                  <Marker
                    key={index}
                    identifier={item._id}
                    coordinate={{
                      latitude: item.lat,
                      longitude: item.lng,
                    }}
                    onPress={() => {
                      setSelectedPoint(item);
                      setModalVisible(!modalVisible);
                    }}
                    image={
                      item?.category
                        ? item?.category?.nameEN === 'Fire Departments'
                          ? require('../assets/images/firestation-marker-icon.png')
                          : item?.category?.nameEN === 'Police Stations'
                          ? require('../assets/images/police-marker-icon.png')
                          : item?.category?.nameEN === 'Hospitals - Clinics'
                          ? require('../assets/images/hospital-marker-icon.png')
                          : item?.category?.nameEN === 'Municipal Buildings'
                          ? require('../assets/images/municipal-marker-icon.png')
                          : item?.category?.nameEN === 'Customer Service Center'
                          ? require('../assets/images/customer-marker-icon.png')
                          : require('../assets/images/marker-icon.png')
                        : require('../assets/images/marker-icon.png')
                    }
                  />
                );
              })}
          </MapView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MapsScreen;
