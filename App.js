import { StatusBar } from 'expo-status-bar';
import React from 'react';
// 항상 View를 import 해주어야함.
// react-native로 부터 import 하지 않고 view를 사용할 수 없음.
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    // 리액트 네이티브는 웹이 아님.
    // -> <div>를 사용할 수 없음.
    // <div> 대신 <View> 를 사용.

    // 모든 텍스트는 text 컴포넌트 안에 있어야 함.
    // -> <h1>, <span>, <p> 등이 없음

    // <StatusBar style="auto" /> 
    // -> 앱을 실행했을때 시계, 베터리 상태 등을 그대로 보여주기위함.
    <View style={styles.container}>
      <Text style={styles.text}>hello my name woobba</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// StyleSheet.create 를 사용하는 이유는 CSS 자동완성을 위해서
// StyleSheet.create 를 제외하면 글로벌 자동완성 때문에 
// 스타일 관련한 요소만 찾기가 매우 번거로움
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize: 28,
    color:"red",
  }
});
