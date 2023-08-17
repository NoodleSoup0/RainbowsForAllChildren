import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CustomFontProvider } from './shared/CustomFontProvider';
import Tabs from './navigation/tabs';


const App = () => {
  return (
    <CustomFontProvider>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </CustomFontProvider>
  );
};

export default App;
