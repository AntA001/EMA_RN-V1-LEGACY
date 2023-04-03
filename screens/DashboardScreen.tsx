import React from 'react';
import {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const DashboardScreen = ({navigation}: any) => {
  const [data, setData] = React.useState([]);
  const [loader, setLoader] = useState(false);

  return (
    <>
      <View style={{flex: 1}}>
      </View>
    </>
  );
};

export default DashboardScreen;
