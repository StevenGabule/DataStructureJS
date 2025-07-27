#!/bin/bash

npm init -y
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier

# Create ESLint config
cat > .eslintrc.js << EOF
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
};
EOF

# Create Prettier config
cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Create VS Code settings
mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ]
}
EOF

echo "ESLint and Prettier setup complete!"