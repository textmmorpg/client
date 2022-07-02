import { useState, useEffect, useRef, ReactNode } from "react";
import {
  Box,
  Button,
  Heading,
  Grommet,
  TextInput,
  Text,
  BoxExtendedProps,
  Nav,
  Layer
} from 'grommet';
import { Notes, Github, Wifi, WifiNone } from 'grommet-icons';
import '../App.css';
import { AlignSelfType } from "grommet/utils";
import { useLocation } from "react-router-dom";
import io, { Socket } from 'socket.io-client'

const theme = {
  global: {
    colors: {
      brand: '#809bce',
      background: '#b8e0d2',
      placeholder: '#000000',
      disconnect: '#eb4034',
      connect: '#37eb34',
    },
    font: {
      size: '18px',
      height: '20px',
    },
  },
};

const AppBar = (props: JSX.IntrinsicAttributes & BoxExtendedProps & { children?: ReactNode; }) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);

interface CustomizedState {
  email: string,
  sso_id: string
}

function Chat() {
  const [value, setValue] = useState<string>();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const location = useLocation();
  const [messages, setMessages] = useState<Array<{ name: string, message: string, align: AlignSelfType }>>(() => {
    return [];
  });

  const [socket, setSocket] = useState<Socket>();
  const [connected, setConnected] = useState<boolean>(() => {
    return false;
  });

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  useEffect(() => {
    var state = location.state as CustomizedState;
    console.log(state.email);
    console.log(state.sso_id);
    connect(state.email, state.sso_id);
  }, []);

  if(!connected && socket) {
    socket.on('connect', function () {
      setConnected(true);
      console.log('Connected');
    });

    socket.on('disconnect', function () {
      setConnected(false);
      console.log('Disconnected');
    });
  }

  // add intro message
  if(messages.length === 0) {
    setMessages(messages.concat([{
      name:'Server',
      message: "This is a multiplayer text adventure game! " +
        "Type commands to interact with the world and other players. " +
        "For example, type 'walk forward' to walk, 'turn right' to turn, etc. " +
        "Use 'say hello' to say hello to players around you. Use 'look' or 'vibe check' to " +
        "examine your immediate environment.",
      align:'start'
    }]));
  }

  function connect(email: string, sso_id: string) {
    if(window.location.hostname === 'textmmo.com') {
        setSocket(io('https://textmmo.com/', {
            secure:true, transports: ['websocket']
        }));
    } else {
        setSocket(io('http://localhost:8080/', {}));
    }
  }

  const Messages = () => {
    var ret;
    if(messages === undefined) return;
    for(var i = 0; i < messages.length; i++) {
      ret = [ret,
        <Heading level={3} alignSelf={messages[i]["align"] || 'start'} margin={{vertical: 'medium', horizontal: 'xlarge'}}>
          {messages[i]["name"]}
        </Heading>
        ,
        <Text key={i} alignSelf={messages[i]["align"] || 'start'} margin={{vertical: 'medium', horizontal: 'xlarge'}}>
          {messages[i]["message"]}
        </Text>
      ];
    }
    return ret;
  }

  const InputBox = () => {
    const handleKeyDown = (event: { key: string; }) => {
      if(messages === undefined) return;
      if (event.key === 'Enter') {
        setMessages(messages.concat([{name: "You", message: value || '', align: 'end'}]));
        setValue('');
      }
    }
  
    return (
      <TextInput
        key="input"
        placeholder="type here"
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <Grommet theme={theme}>
      <Layer full={true} modal={false} animate={false} background='background'>
        <AppBar>
          <Heading level='3'>TextMMO</Heading>
          <Nav direction='row'>
            {connected?
              <Button tip='connected to server' alignSelf='end' icon={<Wifi color='connect'/>}/>
              : 
              <Button tip='reconnecting to server' alignSelf='end' icon={<WifiNone color='disconnect'/>}/>
            }
            <Button tip='source code' alignSelf='end' icon={<Github />} onClick={() => window.location.href = "https://github.com/textmmorpg"}/>
            <Button tip='documentation' alignSelf='end' icon={<Notes />} onClick={() => window.location.href = "https://github.com/textmmorpg"}/>
          </Nav>
        </AppBar>
        <Box fill direction='column' overflow={{vertical: "scroll"}}>
          {Messages()}
          <div ref={bottomRef} />
        </Box>
        <Box as="footer" flex={false} pad={{horizontal: "medium", vertical: "large"}}>
          {InputBox()}
        </Box>
      </Layer>
    </Grommet>
  );
}

export default Chat;
