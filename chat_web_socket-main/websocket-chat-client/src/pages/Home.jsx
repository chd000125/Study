import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/studygroups').then((res) => {
      console.log('스터디 목록:', res.data);
      setGroups(res.data);
    });
  }, []);

  const handleCreateGroup = async () => {
    if (!newTitle.trim()) return;

    const payload = {
      title: newTitle,
      description: '새 스터디입니다.',
      maxMember: 10,
    };

    const res = await axios.post('/studygroups', payload);
    setGroups((prev) => [...prev, res.data]);
    setNewTitle('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 스터디 그룹 목록</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <button onClick={() => navigate(`/main/${group.id}`)}>
              {group.title}
            </button>
          </li>
        ))}
      </ul>

      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="새 스터디 제목"
      />
      <button onClick={handleCreateGroup}>생성</button>
    </div>
  );
};

export default Home;
