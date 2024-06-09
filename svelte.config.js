import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

export default {
  preprocess: [vitePreprocess(), preprocess()],
  resolve: {
    alias: {
      'flowbite-svelte': resolve('node_modules/flowbite-svelte/src/index.js'),
    },
  },
};