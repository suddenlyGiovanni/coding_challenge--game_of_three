module.exports = {
  coverageDirectory: '../../coverage/apps/client',
  displayName: 'client',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { configFile: './babel-jest.config.json', cwd: __dirname },
    ],
  },
}
