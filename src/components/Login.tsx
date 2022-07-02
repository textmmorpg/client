import {
  Box,
  Grommet,
  Layer,
  PageHeader,
  Anchor,
  Image,
  Spinner,
  Text,
  Button
} from 'grommet';
import '../App.css';
import { StatusGood } from 'grommet-icons';
import { GoogleLogin } from '@react-oauth/google';
import { Navigate, useNavigate } from "react-router-dom";
import io, { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react';


const theme = {
    global: {
      colors: {
        brand: '#809bce',
        background: '#809bce',
        placeholder: '#000000',
        good: '#37eb34'
      },
      font: {
        size: '18px',
        height: '20px',
      },
    },
};

function decodeJwtResponse(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

function Login() {

  const [socket, setSocket] = useState<Socket>();
  const [connected, setConnected] = useState<boolean>(() => {
    return false;
  });

  const navigate = useNavigate();

  useEffect(() => {
    connect();
  }, []);
  
  function connect() {
    if(window.location.hostname === 'textmmo.com') {
        setSocket(io('https://textmmo.com/', {
            secure:true, transports: ['websocket']
        }));
    } else {
        setSocket(io('http://localhost:8080/', {}));
    }
  }
  
  function LoginPage(navigate: any) {

    if(!connected) return <Spinner margin={{horizontal: 'medium'}}/>;
  
    return <GoogleLogin
      theme={'filled_blue'}
      onSuccess={credentialResponse => {
        console.log('Login Success from Google');
        const responsePayload = decodeJwtResponse(credentialResponse['credential'] || '');
        var sso_id = responsePayload.sub;
        var email = responsePayload.email;
  
        navigate("/app", {
          state: {email, sso_id}
        });
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />;
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
  }

  return (
    <Grommet theme={theme}>
      <Layer full={true} modal={false} animate={false}>
        <Box direction='row'>
            <Box fill>
                <Image 
                    fill={'vertical'}
                    alignSelf='stretch'
                    src="./terrain.png"
                />
            </Box>
            <Box fill>
                <PageHeader
                    title="Text MMO"
                    subtitle="A multiplayer text adventure game"
                    parent={<Anchor label="Learn More" href="https://github.com/beefy/textmmo/wiki"/>}
                    margin="medium"
                />
                <Box fill margin="medium">
                    {LoginPage(navigate)}
                </Box>
                <Box as='footer' flex={false} direction='row' alignSelf="center" margin={{vertical: 'medium'}}>
                  {!connected?
                    <Box direction='row'>
                      <Text>Connecting to server</Text>
                      <Spinner margin={{horizontal: 'medium'}}/>
                    </Box>
                  :
                    <Box direction='row'>
                      <Text margin={{horizontal: 'small'}}>Connected to server</Text>
                      {<StatusGood color='good'/>}
                    </Box>
                  }

                </Box>
            </Box>
        </Box>
      </Layer>
    </Grommet>
  );
}

export default Login;
