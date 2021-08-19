/* globals AFRAME */

/**
 * Show scene stats in VR.
 */
AFRAME.registerComponent("stats-in-vr", {
  dependencies: ["stats"],

  schema: {
    enabled: { type: "boolean", default: true },
    position: { type: "string", default: "0 -1.1 -1" },
    rotation: { type: "string", default: "-20 0 0" },
    scale: { type: "string", default: "1 .8 1" },
    updateIntervalMs: { type: "number", default: 250 },
    show2dstats: { type: "boolean", default: true },
    anchorEl: { type: "string", default: "[camera]" },
  },
  
  inVR: false,
  init: function() {
    
    // var scene = this.sceneEl;
    // var statsEl = this.sceneEl.components.stats.statsEl;
    // this.tick = AFRAME.utils.throttleTick(this.tick, this.data.updateIntervalMs, this);
    this.canvasParent = document.createElement('div');
    this.canvasParent.setAttribute('id','stats-in-vr-canvas-parent')
    this.sceneEl = AFRAME.scenes[0]
    
    AFRAME.scenes[0].addEventListener('enter-vr', async () => {
      this.inVR = true;
      if (this.data.enabled) {
        this.show()
      }
      // AFRAME.scenes[0].setAttribute('stats-in-vr',{a:1})
    })
    AFRAME.scenes[0].addEventListener('exit-vr', async () => {
      this.inVR = false;
      this.hide();
      // AFRAME.scenes[0].setAttribute('stats-in-vr',{a:1})
    })
    
    if (!this.data.show2dstats) {
      // hide the DOM stats panel, except for ours
      this.sceneEl.components.stats.statsEl/*.querySelector('.rs-container')*/.style = 'display: none !important;';
      this.sceneEl.components.stats.statsEl/*.querySelector('.rs-container')*/.className = 'a-hidden';
    }

    this.begin();
  },
  
  begin: async function() {
    // once we start rendering, create VR stats panel
    if (this.sceneEl.renderStarted) {
      await this.createStatsPanel();
    } else {
      this.sceneEl.addEventListener("renderstart", this.createStatsPanel.bind(this));
    }
  },

  createStatsPanel: async function() {
    // attached to scene element, so inject stats panel into camera
    this.statspanel = document.createElement("a-entity");
    this.statspanel.setAttribute("id", "statspanel");
    this.statspanel.setAttribute("position", this.data.position);
    this.statspanel.setAttribute('rotation', this.data.rotation)
    this.statspanel.setAttribute("scale", this.data.scale);
    this.statspanel.setAttribute(
      "visible",
      this.data.enabled ? "true" : "false"
    );
    // this.sceneEl.camera.el.appendChild(this.statspanel);
    document.querySelector(this.data.anchorEl).appendChild(this.statspanel);
    
    await this.addEls();
    if (!this.inVR) {
      // console.warn("disabled for dev, but add this line back in")
      this.hide();
    }
    this.sceneEl.components.stats.statsEl.appendChild(this.canvasParent);
    this.addStatPanels();
    this.tick = AFRAME.utils.throttleTick(this.willtick, this.data.updateIntervalMs, this);
  },
  
  waitForTime: async function(ms) {
    return new Promise((res,rej) => {
      setTimeout(res,ms)
    })
  },
  
  addEls: async function() {
    if (!document.querySelectorAll(".rs-canvas").length) {
      // console.log("no canvases, recurse in ", this.data.updateIntervalMs)
      await this.waitForTime(this.data.updateIntervalMs)
      await this.addEls()
    }
    // set up the VR stats panel
    this.valuecanvases = [];
    this.valueimages = [];
    this.rsids = [];
    this.rsvalues = [];
    this.stats = [];
    // console.log(document.querySelectorAll(".rs-canvas").length)
    // this.addStatPanels();
  },
  
  addStatPanels: function() {
    // method:
    // get labels
    // get values
    // removed, to add back: get raw bar canvas
    // make canvas for every label/value
    // make picture with prior canvas as source
    // attach picture to statspanel entity
    // set canvas in the canvas ctx within the tick function (weird?)
    // label the item as needing an update to rendered
    
    if (!this.statspanel || !this.rsids) {
      return;
    }
    
    if (!this.rscanvases) {
      this.rscanvases = document.querySelectorAll(".rs-canvas");
    }
    
    
    // for (var i = 0; i < this.rscanvases.length; i++) {
    for (var i = 0; i < this.rscanvases.length; i++) {
    
      this.yval = (1.25 - i * 0.025);
      this.rsparent = this.rscanvases[i].parentElement;
      this.rsid = this.rsparent.querySelector(".rs-counter-id").innerText;

      if (this.rsids.indexOf(this.rsid) >= 0) {
        continue;
      }

      // remember labels and value elements
      // this.rsids.push(this.rsid);
      this.rsids[i] = this.rsid;
      this.rsvalues[i] = (this.rsparent.querySelector(".rs-counter-value"));

      // inject id values for rstats canvases
      this.idsuffix = this.rsids[i].replace(" ", "_");
      this.rscanvases[i].id = "rstats-" + this.idsuffix;
      
      
      // create the image for the rstats canvas
      this.stats[i] = document.createElement('a-image');
      this.stats[i].setAttribute('position', {x:-0.08, y:this.yval, z:0});
      this.stats[i].setAttribute('width', '0.34');
      this.stats[i].setAttribute('height', '0.025');
      this.stats[i].setAttribute('src', '#' + this.rscanvases[i].id);
      this.statspanel.appendChild(this.stats[i]);      

      // create the canvas for the value
      // var valuecanvas = document.createElement("canvas");
      this.valuecanvases[i] = this.valuecanvases[i] || document.createElement("canvas");
      this.valuecanvases[i].setAttribute("id", "value-" + this.idsuffix);
      this.valuecanvases[i].setAttribute("width", "128");
      this.valuecanvases[i].setAttribute("height", "16");
      this.valuecanvases[i].setAttribute("crossorigin", "anonymous");

      // add the value canvas
      this.canvasParent.appendChild(this.valuecanvases[i])
      // this.sceneEl.components.stats.statsEl.appendChild(this.canvasParent);

      // create the image for the value canvas
      // var value = document.createElement("a-image");
      this.valueimages[i] = this.valueimages[i] || document.createElement("a-image");
      this.valueimages[i].setAttribute("id", "aframe-" + this.idsuffix);
      this.valueimages[i].setAttribute("position", {x:0.17, y:this.yval, z:0});
      this.valueimages[i].setAttribute("width", .16);
      this.valueimages[i].setAttribute("height", .025);
      this.valueimages[i].setAttribute("src", "#" + this.valuecanvases[i].id);
      this.statspanel.appendChild(this.valueimages[i]);
    }
  },

  update: function() {
    if (!this.statspanel) {
      return;
    }
    this.statspanel.setAttribute("position", this.data.position);
    this.statspanel.setAttribute("scale", this.data.scale);
    this.tick = AFRAME.utils.throttleTick(this.willtick, this.data.updateIntervalMs, this);
    return this.data.enabled ? this.show() : this.hide();
  },

  remove: function() {
    var statsEl = this.sceneEl.components.stats.statsEl;

    statsEl.parentNode.removeChild(statsEl);
  },

  tick(){},
  willtick: function(log) {
    // periodically update the value canvases
    if (!this.inVR) {
      // console.warn("disabled for dev, but add this line back in")
      return;
    }

    if (this.valuecanvases) {
      // this.addStatPanels(); // if you had new stats being added dynamically, you could run this...
      for (var i = 0; i < this.valuecanvases.length; i++) {
        var ctx = this.valuecanvases[i].getContext("2d");
        ctx.clearRect(0, 0, 192, 16);
        ctx.font = "12px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(0, 0, 192, 16);
        ctx.fillStyle = "black";
        ctx.fillText(this.rsvalues[i].innerText + " " + this.rsids[i], 2, 13);
      }
      for (i = 0; i < this.valuecanvases.length*2; i++) {
        if (this.statspanel.childNodes.item(i).components?.material?.shader){
          this.statspanel.childNodes.item(i).components.material.material.map.needsUpdate = true;
        } 
      }
    }
  },

  hide: function() {
    if (this.statspanel) {
      this.statspanel.object3D.visible = false;
    }
    if (!this.data.show2dstats) {
      this.sceneEl.components.stats.statsEl/*.querySelector('.rs-container')*/.style = 'display: none !important;';
      this.sceneEl.components.stats.statsEl/*.querySelector('.rs-container')*/.className = 'a-hidden';
    } else {
      this.sceneEl.components.stats.statsEl.classList.remove("a-hidden");
      this.sceneEl.components.stats.statsEl.style = "";
    }
  },

  show: function() {
    if (this.statspanel) {
      this.statspanel.object3D.visible = true;
    }
  }
});
