import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';

const DetailSpendScreen = ({ route }) => {
  const { categoryName, data } = route.params;

  // Tạo một object để ánh xạ từ categoryName sang màu tương ứng
  const colorMap = {
    'Ăn uống': 'orange',
    'Quần áo': 'purple',
    'Mỹ phẩm': 'pink',
    'Y tế': 'red',
    'Giáo dục': 'green',
    'Tiền điện': 'blue',
    'Đi lại': 'brown',
    'Tiền nhà': 'gold',
    'Khác': 'black',
  };

  // Lọc dữ liệu chỉ chứa các khoản chi tiêu của danh mục được chọn
  const filteredData = data.filter(item => item.category_expense.content === categoryName);

  // Tạo mảng dữ liệu biểu đồ cột cho các tháng trong năm
  const monthlyData = new Array(12).fill(0);
  const months = new Array(12).fill(0);
  filteredData.forEach(item => {
    const monthIndex = parseInt(item.date.split('-')[1], 10) - 1;
    monthlyData[monthIndex] += item.money;
    months[monthIndex] = item.date.split('-')[1];
  });

  const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const dates = filteredData.map(item => item.date.split('T')[0]);

  // Tìm các tháng có dữ liệu
  const monthsWithData = filteredData.map(item => parseInt(item.date.split('-')[1], 10));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>{categoryName + ' T' + monthsWithData[0]}</Text>
      </View>
      <View style={{ flexDirection: 'row', height: 200, paddingVertical: 5 }}>
        <YAxis
          data={monthlyData}
          contentInset={{ top: 10, bottom: 20 }}
          svg={{ fill: 'grey', fontSize: 10 }}
          numberOfTicks={5}
          formatLabel={(value) => `${value}`}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <BarChart
            style={{ flex: 1 }}
            data={monthlyData}
            svg={{ fill: colorMap[categoryName], }} 
            contentInset={{ top: 10, bottom: 10 }}
            spacingInner={0.2}
            spacingOuter={0.1}
          >
            <Grid />
          </BarChart>
          <XAxis
            style={{ marginHorizontal: 5 }}
            data={monthlyData}
            formatLabel={(value, index) => labels[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 7, fill: 'black' }}
          />
        </View>
      </View>
      <ScrollView style={{ marginTop: 10, maxHeight: 350 }}>
        {filteredData.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, padding: 10, marginBottom: 5 }}>
            <Text style={{ fontSize: 16 }}>{dates[index]} {categoryName}</Text>
            <Text style={{ fontSize: 16 }}>{item.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DetailSpendScreen;
