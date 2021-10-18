import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';

// icon import
import {Fontisto} from '@expo/vector-icons';


// 항상 View를 import 해주어야함.
// react-native로 부터 import 하지 않고 view를 사용할 수 없음.
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
 } from 'react-native';

// 화면 크기 가져오기. Dimensions
const {width:SCREEN_WIDTH} = Dimensions.get("window");

// 날씨정보 API KEY
// 실제로는 코드에 api key를 작성하면 안됨.
// 만약 실제 앱이라면 server에 이 api key 를 두는것이 정석.
// 서버에 두고 사용을 원할 때 마다 요청하여 key를 사용.
const API_KEY = "29850bbafe2f74cdc28337d9e58d2c56";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstom: "lightning",
}


export default function App() {
  const [region, setCity] = useState("Loading...");
  const [street, setStreet] = useState("Loading...");

  // daily 기상 정보를 저장할 배열 state
  const [days, setDays] = useState([]);

  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const ask = async() => {
    // 유저의 위치 동의 구하기
    const {granted} = await Location.requestForegroundPermissionsAsync();
    
    // 위치 동의를 받지 않았다면
    if(!granted)
    {
      setOk(false);
    }
    // 위도, 경도 받기
    const {
      coords:{latitude, longitude},
    // 위치 정확도 설정
    } = await Location.getCurrentPositionAsync({accuracy:5});

    // 도시 이름 알아내기 위해 reverseGeocodeAsync 함수 사용
    // Geocode -> 주소를 위도 경도로 변환
    // reverseGeocode -> 위도 경도를 주소로 변환
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps:false}
    );
    // reverseGeocode 로 받은 테이블 접근
    setCity(location[0].region);
    setStreet(location[0].street);

    // 날씨 가져오기 (api 호출) -> 매우 방대한 테이블 가져옴
    const responce = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await responce.json();
    
    // 가져온 테이블에서 daily만 추출하여 days state (배열)에 넣음
    // daily 안에도 매우 많은 컬럼이 있음.
    setDays(json.daily);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{region}</Text>
        </View>
        <View style={styles.street}>
          <Text style={styles.streetName}>{street}</Text>
        </View>
      </View>
      <ScrollView 
      horizontal 
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
      {
      // 기상정보가 있으면 dats.map()을 사용하여 days 안에 있는 각 day를
      // 컴포넌트로 바꾼 후 return
      days.length === 0 ? (
      <View style={styles.day}>
        <ActivityIndicator 
        color="white" 
        size="large" 
        />
      </View> 
      ) : (
        days.map((day, index) =>
        <View key={index} style={styles.day}>
          <View 
          style={{
            flexDirection: "row", 
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 100,
            marginRight: 30,
            }}>
            <Text style={styles.temp}>
              {parseFloat(day.temp.day).toFixed(1)}
            </Text>
            <Fontisto name={icons[day.weather[0].main]} size={88} color="black"/>
          </View>
         
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>
        )
      )}
        
      </ScrollView>
      <StatusBar style="auto"/>
    </View>
    
  );
}

// StyleSheet.create 를 사용하는 이유는 CSS 자동완성을 위해서
// StyleSheet.create 를 제외하면 글로벌 자동완성 때문에 
// 스타일 관련한 요소만 찾기가 매우 번거로움
const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor:"tomato",
  },
  top: {
    flex:2,
  },
  city:{
    flex: 2,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName:{
    marginTop:50,
    fontSize: 68,
    fontWeight:"500",
  },
  street:{
    flex:0.1,
    justifyContent:"center",
    alignItems:"center",
  },
  streetName:{
    marginTop: -70,
    fontSize: 48,
    fontWeight:"500",
  },
  weather:{
    minHeight: 300,
  },

  day:{
    width:SCREEN_WIDTH,
  },

  temp:{
    marginLeft:30,
    fontSize: 88,
  },
  description:{
    marginLeft:40,
    marginTop: 0,
    fontSize:50,
  },

  tinyText:{
    marginTop: 5,
    marginLeft:42,
    fontSize: 35,
  },




  text:{
    fontSize: 28,
    color:"black",
  }
});
