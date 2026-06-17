import tailwind from '@astrojs/tailwind';

export default {
  integrations: [tailwind()],
  site: 'https://meath-bowling-club.example',
  markdown: {
    syntaxHighlight: 'shiki'
  }
};
