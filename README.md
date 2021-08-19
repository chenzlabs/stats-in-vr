## aframe-stats-in-vr-component

![npm (scoped)](https://img.shields.io/npm/v/@aframe-community/aframe-stats-in-vr-component)
![NPM](https://img.shields.io/npm/l/@aframe-community/aframe-stats-in-vr-component)
![npm](https://img.shields.io/npm/dm/@aframe-community/aframe-stats-in-vr-component)

stats-in-vr component for [A-Frame](https://aframe.io).

![Screenshot](https://raw.githubusercontent.com/aframe-community/stats-in-vr/master/examples/pc-screenshot.png)
The stats-in-vr component allows the A-Frame scene stats component to be visible in VR.

## Example

```html
<a-scene stats-in-vr></a-scene>
```

## Value

| Property | Description                            | Default Value  |
| -------- | -------------------------------------- | -------------- |
| enabled  | Whether enabled or not.                | true           |
| position | Position of camera-locked stats panel. | '0 -0.35 -0.5' |
| scale    | Scale of camera-locked stats panel.    | '0.5 0.5 1'    |

## Events

| Event Name | Description |
| ---------- | ----------- |


### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.0.3/aframe.min.js"></script>
  <script src="https://raw.githubusercontent.com/aframe-community/stats-in-vr/master/dist/aframe-stats-in-vr-component.min.js"></script>
</head>

<body>
  <a-scene stats-in-vr></a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install  @aframe-community/aframe-stats-in-vr-component
```

Then register and use.

```js
require("aframe");
require("aframe-stats-in-vr-component");
```
