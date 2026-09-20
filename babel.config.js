module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@config': './src/config',
            '@core': './src/core',
            '@modules': './src/modules',
            '@features': './src/features',
            '@ui': './src/ui',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@constants': './src/constants',
          },
        },
      ],
    ],
  };
};
