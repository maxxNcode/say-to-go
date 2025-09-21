# Contributing to SAY TO GO

Thank you for your interest in contributing to SAY TO GO! This document provides guidelines and information to help you contribute effectively.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Be collaborative and helpful
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the [issue tracker](https://github.com/maxxNcode/SAYTOGO/issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Detailed steps to reproduce the problem (for bugs)
   - Expected and actual behavior
   - Browser and operating system information
   - Screenshots if applicable

### Suggesting Enhancements

We welcome ideas for new features or improvements:

1. Check the existing issues to see if your idea has already been suggested
2. Create a new issue describing:
   - The enhancement you'd like to see
   - Why it would be useful
   - How it might be implemented (if you have ideas)

### Code Contributions

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/SAYTOGO.git
   ```
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Setup

1. Ensure you have a modern web browser installed (Chrome or Edge recommended)
2. No build tools are required - the project uses vanilla HTML, CSS, and JavaScript
3. To test locally, simply open `index.html` in your browser or use a local server

#### Coding Standards

- Follow existing code style and conventions
- Write clear, commented code
- Keep functions focused and modular
- Use descriptive variable and function names
- Test your changes thoroughly

#### Making Changes

1. Make your changes in your feature branch
2. Test your changes in multiple browsers if possible
3. Commit your changes with a clear, descriptive commit message:
   ```bash
   git commit -m "Add feature: description of what you did"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

#### Submitting a Pull Request

1. Open a pull request from your fork to the main repository
2. Provide a clear title and description of your changes
3. Reference any related issues (e.g., "Fixes #123")
4. Be responsive to feedback during the review process

## Development Guidelines

### Project Structure

```
SAYTOGO/
├── index.html          # Main HTML structure
├── button-inspiration.css  # UI styling and animations
├── script.js           # Main application logic
├── README.md           # Project documentation
├── USAGE.md            # Usage instructions
├── TROUBLESHOOTING.md  # Problem solving guide
├── FEATURES.md         # Feature documentation
├── API.md              # API documentation
├── CONTRIBUTING.md     # This file
└── LICENSE             # License information
```

### JavaScript Guidelines

- Use modern ES6+ features where appropriate
- Maintain existing code patterns and structure
- Add error handling for API calls and user interactions
- Keep functions small and focused
- Comment complex logic

### CSS Guidelines

- Use CSS variables for consistent theming
- Maintain the existing animation and transition styles
- Ensure responsive design works on all screen sizes
- Use semantic class names

### HTML Guidelines

- Maintain semantic HTML structure
- Use appropriate accessibility attributes
- Keep the structure clean and organized

## Testing

### Manual Testing

Before submitting your changes, please test:

1. Voice recognition functionality
2. Location search and geocoding
3. 360° viewer loading and navigation
4. UI elements and animations
5. Error handling and edge cases
6. Responsive design on different screen sizes

### Browser Testing

Test your changes in:
- Google Chrome (primary support)
- Microsoft Edge (primary support)
- Firefox (limited support)
- Safari (limited support)

## Documentation

When adding new features or making significant changes:

1. Update the README.md if necessary
2. Add or modify documentation files as needed
3. Update comments in the code to explain new functionality
4. Ensure all documentation is clear and accurate

## Pull Request Process

1. Ensure your code follows the guidelines above
2. Update documentation if you've changed functionality
3. Add comments to your code where necessary
4. Submit your pull request with a clear description
5. Respond to any feedback during the review process

## Community

### Getting Help

If you need help with your contribution:

1. Check the documentation in the repository
2. Look at existing code for examples
3. Ask questions in your pull request
4. Create an issue if you're stuck

### Recognition

Contributors will be recognized in:
- The GitHub contributors list
- Release notes for major updates
- This documentation file (for significant contributions)

## License

By contributing to SAY TO GO, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, feel free to:
1. Create an issue with your question
2. Contact the project maintainer directly

Thank you for helping make SAY TO GO better!