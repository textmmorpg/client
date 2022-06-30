import { useState, useEffect, useRef, ReactNode } from "react";
import {
  Box,
  Button,
  Heading,
  Grommet,
  TextInput,
  Text,
  BoxExtendedProps,
  Nav
} from 'grommet';
import { Notes, Github } from 'grommet-icons';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { AlignSelfType } from "grommet/utils";


const theme = {
  global: {
    colors: {
      brand: '#228BE6'
    },
    font: {
      family: 'Roboto',
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

function App() {
  const [value, setValue] = useState<string>();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<{ name: string, message: string, align: AlignSelfType }>>(() => {
    return [];
  });

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  // add intro message
  if(messages.length === 0) {
    setMessages(messages.concat([{
      name:'Server',
      message: "This is a multiplayer text adventure game! " +
        "Type commands to interact with the world and other players. " +
        "For example, type 'walk forward' to walk, 'turn right' to turn, etc. " +
        "Use 'say hello' to say hello to players around you. Use 'look' or 'vibe check' to " +
        "examine your immediate environment. Sign in to get started!",
      align:'start'
    }]));
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

  const LoginPage = () => {
    //setShow(false) on successful login

    return <GoogleLogin
      onSuccess={credentialResponse => {
        console.log(credentialResponse);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />;
  }

  return (
    <Grommet theme={theme} full>
        <Box fill>
          <AppBar>
            <Heading level='3' margin='none'>TextMMO</Heading>
            <Nav direction='row'>
              <Button tip='source code' alignSelf='end' icon={<Github />} onClick={() => window.location.href = "https://github.com/textmmorpg"}/>
              <Button tip='documentation' alignSelf='end' icon={<Notes />} onClick={() => window.location.href = "https://github.com/textmmorpg"}/>
            </Nav>
          </AppBar>
          <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
            <Box>
              <Box flex direction='column' overflow={{vertical: "scroll"}}>
                <Box direction='column' flex align="center" pad={{horizontal: "xlarge", vertical: "xlarge"}}>
                  {LoginPage()}
                </Box>
                {Messages()}
                <div ref={bottomRef} />
              </Box>
              <Box as="footer" flex={false} pad={{horizontal: "medium", vertical: "large"}}>
                {InputBox()}
              </Box>
            </Box>
          </Box>
        </Box>
    </Grommet>
  );
}

export default App;
