import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '../styles/ChatRoom.css';

const ChatRoom = ({ groupId, userId = 123, userName = '홍길동' }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const stompRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const isSelfMessageRef = useRef(false);
  const [showNewMessageNotice, setShowNewMessageNotice] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowNewMessageNotice(false);
  };

  const isNearBottom = () => {
    const el = chatMessagesRef.current;
    return el ? el.scrollHeight - el.scrollTop - el.clientHeight < 50 : false;
  };

  useEffect(() => {
    if (!groupId) return;

    axios.get(`/studygroups/${groupId}/messages`)
      .then((res) => setMessages(res.data));

    const socket = new SockJS('http://localhost:9090/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/chat/study-group/${groupId}`, (msg) => {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);

          if (body.userName !== userName) {
            if (!isNearBottom()) {
              setShowNewMessageNotice(true);
            }
          } else {
            isSelfMessageRef.current = true;
            scrollToBottom();
          }
        });
      },
    });

    stompClient.activate();
    stompRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [groupId]);

  useEffect(() => {
    if (isSelfMessageRef.current) {
      scrollToBottom();
      isSelfMessageRef.current = false;
    }
  }, [messages]);

  const handleSend = () => {
    if (!content.trim() || !stompRef.current?.connected) return;

    const dto = { groupId, userId, userName, content };
    stompRef.current.publish({
      destination: `/app/chat/study-group/${groupId}`,
      body: JSON.stringify(dto),
    });

    isSelfMessageRef.current = true;
    setContent('');
  };

  const handleNewMessageClick = () => scrollToBottom();

  return (
    <div className="chat-container">
      <h2 className="chat-header">💬 스터디 그룹 ID: {groupId}</h2>
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`chat-message ${msg.userName === userName ? 'me' : 'other'}`}
          >
            <div className="chat-bubble">
              <strong className="chat-username">{msg.userName}</strong>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
        {showNewMessageNotice && (
          <div className="new-message-notice" onClick={handleNewMessageClick}>
            📩 새로운 메시지
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요"
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-button">보내기</button>
      </div>
    </div>
  );
};

export default ChatRoom;
