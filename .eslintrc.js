module.exports = {
    "parser": "babel-eslint",
    "rules": {
        "strict": 0,
        "no-console": ["error", { allow: ["warn", "error"] }],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ]
};