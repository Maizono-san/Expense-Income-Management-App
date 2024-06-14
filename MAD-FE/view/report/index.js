import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Report from './report';
import DetailSpendScreen from './Detail/detailspend';
import DetailEarnScreen from './Detail/detailearn';

const Stack = createStackNavigator();

const ReportScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Report">
      <Stack.Screen name="Báo cáo theo tháng" component={Report} />
      <Stack.Screen name="Khoản chi theo danh mục" component={DetailSpendScreen} />
      <Stack.Screen name="Khoản thu theo danh mục" component={DetailEarnScreen} />
    </Stack.Navigator>
  );
};

export default ReportScreen;
