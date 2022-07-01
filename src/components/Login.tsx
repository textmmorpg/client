import {
  Box,
  Grommet,
  Layer,
  PageHeader,
  Anchor,
  Image,
  Spinner,
  Text
} from 'grommet';
import '../App.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";


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


  const navigate = useNavigate();
  const LoginPage = () => {

    function decodeJwtResponse(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    return <GoogleLogin
      theme={'filled_blue'}
      onSuccess={credentialResponse => {
        console.log('Login Success from Google');
        const responsePayload = decodeJwtResponse(credentialResponse['credential'] || '');
        var sso_id = responsePayload.sub;
        var email = responsePayload.email;

        navigate("/app", {
          state: {
            sso_id,
            email
          },
        });
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
                <Box fill margin="medium">
                    {LoginPage()}
                </Box>
                <Box as='footer' flex={false} direction='row' alignSelf="center" margin={{vertical: 'medium'}}>
                  <Text>Connecting to server</Text>
                  <Spinner margin={{horizontal: 'medium'}}/>
                </Box>
            </Box>
        </Box>
      </Layer>
    </Grommet>
  );
}

export default Login;
