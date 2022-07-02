import { useEffect, useRef, ReactNode } from "react";
import useState from 'react-usestateref';
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


interface CustomizedState {
  email: string,
  sso_id: string
}

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

function Chat() {
  const [value, setValue] = useState<string>();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const location = useLocation();
  const [messages, setMessages, messageRef] = useState<Array<{ name: string, message: string, align: AlignSelfType }>>(() => {
    return [];
  });

  const [socket, setSocket] = useState<Socket>();
  
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return false;
  });

  const [connected, setConnected] = useState<boolean>(() => {
    return false;
  });

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  useEffect(() => {
    var state = location.state as CustomizedState;
    connect(state.email, state.sso_id);
  }, []);

  const addMessage = (name: string, message: string, align: AlignSelfType) => {
    if(!messageRef) return;
    setMessages((messageRef.current || []).concat([{
      message: message,
      name: name,
      align: align
    }]));
  }

  const sendMessage = (input: string) => {
    if (input && connected && loggedIn && socket) {
      input = input.toLowerCase().trim();
      console.log(input);
      if(input.startsWith('say')) {
        socket.emit('say', {msg: input});
      } else if(input.startsWith('walk forward')) {
        socket.emit('walk forward', {});
      } else if(input.startsWith('walk left')) {
        socket.emit('walk left', {});
      } else if(input.startsWith('walk right')) {
        socket.emit('walk right', {});
      } else if(input.startsWith('swim forward')) {
        socket.emit('swim forward', {});
      } else if(input.startsWith('swim left')) {
        socket.emit('swim left', {});
      } else if(input.startsWith('swim right')) {
        socket.emit('swim right', {});
      } else if(input.startsWith('run forward')) {
        socket.emit('run forward', {});
      } else if(input.startsWith('run left')) {
        socket.emit('run left', {});
      } else if(input.startsWith('run right')) {
        socket.emit('run right', {});
      } else if(input.startsWith('turn left')) {
        socket.emit('turn left', {});
      } else if(input.startsWith('turn slight left')) {
        socket.emit('turn slight left', {});
      } else if(input.startsWith('turn hard left')) {
        socket.emit('turn hard left', {});
      } else if(input.startsWith('turn slight right')) {
        socket.emit('turn slight right', {});
      } else if(input.startsWith('turn hard right')) {
        socket.emit('turn hard right', {});
      } else if(input.startsWith('turn right')) {
        socket.emit('turn right', {});
      } else if(input.startsWith('turn around')) {
        socket.emit('turn around', {});
      } else if(input.startsWith('turn to face north')) {
        socket.emit('turn to face north', {})
      } else if(input.startsWith('turn to face south')) {
        socket.emit('turn to face south', {})
      } else if(input.startsWith('turn to face east')) {
        socket.emit('turn to face east', {})
      } else if(input.startsWith('turn to face west')) {
        socket.emit('turn to face west', {})
      } else if(input.startsWith('turn a little to the right')) {
        socket.emit('turn a little to the right', {})
      } else if(input.startsWith('turn a little to the left')) {
        socket.emit('turn a little to the left', {})
      } else if(input.startsWith('look')) {
        socket.emit('look', {});
      } else if(input.startsWith('sit down')) {
        socket.emit('sit down', {});
      } else if(input.startsWith('lay down')) {
        socket.emit('lay down', {});
      } else if(input.startsWith('stand up')) {
        socket.emit('stand up', {});
      } else if(input.startsWith('vibe check')) {
        socket.emit('vibe check')
      } else if(input.startsWith('commit suicide')) {
        socket.emit('suicide')
      } else if(input.startsWith('whisper')) {
        socket.emit('whisper', {msg: input})
      } else if(input.startsWith('yell')) {
        socket.emit('yell', {msg: input})
      } else if(input.startsWith('teleport to')) {
        socket.emit('teleport to', {msg: input})
      } else if(input.startsWith('ban')) {
        socket.emit('ban', {msg: input})
      } else if(input.startsWith('check patch notes')) {
        socket.emit('check patch notes', {})
      } else if(input.startsWith('punch')) {
        socket.emit('punch', {});
      } else if(input.startsWith('report')) {
        socket.emit('report', {});
      } else if(input.startsWith('?') || input.startsWith('help')) {
        // help_message();
      } else {
        addMessage(
          'Server',
          "Command not found",
          'start'
        );
      }
    }
  }

  if(!connected && socket) {
    socket.on('connect', function () {
      setConnected(true);
      console.log('Connected');
    });

    socket.on('disconnect', function () {
      setConnected(false);
      console.log('Disconnected');
    });

    socket.on('message', function(event) {
      if(event.login_success) {
        console.log("Login Successful");
        // stop listening for login success
        setLoggedIn(true);
        socket.removeListener('message');
        socket.on('message', (event) => {

          console.log(event);

          // TODO: display active user count in the UI
          
          // if(event.active_users !== null) {
          //   try {
          //     // log("Active users: " + event.active_users.toString());
          //     return;
          //   } catch {}
          // }

          if(event.data) {
            addMessage(
              'Server',
              event.data,
              'start'
            );
          }
        })
      } else {
        addMessage(
          'Server',
          'Authentication failure',
          'start'
        );
      }
    })
  }

  if(connected && !loggedIn && socket) {
    var state = location.state as CustomizedState;
    socket.emit('login', {
      sso_id: state.sso_id,
      email: state.email
    })
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

        addMessage(
          'You',
          value || '',
          'end'
        );
        sendMessage(value || '');
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
