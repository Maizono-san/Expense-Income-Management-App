import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { getAllExpense } from '../../api/expense';
import { getAllIncome } from '../../api/income';
import { getAllCategoryExpense } from '../../api/category-expense';
import { getAllCategoryIncome } from '../../api/category-income';

const Report = ({ navigation }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('Chi tiêu');
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [total, setTotal] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [categoryExpenseList, setCategoryExpenseList] = useState([]);
  const [categoryIncomeList, setCategoryIncomeList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseResponse = await getAllExpense();
        const incomeResponse = await getAllIncome();
        const categoryExpenseResponse = await getAllCategoryExpense();
        const categoryIncomeResponse = await getAllCategoryIncome();

        const currentMonthExpense = expenseResponse.data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth.getMonth() && itemDate.getFullYear() === currentMonth.getFullYear();
        });
        const currentMonthIncome = incomeResponse.data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth.getMonth() && itemDate.getFullYear() === currentMonth.getFullYear();
        });

        setExpenseData(currentMonthExpense);
        setIncomeData(currentMonthIncome);
        setDataLoaded(true);

        const expenseTotal = currentMonthExpense.reduce((acc, curr) => acc + curr.money, 0);
        const incomeTotal = currentMonthIncome.reduce((acc, curr) => acc + curr.money, 0);

        const total = incomeTotal - expenseTotal;
        setTotal(total);
        setTotalExpense(expenseTotal);
        setTotalIncome(incomeTotal);

        setCategoryExpenseList(categoryExpenseResponse.data);
        setCategoryIncomeList(categoryIncomeResponse.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [currentMonth]);

  const getCategoryName = (categoryId, isExpense) => {
    const categoryList = isExpense ? categoryExpenseList : categoryIncomeList;
    const category = categoryList.find(item => item.id === categoryId);
    return category ? category.content : "Unknown";
  };

  const getCategoryColor = (categoryId, isExpense) => {
    const defaultColor = 'gray';
    const colorMap = {
      1: isExpense ? 'orange' : 'green',
      2: isExpense ? 'purple' : 'red', 
      3: isExpense ? 'pink' : 'orange',
      4: isExpense ? 'red' : 'blue',
      5: 'green',
      6: 'blue',
      7: 'brown',
      8: 'gold',
      9: 'black',
    };
    return colorMap[categoryId] || defaultColor;
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(nextMonth);
  };

  const formattedCurrentMonth = `${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()}`;

  const totalText = `${total >= 0 ? '+' : '-'}${Math.abs(total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`;

  const totalColor = total >= 0 ? 'green' : 'red';

  const handleCategoryPress = (categoryId, isExpense) => {
    if (isExpense) {
      navigation.navigate('Khoản chi theo danh mục', {
        categoryName: getCategoryName(categoryId, isExpense),
        isExpense: isExpense,
        data: expenseData,
      });
    } else {
      navigation.navigate('Khoản thu theo danh mục', {
        categoryName: getCategoryName(categoryId, isExpense),
        isExpense: isExpense,
        data: incomeData,
      });
    }
  };

  const summarizeDataByCategoryId = (data, isExpense) => {
    return data.reduce((acc, item) => {
      const categoryId = isExpense ? item.categoryExpenseId : item.categoryIncomeId;
      if (acc[categoryId]) {
        acc[categoryId] += item.money;
      } else {
        acc[categoryId] = item.money;
      }
      return acc;
    }, {});
  };

  // Hàm tạo dữ liệu cho biểu đồ tròn từ dữ liệu đã được tổng hợp
  const createPieChartData = (data, isExpense) => {
    const summarizedData = summarizeDataByCategoryId(data, isExpense);
    return Object.keys(summarizedData).map(categoryId => ({
      key: categoryId,
      value: summarizedData[categoryId],
      svg: { fill: getCategoryColor(parseInt(categoryId), isExpense) },
    }));
  }

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2); // Làm tròn đến hai chữ số thập phân
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={[styles.button]}>{'<'}</Text>
        </TouchableOpacity>
        <View style={[styles.monthContainer]}>
          <Text style={styles.month}>{formattedCurrentMonth}</Text>
        </View>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={[styles.button]}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rectRow}>
        <View style={[styles.smallrect]}>
          <View style={styles.textRow}>
            <Text style={styles.rectText}>Chi tiêu</Text>
            <Text style={styles.spendText}>-{totalExpense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ </Text>
          </View>
        </View>
        <View style={[styles.smallrect]}>
          <View style={styles.textRow}>
            <Text style={styles.rectText}>Thu nhập</Text>
            <Text style={styles.earnText}>+{totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ</Text>
          </View>
        </View>
      </View>
      <View style={styles.bigrect}>
        <View style={styles.textRow}>
          <Text style={styles.rectText}>Thu Chi</Text>
          <Text style={[styles.totalText, { color: totalColor }]}>{totalText}</Text>
        </View>
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Chi tiêu' ? styles.selectedTab : styles.unselectedTab]}
          onPress={() => setSelectedTab('Chi tiêu')}>
          <Text style={[styles.tabText, selectedTab === 'Chi tiêu' ? styles.selectedTabText : styles.unselectedtabText]}>Chi tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Thu nhập' ? styles.selectedTab : styles.unselectedTab]}
          onPress={() => setSelectedTab('Thu nhập')}>
          <Text style={[styles.tabText, selectedTab === 'Thu nhập' ? styles.selectedTabText : styles.unselectedtabText]}>Thu nhập</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'Chi tiêu' && dataLoaded && (
        <ScrollView style={styles.scrollView}>
          {expenseData.length > 0 ? (
            <View>
              <PieChart
                style={{ height: 200 }}
                data={createPieChartData(expenseData, true)}
                innerRadius="30%"
                outerRadius="70%"
              />
              <View style={styles.chartLabels}>
                {expenseData.reduce((acc, item) => {
                  const existingIndex = acc.findIndex(el => el.categoryExpenseId === item.categoryExpenseId);
                  if (existingIndex !== -1) {
                    acc[existingIndex].money += item.money;
                  } else {
                    acc.push({ categoryExpenseId: item.categoryExpenseId, money: item.money });
                  }
                  return acc;
                }, []).map((item, index) => (
                  <TouchableOpacity 
                    key={item.index} 
                    style={styles.chartLabel}
                    onPress={() => handleCategoryPress(item.categoryExpenseId, true)}>
                    <Text style={[styles.labelText, { color: getCategoryColor(item.categoryExpenseId, true) }]}>
                      {getCategoryName(item.categoryExpenseId, true)}
                    </Text>
                    <Text style={[styles.valueText, { color: getCategoryColor(item.categoryExpenseId, true) }]}>
                      {item.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ ({calculatePercentage(item.money, totalExpense)}%)
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.selectedTabMessage}>Không có dữ liệu</Text>
          )}
        </ScrollView>
      )}
      {selectedTab === 'Thu nhập' && dataLoaded && (
        <ScrollView style={styles.scrollView}>
          {incomeData.length > 0 ? (
            <View>
              <PieChart
                style={{ height: 200 }}
                data={createPieChartData(incomeData, false)}
                innerRadius="30%"
                outerRadius="70%"
              />
              <View style={styles.chartLabels}>
                {incomeData.reduce((acc, item) => {
                  const existingIndex = acc.findIndex(el => el.categoryIncomeId === item.categoryIncomeId);
                  if (existingIndex !== -1) {
                    acc[existingIndex].money += item.money;
                  } else {
                    acc.push({ categoryIncomeId: item.categoryIncomeId, money: item.money });
                  }
                  return acc;
                }, []).map((item, index) => (
                  <TouchableOpacity 
                    key={item.index} 
                    style={styles.chartLabel}
                    onPress={() => handleCategoryPress(item.categoryIncomeId, false)}>
                    <Text style={[styles.labelText, { color: getCategoryColor(item.categoryIncomeId, false) }]}>
                      {getCategoryName(item.categoryIncomeId, false)}
                    </Text>
                    <Text style={[styles.valueText, { color: getCategoryColor(item.categoryIncomeId, false) }]}>
                    {item.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ ({calculatePercentage(item.money, totalIncome)}%)
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.selectedTabMessage}>Không có dữ liệu</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  selectedTabMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    color: 'orange'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthContainer: {
    backgroundColor: '#FFF2CC',
    paddingHorizontal: 90,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
  },
  month: {
    fontSize: 20,
    color: 'black',
  },
  button: {
    fontSize: 50,
    color: 'orange',
  },
  rectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallrect: {
    width: 170,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black', 
  },
  bigrect: {
    marginTop: 10,
    alignSelf: 'center',
    width: 355,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black', 
  },
  rectText: {
    fontSize: 10,
    marginLeft: 2, 
  },
  spendText: {
    fontSize: 20,
    color:'red',
    marginRight : 2,
  },
  earnText: {
    fontSize: 20,
    color:'green',
    marginRight : 2,
  },
  totalText:{
    fontSize: 20,
    marginRight : 2,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'orange', 
  },
  unselectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC', 
  },
  selectedTabText: {
    fontSize: 16,
    color: 'orange', 
  },
  unselectedtabText: {
    fontSize:  16,
    color: '#CCCCCC', 
  },
  chartLabels: {
    marginTop: 10,
  },
  chartLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    padding: 10,
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 14,
    color: 'black',
  },
  scrollView: {
    marginTop: 10,
    maxHeight: 350, // Giới hạn chiều cao của ScrollView
  },
});

export default Report;
