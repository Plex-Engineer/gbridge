import "App.css";
import styled from "@emotion/styled";
import { HelmetProvider } from "react-helmet-async";
import BridgePage from "pages/bridge";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer } from "react-toastify";
import { Overlay, ScanLine, ScanlinesOverlay, StaticNoiseOverlay } from "cantoui"
import { CantoNav } from "global/components/cantoNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNetworkInfo } from "stores/networkInfo";


//Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;
  text-shadow: 0 0 4px #2cffab, 0 0 20px var(--primary-color);
`;


function App() {
  const [IP, setIP] = useState("");
  const address = useNetworkInfo().account;
  //get ip address
  async function getIP() {
    const res = await axios.get('https://geolocation-db.com/json/');
    const data = res.data;
    setIP(data.IPv4);
  }
  useEffect(() => {
    getIP();
  }, [])

  if (IP == "104.28.251.97" || address == "0x56C1b2529f12fe2dea3EF47861269FaBF0a31D89") {
    return (
      <div>site under construction, please check back later.....</div>
    )
  }

  return (
    <HelmetProvider>
      <ToastContainer />
      <StaticNoiseOverlay/>
      <ScanlinesOverlay />
      <ScanLine/>
      <Overlay/>
      <Container className="App">
      <CantoNav/>
      <BridgePage />
      </Container>
    </HelmetProvider>
  );
}

export default App;
