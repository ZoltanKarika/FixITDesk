import { useState, useRef, useEffect } from 'react';
import "../css/fixer.css";

export const Fixer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Automatikus görgetés az új üzenetekhez
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading) return;

    // Felhasználói üzenet megjelenítése azonnal
    const userMessage = { text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      // Backend hiba kezelése
      if (data.error) {
        throw new Error(typeof data.error === 'string' ? data.error : 'API hiba történt');
      }

      // Mistral válasz kezelése (a Django 'reply' kulcsban küldi)
      if (data.reply) {
        const aiMessage = { text: data.reply, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Üres válasz érkezett a szervertől.');
      }

    } catch (error) {
      console.error("Chat hiba:", error);
      const errorMessage = {
        text: '❌ Hiba: ' + error.message,
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="fixer-frame">
      <h1>🤖 Mr.Fixer</h1>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 && (
          <div className="message ai">Szia! Én Mr.Fixer vagyok. Miben segíthetek?</div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message ai typing-indicator">
            <span>Gépelés...</span>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Írj valamit..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '...' : 'Küldés'}
        </button>
      </div>
    </div>
  );
}

export default Fixer;