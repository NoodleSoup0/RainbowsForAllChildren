import React, { createContext, useEffect, useState } from 'react';
import * as Font from 'expo-font';

const CustomFontContext = createContext({});

export const CustomFontProvider = ({ children }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'CustomFontName': require('../assets/fonts/Lato-Regular.ttf'),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // Optional: Show a loading indicator while the font is loading
  }

  const customFontStyle = {
    fontFamily: 'CustomFontName',
  };

  return (
    <CustomFontContext.Provider value={{ customFontStyle }}>
      {children}
    </CustomFontContext.Provider>
  );
};
