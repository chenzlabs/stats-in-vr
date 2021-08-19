## yet another necro component pulled into service

This guy is from back in the olden days! 0.4.0 is close to as old as I've seen. Very cool that this 5 year old code can still be called into service.

I was thinking about using web2vr and doing the proper stats panel, but that would definitely add more impact to the site being measured itself than this option. There's also probably other nice ways to implement this idea these days. but I googled, found this, and then found this pull request on it:
https://github.com/chenzlabs/stats-in-vr/pull/1

Which, with just one tiny bug fix, was found to work even on 1.2.0: https://glitch.com/edit/#!/stats-in-vr?path=index.html%3A36%3A53

So, adding my fork here. Will pull the updates here soon. It's got all the usual boilerplate, now fallen out of date no doubt. I just use the 'main.js' file.

## aframe-stats-in-vr-component

stats-in-vr component for [A-Frame](https://aframe.io).

![Screenshot](https://chenzlabs.github.io/stats-in-vr/pc-screenshot.png)
The stats-in-vr component allows the A-Frame scene stats component to be visible in VR.

## Example

```html
<a-scene stats-in-vr></a-scene>
```

## Value

| Property             | Description                                        | Default Value        |
|----------------------|----------------------------------------------------|----------------------|
| enabled              | Whether enabled or not.                            | true                 |
| position             | Position of camera-locked stats panel.             | '0 -0.35 -0.5'       |
| scale                | Scale of camera-locked stats panel.                | '0.5 0.5 1'          |

## Events

| Event Name   | Description             |
| ----------   | -----------             |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://rawgit.com/chenzlabs/stats-in-vr/master/dist/aframe-stats-in-vr-component.min.js"></script>
</head>

<body>
  <a-scene stats-in-vr></a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-stats-in-vr-component
```

Then register and use.

```js
require('aframe');
require('aframe-stats-in-vr-component');
```
