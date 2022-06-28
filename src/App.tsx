import { useState, useEffect, useRef, ReactNode } from "react";
import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grommet,
  Layer,
  ResponsiveContext,
  TextInput,
  Tag,
  BoxExtendedProps
} from 'grommet';
import { FormClose, Notification } from 'grommet-icons';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';


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
  const [showSidebar, setShowSidebar] = useState<boolean>();
  const [value, setValue] = useState<string>();
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState<Array<{ name: string, message: string }>>(() => {
    return [];
  });

  const Messages = () => {
    var ret;
    if(messages === undefined) return;
    for(var i = 0; i < messages.length; i++) {
      ret = [ret,
        <Box key={i} pad={{horizontal: "xlarge", top: "large"}}>
          <Tag name={messages[i]['name']} value={messages[i]["message"]} />
        </Box>
      ];
    }
    return ret;
  }

  const InputBox = () => {
    const handleKeyDown = (event: { key: string; }) => {
      if(messages === undefined) return;
      if (event.key === 'Enter') {
        setMessages(messages.concat([{name: "You", message: value || ''}]));
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
      <ResponsiveContext.Consumer>
        {size => (
          <Box fill>
            <AppBar>
              <Heading level='3' margin='none'>TextMMO</Heading>
              <Button
                icon={<Notification />}
                onClick={() => setShowSidebar(!showSidebar)}
              />
              </AppBar>
              <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                <Box fill>
                    {LoginPage()}
                  <Box fill overflow={{vertical: "scroll"}}>
                    {Messages()}
                    <div ref={bottomRef} />
                  </Box>
                  <Box as="footer" flex={false} pad={{horizontal: "medium", bottom: "large"}}>
                    {InputBox()}
                  </Box>
                </Box>
                {(!showSidebar || size !== 'small') ? (
                  <Collapsible direction="horizontal" open={showSidebar}>
                  <Box
                    flex
                    width='medium'
                    background='light-2'
                    elevation='small'
                    align='center'
                    justify='center'
                  >
                    sidebar
                  </Box>
                  </Collapsible>
                 ): (
                  <Layer>
                     <Box
                      background='light-2'
                      tag='header'
                      justify='end'
                      align='center'
                      direction='row'
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => setShowSidebar(false)}
                      />
                    </Box>
                    <Box
                      fill
                      background='light-2'
                      align='center'
                      justify='center'
                    >
                      sidebar
                    </Box>
                  </Layer>
                 )}
              </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
