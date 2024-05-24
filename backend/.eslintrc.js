module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'jest',
    'eslint-plugin-import-helpers',
  ],
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'comma-dangle': ['warn', 'only-multiline'],
    'no-cond-assign': ['error', 'always'], // always
    'no-constant-condition': 'off',
    'no-dupe-else-if': 'error',
    'no-useless-constructor': 'off',
    'no-useless-escape': 'error',
    'camelcase': 'error',

    'space-before-function-paren': ['error', 'always'],

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',

    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',

    'import/prefer-default-export': 'off',
    'import-helpers/order-imports': [
        'warn',
        {
            'newlinesBetween': 'always',
            'groups': [
                '/^@nestjs/', // nestjs imports
                ['module'], // third-party external imports
                '/^@/(?!test)/', // Custom modules imports without @test
                '/^@/test/', // @test module imports
                ['absolute', 'parent', 'sibling', 'index']
            ],
            'alphabetize': { 'order': 'asc', 'ignoreCase': true }
        }
    ],
  },
}
