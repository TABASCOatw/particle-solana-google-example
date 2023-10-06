import React, { useEffect, useState } from 'react';
import { Button, notification } from 'antd';
import { ParticleNetwork } from '@particle-network/auth';
import bs58 from 'bs58';

import './App.css';

const particle = new ParticleNetwork({
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  clientKey: process.env.REACT_APP_CLIENT_KEY as string,
  appId: process.env.REACT_APP_APP_ID as string,
  chainName: 'solana',
  chainId: 101,
});

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    if (!particle.auth.isLogin()) {
      await particle.auth.login({ preferredAuthType: 'google' });
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    await particle.auth.logout();
    setIsLoggedIn(false);
    notification.success({
      message: "Logged out",
    });
  };

  const handleSignMessage = async () => {
    await particle.solana.signMessage(bs58.encode(new TextEncoder().encode('GM, Particle!')));
    notification.success({
      message: "Message signed",
    });
  };

  useEffect(() => {
    particle.auth.on('connect', (userInfo: any) => {
      setIsLoggedIn(true);
      notification.success({
        message: "Logged in",
        description: `Connected: ${JSON.stringify(userInfo)}`,
      });
    });
  }, []);

  return (
    <div className="App">
      {!isLoggedIn && <Button onClick={handleLogin}><img src="https://i.imgur.com/mmDmdwY.png" alt="Google Logo" style={{ width: '20px', marginRight: '8px' }} />Sign in with Google</Button>}
      {isLoggedIn && (
        <>
          <Button onClick={handleSignMessage}>Sign a Message</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      )}
    </div>
  );
};

export default App;