# Game of Three

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Requirements

> The Goal is to implement a game with two independent units – the players – communicating with each other using an API.
>
> When a player starts, they incept a random (whole) number and send it to the second player to start the game.
> The receiving player can then choose between adding one of {-1,0,1} to get to a divisible by 3 number.
> The resulting whole number is then sent back to the original sender.
>
> The same rules are applied until one player reaches the number 1 after the division.
> See the example below.
>
> Also feel free to use the provided [invision](https://invis.io/JHN2247E9MK) design screens and assets.
>
> For each "move" a sufficient output should be generated (mandatory: the added and the resulting number).
>
> Both players should be able to play automatically without user input. One of the players should optionally be adjustable by a user.
>
> ### Notes
>
> - Each player runs on its own (independent programs, two browsers, web‐workers, or a choice of your own).
> - Communication via an API (REST, Sockets, WebRTC, or a choice of your own).
> - A player may not be available when the other one starts.
> - Try to be platform-independent, in other words, the project must be runnable easily in every environment.
> - Please share your project on GitHub and send us the link.
>
> ### Extras
>
> - Implementing a fancy UI using (and improving) provided design
> - Unit Tests
> - Using React with Redux

## Solution

1. **[Understand the problem](#1-understand-the-problem)**
2. **[Design](#2-design)**
3. **[Implementation](#3-implementation)**

### 1. Understand the problem

#### Rules of the game

The game requires two players.

At the beginning of the game, a random whole number (`positive integer`) is generated and provided to the starting player.

At each turn a calculation is performed. `new value = (previous value + player choice) / three`.

The player is required to choose a number among three options: (`-1`), (`0`), (`+1`).

The selected number is then added to the outcome of the previous turn and then divide by three.

The player should carefully choose an option so that the operation will yield a new valid whole number (`positive integer`).

The player loses if the sum of the previous value and the player choice is not divisible by three.

The player wins if the operation yields `1`.

Otherwise, the turns end and the result of the operation is passed on to the next player.

#### User stories

<!--
User story templates:
- As a <role> I can <capability>, so that <receive benefit>
- In order to <receive benefit> as a <role>, I can <goal/desire>
- As <who> <when> <where>, I <want> because <why>
-->

##### 1. "Game of three"

As a user, I would like to play the "game of three" online against one other player.

##### 2. Player profile

As a user, I can create a player profile so that I can be more easily recognized by other players.
I can customize my Player profile with a custom nickname.

##### 3. Play against another user

As a user, I would like to play against another user.

##### 4. Play against an AI

In order to not have to wait for another user to join the lobby, I can play against an AI.

##### 5. Play optionally without user input

As a lazy user, I would like to be able to play a turn or a match without having to provide any additional input.

#### Technology constraints

Programming language:

- TypeScript

Application components:

- client,
- server,
- UI library

Repository:

- public GitHub
- mono-repository

Client:

- has to be a SPA
- that uses React as UI library,
- that uses Redux as a state management solution

Server:

- is a Node API
- that talks to the clients with WebSocket

UI library:

- a react component library
- managed with Storybook

### 2. Design

These are the semantic pieces that I used to define the domain model:

### 3. Implementation

## How to run it:

Check the [INSTRUCTIONS.md](INSTRUCTIONS.md) file to learn how to get you a copy of the project up and running on your local machine.

## Notes
