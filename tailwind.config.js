/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      colors:{
       'primary':'#003d9b',
        'primaryContainer':'#0052CC',
        'surfaceHighest':'#D7E2FF',
        'surfaceLow':'#F1F3FF',
        'Background':'#F9F9FF',
        'darkGray':'#041B3C',
        'graay':'#4F5F7B',
        'lightGray':'#C3C6D6',
      },
       fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize:{
      "display-lg":['56px',{
        fontWeight:'700',
        lineHeight:'56px',
         letterSpacing: '-2.8px',
      }], 
      "headline-lg":['32px',{
        fontWeight:'600',
        lineHeight:'40px',
         letterSpacing: '0px',
      }],
       "titel-md":['18px',{
        fontWeight:'500',
        lineHeight:'27px',
         letterSpacing: '0px',
      }], 
      "body-md":['14px',{
        fontWeight:'400',
        lineHeight:'22.75px',
         letterSpacing: '0px',
      }],
       "label-sm":['11px',{
        fontWeight:'700',
        lineHeight:'16.5px',
         letterSpacing: '1.1px',
      }],
    }
  },
  plugins: [],
}}