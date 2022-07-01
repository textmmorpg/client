import { useState, useEffect, useRef, ReactNode } from "react";
import {
  Box,
  Page,
  PageContent,
  Grommet,
  Layer,
  Text,
  Heading,
  PageHeader,
  Anchor,
  Button,
  Image
} from 'grommet';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';


const theme = {
    global: {
      colors: {
        brand: '#809bce',
        background: '#809bce',
        placeholder: '#000000'
      },
      font: {
        size: '18px',
        height: '20px',
      },
    },
};

function Login() {


  const LoginPage = () => {
    //setShow(false) on successful login

    return <GoogleLogin
      theme={'filled_blue'}
      onSuccess={credentialResponse => {
        console.log(credentialResponse);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />;
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
                <Box margin="medium">
                    {LoginPage()}
                </Box>
            </Box>
        </Box>
      </Layer>
    </Grommet>
  );
}

export default Login;
