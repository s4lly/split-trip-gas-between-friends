import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    tags: [
      { tag: 'script', attrs: { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCS_NtCeqwe6chb3HQzXKH63L-o1whkB1U&libraries=places' } },
    ],
  }
});
