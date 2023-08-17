import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  accent: '#FF7363',

  black: '#171717',
  white: '#FFFFFF',
  grey: '#F5F5F5',
  background: '#252C4A',

  darkblue: '#0C4164',
  lightblue: '#00B2E4',
  paleblue: 'rgba(12, 65, 100, 0.2)',
  grey_transparent: 'rgba(70, 70, 70, 0.5)',
};

export const SIZES = {
  base: 10,
  width,
  height,

  pageheader_font: 25,
  pageheader_height: 120,
  heading_font: 17,
  subheading_font: 15,

};
