# Snake Game 🐍

A classic Snake game built with React and TypeScript. This project features a dynamic game board, smooth animations, and interactive gameplay with keyboard controls.

## Table of Contents

- [Snake Game 🐍](#snake-game-)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [How to Play](#how-to-play)
    - [Controls](#controls)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [Future Improvements](#future-improvements)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Playable Snake game with real-time updates
- Responsive canvas that adjusts to different screen sizes
- Pause and resume functionality with spacebar
- Score tracking and loot spawning
- Automatically wraps around the edges of the screen
- Simple collision detection for snake-body and loot interaction.
- Game Over state with blinking effect

## How to Play

- Press `Space` to start or pause the game.
- Use the arrow keys to control the snake's direction.
- The snake grows each time it eats the loot (yellow block).
- The game ends if the snake collides with itself.

### Controls

- **Spacebar**: Start/Pause the game
- **W**: Move Up
- **A**: Move Left
- **S**: Move Down
- **D**: Move Right


## Technologies

- **React**: Frontend library for building the user interface.
- **TypeScript**: Superset of JavaScript that adds type safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Canvas API**: Used for rendering game graphics.

## Installation

To get started with the Snake game, follow these steps:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/snake-game.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd snake-game
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

## Usage

To start the development server, run:

```bash
npm start
```

Open http://localhost:3000 in your browser to play the game.

To build the project for production, run:

```bash
npm run build
```

To deploy the built project to GitHub Pages, run:

```bash
npm run deploy
```

## Project Structure

- **src/**
  - **components/**
    - `GameContainer.tsx`: Manages game state and controls.
    - `GameBoard.tsx`: Renders the game board and handles canvas drawing.
    - `PauseOverlay.tsx`: Displays when the game is paused.
    - `InstructionsOverlay.tsx`: Displays game instructions.
  - **hooks/**
    - `useAnimation.ts`: Manages animation frames for smooth movement.
    - `useSnake.ts`: Handles snake state, movement, and collisions.
  - **utils/**
    - `index.ts`: Contains utility functions for game logic.
  - `App.tsx`: Main application component.
  - `index.tsx`: Entry point for the React application.
- **public/**
  - `index.html`: HTML template for the React app.
- `package.json`: Project metadata and dependencies.
- `tsconfig.json`: TypeScript configuration.

## Future Improvements

- Add difficulty levels (e.g., increase snake speed as it grows).
- Introduce mobile touch support for snake movement.

## Contributing

Feel free to fork this project and open a pull request to contribute. Suggestions and bug reports are welcome!

1. **Fork the Repository**

2. **Create a Feature Branch**

    ```bash
    git checkout -b feature/new-feature
    ```

3. **Commit Your Changes**

    ```bash
    git commit -am 'Add new feature'
    ```

4. **Push to the Branch**

    ```bash
    git push origin feature/new-feature
    ```

5. **Open a Pull Request**

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
