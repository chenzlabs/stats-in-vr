## yet another necro component pulled into service

This one is revived from back in the olden days! 0.4.0 is close to as old as I've seen. Very cool that this 5 year old code can still be called into service.

I was thinking about using web2vr and doing the proper stats panel, but that would definitely add more impact to the site being measured itself than this option. There's also probably other nice ways to implement this idea these days. but I googled, found this, and then found this pull request on it:
https://github.com/chenzlabs/stats-in-vr/pull/1

Which, with just one tiny bug fix, was found to work even on 1.2.0: https://glitch.com/edit/#!/stats-in-vr?path=index.html%3A36%3A53
~~though it seems the bars may not be working properly and that they perhaps used to. perhaps some more tinkering is in order?~~ Got the bars working again. :D Also spent a few hours going over it, refactoring stuff in the process. I now realize it adds about 40-50 draw calls or so, because it works by adding a ton of images with canvas with text as textures for every value.

So, adding my fork here. Will pull the updates here soon. It's got all the usual boilerplate, now fallen out of date. I just use the 'stats-in-vr.js' file and ignore the rest for now, may clean up rest of repo later.

You can access it through jsdelivr's cdn here: https://cdn.jsdelivr.net/gh/kylebakerio/stats-in-vr@0.2.0/stats-in-vr.js

Note that the build/dist files are NOT up to date with this one file listed above--they wouldn't build because of the ES6 syntax used in my bug fix, and the build tools are just that old.


## aframe-stats-in-vr-component

![npm (scoped)](https://img.shields.io/npm/v/@aframe-community/aframe-stats-in-vr-component)
![NPM](https://img.shields.io/npm/l/@aframe-community/aframe-stats-in-vr-component)
![npm](https://img.shields.io/npm/dm/@aframe-community/aframe-stats-in-vr-component)

stats-in-vr component for [A-Frame](https://aframe.io).

![stats-in-vr](https://user-images.githubusercontent.com/6391152/130007970-a512c190-0a4e-4f0d-8c40-0d8e1e9e58e8.png)
The stats-in-vr component allows the A-Frame scene stats component to be visible in VR.

## Example

```html
<a-scene stats-in-vr></a-scene>
```

## params
```js
  schema: {
    enabled: { type: "boolean", default: true },
    position: { type: "string", default: "0 -1.1 -1" },
    rotation: { type: "string", default: "-20 0 0" },
    scale: { type: "string", default: "1 .8 1" },
    updateIntervalMs: { type: "number", default: 250 },
    show2dstats: { type: "boolean", default: true },
    anchorEl: { type: "string", default: "[camera]" },
  },
```

### Installation

#### Browser

Install and use by directly including the [browser file](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/kylebakerio/stats-in-vr@0.2.0/stats-in-vr.js"></script>
</head>

<body>
  <a-scene stats-in-vr></a-scene>
</body>
```

