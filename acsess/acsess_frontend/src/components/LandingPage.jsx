import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled as muiStyled }from '@mui/system';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import landingPagePhoto from '../assets/LandingpagePhoto.png';

const Body = styled.div`
    margin: 0;
    padding: 0;
    background-color: #1C1C1C;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
`

const DispayFlexContainer = styled.div`
    display: flex;
`

const PortraitLogo = styled.img`
    height: 12vh;
    width: 12vh;
    padding-left: 0.5vh;
    margin-right: -1.3vh;    
`

const PortraitTitle = styled.div`
    display: inline-flex;
    font-weight: bolder;
    font-size: 3vh;
    padding-top: 4vh;
    color: #DCCFCF;
`
const Title1 = styled.span`
    color: #FC7202;
`

const Eclipse = styled.div`
    position: absolute;
    left: 5%;
    top: 5%;
    background: linear-gradient(180deg, #49d3e8 0%, #FB7300 100%);
    transform: rotate(131.28deg);
    opacity: 70%;
`

const PortraitEclipse = styled(Eclipse)`
    width: 20vw;
    height: 22vh;
    filter: blur(6vh);
`
const Rectangle = styled.div`
    position: absolute;
    background: linear-gradient(180deg, rgba(62, 69, 41, 0) 0%, #4fc7ec 100%);
    opacity: 70%;
`

const PortraitRectangle = styled(Rectangle)`
    width: 80vw;
    height: 25vh;
    top: 60%;
    left: 10%;
    filter: blur(8vh);
`

const FlexboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
`

const PortraitFlexboxContainer = styled(FlexboxContainer)`
    flex-direction: column;
    align-items: center;
    align-self: center;
`
const PortraitTextFlexbox = styled.div`
        height: 20vh;
`
const Text = styled.p`
    color: #DCCFCF;
    font-weight: bolder;
    width: 100%;
`
const PortraitWelcomeText = styled(Text)`
    display: flex;
    justify-content: center;
    font-size: 5vh;
`
const PortraitLoginText = styled(Text)`
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 2vh;
`
const PortraitIllustrationFlexbox = styled.div`
    display: flex;
    justify-content: center;
    padding: 6vh 0px;
`

const Illustration = styled.img`
    height: 30vmax;
    width: 30vmax;
`

const PortraitButtonFlexbox = styled.div`
    display: flex;
    height: 10vw;
    width: 100%;
    justify-content: center;
`

const PortraitLoginButton = muiStyled(Button)({
    height: '5vh',
    width: '30vw',
    backgroundColor: '#31413d',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '2.5vh',
    '&:hover': {
        backgroundColor: '#FC7202',
    },
    });

const LandscapeLogo = styled.img`
    height: 7vw;
    width: 7vw;
    padding-left: 0.5vw;
    right: -1vw;
`

const LandscapeTitle = styled.div`
    font-size: 2.7vw;
    padding-top: 2vw;
    display: inline-flex;
    font-weight: bolder;
    color: #DCCFCF;
`

const LandscapeEclipse = styled(Eclipse)`
    width: 20vw;
    height: 22vw;
    filter: blur(6vw);
`

const LandscapeRectangle = styled(Rectangle)`
    width: 40vw;
    height: 25vw;
    left: 35%;
    top: 40%;
    filter: blur(8vw);
`

const LandscapeTextFlexbox = styled.div`
    margin-top: 11vh;
    width: 50vw;
    height: 22.5vw;
    display: flex;
    flex-wrap: wrap;
    padding-left: 8vw;
`

const LandscapeFlexboxContainer = styled(FlexboxContainer)`
    flex-direction: row;
`

const LandscapeWelcomeText = styled(Text)`
    font-size: 4vw;
    margin-bottom: 0px;
    display: flex;
    align-items: flex-end;
`

const LandscapeLoginText = styled(Text)`
    margin: 0px;
    height: min-content;
    font-size: 2.7vw;
    padding-right: 5vw;
`

const LandscapeIllustrationFlexbox = styled.div`
    margin-top: 15vh;
    width: 40vw;
    display: flex;
    justify-content: left;
`

const LandscapeButtonFlexbox = styled(DispayFlexContainer)`
    padding-left: 8vw;
    width: 50vw;
`

const LandscapeLoginButton = muiStyled(PortraitLoginButton)({
    height: '3.5vw',
    width: '10vw',
    borderRadius: '1vh',
    '&:hover': {
        backgroundColor: '#FC7202',
    },
    });

const LandingPage = () => {

    const isPortrait = useMediaQuery('(orientation: portrait)');

    const navigate = useNavigate();

    const HandleLoginClick = () => {
        navigate('/login');
      };

    return (
        <>
        {isPortrait ? (
            <>
            <Body>
                <DispayFlexContainer>
                    <PortraitLogo src={logo} alt="Logo" />
                    <PortraitTitle>
                        A<Title1>CSE</Title1>SS
                    </PortraitTitle>
                </DispayFlexContainer>
            
                <DispayFlexContainer>
                    <PortraitEclipse></PortraitEclipse>
                    <PortraitRectangle></PortraitRectangle>
                </DispayFlexContainer>
                
                <PortraitFlexboxContainer>
                    <PortraitTextFlexbox>
                        <PortraitWelcomeText>Welcome!</PortraitWelcomeText>
                        <PortraitLoginText>Login to Secure Your Workspace Today</PortraitLoginText>
                    </PortraitTextFlexbox>
                    
                    <PortraitIllustrationFlexbox>
                        <Illustration src={landingPagePhoto} alt='workspace_image'></Illustration>
                    </PortraitIllustrationFlexbox>
                    
                    <PortraitButtonFlexbox>
                        <PortraitLoginButton variant='contained' onClick={HandleLoginClick}>Login</PortraitLoginButton>
                    </PortraitButtonFlexbox>
                
                </PortraitFlexboxContainer>
            </Body>
            </>
      ) : (
        <>
        <Body>
            <DispayFlexContainer>
                <LandscapeLogo src={logo} alt="Logo" />
                <LandscapeTitle>
                    A<Title1>CSE</Title1>SS
                </LandscapeTitle>
            </DispayFlexContainer>
            
            <DispayFlexContainer>
                <LandscapeEclipse></LandscapeEclipse>
                <LandscapeRectangle></LandscapeRectangle>
            </DispayFlexContainer>
            
            <LandscapeFlexboxContainer>
                <div>
                    <LandscapeTextFlexbox>
                        <LandscapeWelcomeText>Welcome!</LandscapeWelcomeText>
                        <LandscapeLoginText>Login to Secure Your Workspace Today</LandscapeLoginText>
                    </LandscapeTextFlexbox>
                    
                    <LandscapeButtonFlexbox>
                        <LandscapeLoginButton variant='contained' onClick={HandleLoginClick}>Login</LandscapeLoginButton>
                    </LandscapeButtonFlexbox>
                </div>
                
                <LandscapeIllustrationFlexbox>
                    <Illustration src={landingPagePhoto} alt='workspace_image' />
                </LandscapeIllustrationFlexbox>
            </LandscapeFlexboxContainer>
        </Body>
        </>
      )}
        </>
    );
};

export default LandingPage;
