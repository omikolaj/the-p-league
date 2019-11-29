module.exports = {
	env: {
		browser: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
		'prettier/@typescript-eslint'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', '@typescript-eslint/tslint', 'import', 'prettier'],
	rules: {		
		'@typescript-eslint/tslint/config': [
			'off',
			{
				lintFile: './tslint.json'
			}
		],
		'prettier/prettier': 'error',
		'@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
		'object-curly-spacing': ['error', 'always'],
		'spaced-comment': ['error', 'always'],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: false
			}
		],
		'lines-around-comment': ['error', { beforeBlockComment: true }],
		'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
		'eqeqeq': ['error', 'always'],
		'@typescript-eslint/no-empty-function': ['error', { 'allow': ['constructors', 'methods'] }],
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/no-unused-vars': ['off', { 'vars': 'local' }]
	}
};
