import React,{useEffect,useState} from 'react';
import './App.css';
import Sibebar from './Sidebar'
import Chat from './Chat'
import Pusher from 'pusher-js'
import axios from './axios'
function App() {
  const [messages,setMessages] =useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
    .then(response =>{
     
      setMessages(response.data)
    })
  },[])


  useEffect(() => {
    const pusher = new Pusher('c8f7f9699784fdcc3060', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      alert(JSON.stringify(newMessage));
      setMessages([...messages,newMessage]);
    });
    
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  console.log(messages)
  return (
    <div className='app'>
      <div className="app__body">
      <Sibebar />
      <Chat messages={messages} />
      
      </div>
     
    </div>

    
  );
}

export default App;
