import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './ThemeContext';

const TaskOnLoad = () => {
  const { darkMode } = useContext(ThemeContext); // ✅ Moved inside component

  const [tasks, setTasks] = useState([]);
  const [selectedView, setSelectedView] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        setTasks(parsed);
        const uniqueCategories = [...new Set(parsed.map(t => t.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.log('Error fetching tasks', error);
    }
  };

  const toggleCompletion = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const filterTasks = () => {
    switch (selectedView) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'category':
        return tasks.filter(task => task.category === selectedCategory);
      default:
        return tasks;
    }
  };

  const renderTaskItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => toggleCompletion(index)}
      style={[
        styles.taskCard,
        { backgroundColor: item.completed ? '#d1ffd1' : '#e6e6fa' },
      ]}
    >
      <Text
        style={[
          styles.taskText,
          { textDecorationLine: item.completed ? 'line-through' : 'none' },
        ]}
      >
        {item.task} - {item.category}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => Alert.alert('Edit', 'Editing feature coming soon')}
          style={styles.editButton}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteTask(index)}
          style={styles.deleteButton}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: '#ADD8E6' }]}
          onPress={() => {
            setSelectedView('all');
            setShowCategoryList(false);
          }}
        >
          <Text>All Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: '#FFA07A' }]}
          onPress={() => {
            setSelectedView('category');
            setShowCategoryList(true);
          }}
        >
          <Text>Task by Category</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: '#90EE90' }]}
          onPress={() => {
            setSelectedView('completed');
            setShowCategoryList(false);
          }}
        >
          <Text>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Category List */}
      {showCategoryList && selectedView === 'category' && (
        <View style={styles.dropdown}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setSelectedCategory(cat);
                setShowCategoryList(false);
              }}
              style={styles.dropdownItem}
            >
              <Text>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Task List */}
      <FlatList
        data={filterTasks()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTaskItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
    width: '32%',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 10,
    padding: 8,
  },
  dropdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  taskCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 5,
    backgroundColor: '#ffff99',
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#ff9999',
    borderRadius: 5,
  },
});

export default TaskOnLoad;
