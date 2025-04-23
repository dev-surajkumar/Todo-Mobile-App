import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './ThemeContext';

const Addtask = () => {
  const { darkMode } = useContext(ThemeContext);
  const scheme = useColorScheme(); // ✅ Moved inside component

  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks', error);
      }
    };

    fetchTasks();
  }, []);

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleAddTask = async () => {
    if (!category) {
      alert('Please enter a category!');
      return;
    }

    if (task && category) {
      let updatedTasks = [];

      if (editIndex !== null) {
        updatedTasks = tasks.map((item, index) =>
          index === editIndex ? { ...item, task, category } : item
        );
        setEditIndex(null);
      } else {
        const newTask = {
          task,
          category,
          completed: false,
          backgroundColor: getRandomColor(),
        };
        updatedTasks = [...tasks, newTask];
      }

      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setTask('');
      setCategory('');
    }
  };

  const handleDeleteTask = async (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].task);
    setCategory(tasks[index].category);
    setEditIndex(index);
  };

  const toggleComplete = async (index) => {
    const updatedTasks = tasks.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getRandomColor = () => {
    const colors = ['#e57373', '#81c784', '#64b5f6', '#ffd54f', '#ba68c8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderTaskItem = ({ item, index }) => (
    <View style={[styles.taskRow, { backgroundColor: item.backgroundColor }]}>
      <TouchableOpacity onPress={() => toggleComplete(index)} style={{ flex: 1 }}>
        <Text
          style={[
            styles.task,
            item.completed && { textDecorationLine: 'line-through', opacity: 0.6 },
          ]}
        >
          {item.task}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleEditTask(index)} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <Text style={styles.category}>{item.category}</Text>
      <TouchableOpacity onPress={() => handleDeleteTask(index)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.addContainer, darkMode && { backgroundColor: '#121212' }]}>
      <Text style={styles.addHeader}>Add a new task!</Text>
      <TextInput
        style={[
          styles.addInput,
          {
            color: scheme === 'dark' ? 'white' : 'black',
            backgroundColor: scheme === 'dark' ? '#333' : '#eee',
          },
        ]}
        placeholder="Enter a task"
        placeholderTextColor={darkMode ? '#ccc' : '#999'}
        value={task}
        onChangeText={setTask}
      />
      <View style={styles.addCategory}>
        <Text style={styles.categoryText}>Select Category </Text>
        <TextInput
          style={[
            styles.categoryInput,
            {
              color: scheme === 'dark' ? 'white' : 'black',
              backgroundColor: scheme === 'dark' ? '#333' : '#eee',
            },
          ]}
          placeholder="Your Category"
          placeholderTextColor={darkMode ? '#ccc' : '#999'}
          value={category}
          onChangeText={setCategory}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>
          {editIndex !== null ? 'Update Task' : '+ Add Task'}
        </Text>
      </TouchableOpacity>

      <View style={styles.taskHeader}>
        <Text style={[styles.headerText, { color: darkMode ? 'white' : 'black', flex: 1 }]}>
          Task
        </Text>
        <Text style={[styles.headerText, { color: darkMode ? 'white' : 'black', width: 50 }]}>
          Edit
        </Text>
        <Text style={[styles.headerText, { color: darkMode ? 'white' : 'black', width: 80 }]}>
          Category
        </Text>
        <Text style={[styles.headerText, { color: darkMode ? 'white' : 'black', width: 60 }]}>
          Delete
        </Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(_, index) => index.toString()}
        style={styles.taskContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  addHeader: {
    color: '#00f742',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addInput: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#000',
  },
  addCategory: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  categoryInput: {
    width: 200,
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    color: '#000',
  },
  categoryText: {
    fontWeight: '900',
    color: '#3498db',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginTop: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskContainer: {
    marginTop: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  task: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  category: {
    width: 80,
    color: '#fff',
    fontSize: 14,
    paddingLeft: 20,
  },
  editButton: {
    width: 50,
    backgroundColor: '#ff9800',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 60,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Addtask;
