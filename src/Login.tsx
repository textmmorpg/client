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

function Login() {
  const [value, setValue] = useState<string>();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<{ name: string, message: string, align: AlignSelfType }>>(() => {
    return [];
  });


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
    <Grommet theme={theme}>
      <Layer full={true} modal={false} animate={false}>
        <Box direction='column' flex align="center" pad={{horizontal: "xlarge", vertical: "xlarge"}}>
        {LoginPage()}
        </Box>
      </Layer>
    </Grommet>
  );
}

export default Login;
