import "App.css";
import styled from "@emotion/styled";
import NavBar from "components/navbar";

import { HelmetProvider } from "react-helmet-async";
import BridgePage from "pages/bridge";
import bgNoise from "assets/bg-noise.gif";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer } from "react-toastify";



//Styling

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;

  text-shadow: 0 0 4px #2cffab, 0 0 20px var(--primary-color);


`;


//View

function App() {

  return (
    <HelmetProvider>
      <ToastContainer />
        <Container className="App">
          <NavBar/> 
          <BridgePage />
        </Container>
    </HelmetProvider>
  );
}



export default App;
