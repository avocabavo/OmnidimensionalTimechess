# Omnidimensional Timechess

This is a turnkey downloadable version of timechess.avomath.com

## Sources

Omnidimensional Timechess is inspired by the boardgame 'Timeline' by George Marino.

This project makes extensive use of [THREE.js](https://threejs.org).

Starfield skybox was generated with [this utility](https://wwwtyro.github.io/space-3d/)

## Installation

This repository is meant to be a turnkey system that can be downloaded, used and modified just by copying all the files from this repository into the same folder. Serve the files however you like; for example with:

```
npm install http-server -g
http-server .
```

## URL params

Defaultly the board will be 4-dimensional, with 4-squares on each side (4x4x4x4).

The number of dimensions and boardsize can be controlled with the 'd' and 'n' url parameters.

``` url
timechess.html?d=6&n=3
```

The above parameters should make a 3x3x3x3x3x3 board.

## Old Version

I made a version of this game in Unity, it has only 4-dimensional boards but is a complete game. (available in the releases tab)

### Enjoy!
