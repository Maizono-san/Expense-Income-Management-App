import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { getAllExpense } from '../../../api/expense';
import { getAllIncome } from '../../../api/income';

const Compared = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [dataText, setDataText] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseResponse = await getAllExpense();
        const incomeResponse = await getAllIncome();

        const yearData = {};

        let balance = 0;

        for (let i = 1; i <= 12; i++) {
          const monthExpense = expenseResponse.data.filter(item => new Date(item.date).getFullYear() === currentYear && new Date(item.date).getMonth() + 1 === i);
          const monthIncome = incomeResponse.data.filter(item => new Date(item.date).getFullYear() === currentYear && new Date(item.date).getMonth() + 1 === i);
          const monthTotal = monthIncome.reduce((acc, curr) => acc + curr.money, 0) - monthExpense.reduce((acc, curr) => acc + curr.money, 0);
          balance += monthTotal;
          yearData[i] = balance;
        }

        const lineChartData = [];
        const lineChartDataText = [];
        const lineChartLabels = [];
        let prevBalance = 0;
        for (let i = 1; i <= 12; i++) {
          const balance = yearData[i] || prevBalance;
          lineChartData.push(balance);
          lineChartDataText.push(`${balance.toLocaleString()}đ`);
          lineChartLabels.push(`T${i}`);
          prevBalance = balance;
        }

        setData(lineChartData);
        setDataText(lineChartDataText);
        setLabels(lineChartLabels);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [currentYear]);

  const goToPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const goToNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={goToPreviousYear}>
          <Text style={[styles.button]}>{'<'}</Text>
        </TouchableOpacity>
        <View style={[styles.yearContainer]}>
          <Text style={styles.year}>{currentYear}</Text>
        </View>
        <TouchableOpacity onPress={goToNextYear}>
          <Text style={[styles.button]}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 200, flexDirection: 'row' }}>
        <YAxis
          data={data}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fill: 'grey', fontSize: 10 }}
          numberOfTicks={5}
          formatLabel={(value) => `${value}`}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <LineChart
            style={{ flex: 1 }}
            data={data}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <Grid />
          </LineChart>
          <XAxis
            style={{ marginHorizontal: -10, marginTop: 10 }}
            data={data}
            formatLabel={(value, index) => labels[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {labels.map((label, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.labelText}>{label}</Text>
            <Text style={styles.dataText}>{dataText[index]}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearContainer: {
    backgroundColor: '#FFF2CC',
    paddingHorizontal: 70,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
  },
  year: {
    fontSize: 20,
    color: 'black',
  },
  button: {
    fontSize: 50,
    color: 'orange',
  },
  scrollView: {
    marginTop: 10,
    maxHeight: 300,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    padding: 10,
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataText: {
    fontSize: 16,
    marginRight: 2,
  },
});

export default Compared;
