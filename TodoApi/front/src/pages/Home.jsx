import React, { useState, useEffect } from 'react';
import CustomCalendar from '../components/Calander.jsx';
import TodoList from '../components/TodoList';
import { getTodos } from '../todoApi'; // API 연결

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await getTodos();
        setTodos(response.data);
    };

    return (
        <div>
            <CustomCalendar onDateChange={setSelectedDate} todos={todos} />
            <TodoList selectedDate={selectedDate} todos={todos} />
        </div>
    );
};

export default Home;
