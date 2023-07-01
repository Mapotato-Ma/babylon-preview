// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { VBtn } from 'vuetify/components/VBtn';
import { VIcon } from 'vuetify/components/VIcon';
import { VProgressLinear } from 'vuetify/components/VProgressLinear';
import * as directives from 'vuetify/directives';

// icons
import { mdiPause, mdiPlay } from '@mdi/js';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      pause: mdiPause,
      play: mdiPlay,
    },
    sets: {
      mdi,
    },
  },
  components: {
    VBtn,
    VIcon,
    VProgressLinear,
  },
  directives,
});
