#include <Arduino.h>

const uint8_t SymbolFontBitmaps[] PROGMEM = {
//00 Test square
/*| 8 4 2 1 8 4 2 1 8 4 2 1 8 4 2 1 |*/
/*| . . . X X . . , . . X X . . . . |*/  0x18,0x30,
/*| . X X X X X . , . X X X X X . . |*/  0x7c,0x7c,
/*| X X X X X X X , X X X X X X X . |*/  0xfe,0xfe, 
/*| X X X X X X X X X X X X X X X . |*/  0xff,0xfe,
/*| X X X X X X X X X X X X X X X . |*/  0xff,0xfe,
/*| . X X X X X X X X X X X X X . . |*/  0x7f,0xfc,
/*| . X X X X X X X X X X X X X . . |*/  0x7f,0xfc,
/*| . . X X X X X X X X X X X . . . |*/  0x3f,0xf8,
/*| . . X X X X X X X X X X X . . . |*/  0x3f,0xf8,
/*| . . . X X X X X X X X X . . . . |*/  0x1f,0xf0,
/*| . . . . X X X X X X X . . . . . |*/  0x0f,0xe0,
/*| . . . . . X X X X X . . . . . . |*/  0x07,0xc0,
/*| . . . . . . X X X . . . . . . . |*/  0x03,0x80,
/*| . . . . . . . X . . . . . . . . |*/  0x01,0x00,


//   Empty array for future expansion
/*| 8 4 2 1 8 4 2 1 8 4 2 1 8 4 2 1 |*/
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
/*| . . . . . . . , . . . . . . . . |*/  0x00,0x00,
0x00};//One more byte just in case

const GFXglyph SymbolFontGlyphs[] PROGMEM = {
  //Index,  W, H,xAdv,dX, dY
  {     0, 16,14, 21, -7,-7} // 00 HEART
  };
  //Index,  W, H,xAdv,dX, dY
const GFXfont SymbolFont PROGMEM = {
  (uint8_t  *)SymbolFontBitmaps,
  (GFXglyph *)SymbolFontGlyphs,
  0,48, 35 //ASCII start, ASCII stop,y Advance
};
#define SYMBOL_HEART 0