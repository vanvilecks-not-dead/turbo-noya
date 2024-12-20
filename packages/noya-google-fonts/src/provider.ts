import { FontDescriptor, FontFamilyId, FontProvider } from '@repo/noya-fonts';
import { FontRegistry } from './FontRegistry';
import { GoogleFontList } from './types';
import { decodeGoogleFontVariant, encodeGoogleFontVariant } from './variant';

import webfontList from './fonts.json';

const fontRegistry = new FontRegistry(webfontList.items);

function getFontDefinition(fontFamilyID: FontFamilyId) {
  return fontRegistry.getFont(fontFamilyID);
}

export const GoogleFontProvider: FontProvider = {
  getFontFamilyIdList() {
    return fontRegistry.fontFamilyIds;
  },

  getFontFamilyId(fontFamily: string) {
    return fontRegistry.findFontFamilyId(fontFamily);
  },

  getFontFamilyName(fontFamilyId: FontFamilyId) {
    return fontRegistry.getFont(fontFamilyId)?.family;
  },

  getFontFileUrl(descriptor: FontDescriptor) {
    const fontVariant = encodeGoogleFontVariant(
      descriptor.fontSlant,
      descriptor.fontWeight,
    );

    const url = getFontDefinition(descriptor.fontFamilyId)?.files[fontVariant];

    if (!url) return;

    return url.replace(/^http:\/\//, 'https://');
  },

  getFontDescriptorsForFamily(fontFamilyId: FontFamilyId) {
    const definition = getFontDefinition(fontFamilyId);

    if (!definition) return [];

    return definition.variants.map((variant) => ({
      fontFamilyId: fontFamilyId,
      ...decodeGoogleFontVariant(variant),
    }));
  },
};
