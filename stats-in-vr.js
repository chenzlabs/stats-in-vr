/* globals AFRAME */

/**
 * Show scene stats in VR.
 */
AFRAME.registerComponent("stats-in-vr", {
  dependencies: ["stats"],

  schema: {
    enabled: { type: "boolean", default: true },
    debug: { type: "boolean", default: false },
    position: { type: "string", default: "0 -1.1 -1" },
    rotation: { type: "string", default: "-20 0 0" },
    scale: { type: "string", default: "1 .8 1" },
    throttle: { type: "number", default: 20 },
    backgroundcolor: { type:"color", default: "white"}, // for opacity, you can try "rgba(255, 255, 255, 0.5)"
    show2dstats: { type: "boolean", default: true },  // show the built-in 'stats' component
    alwaysshow3dstats: { type: "boolean", default: false },  // show the built-in 'stats' component
    anchorel: { type: "selector", default: "[camera]" }, // anchor in-vr stats to something other than the camera
    showalllabels: { type: "boolean", default: true }, 
    showlabels: {type: 'array', default:[]}, // e.g., ['raf','fps','calls','entities']
    showallgraphs: { type: "boolean", default: true },
    showgraphs: {type: 'array', default:[]}, // e.g., ['raf','fps','calls','entities']
  },
  
  inVR: false,
  init: function() {
    this.canvasParent = document.createElement('div');
    this.canvasParent.setAttribute('id','stats-in-vr-canvas-parent')
    this.sceneEl = AFRAME.scenes[0]
    
    AFRAME.scenes[0].addEventListener('enter-vr', async () => {
      this.inVR = true;
      if (this.data.enabled) {
        this.show()
      }
    })
    AFRAME.scenes[0].addEventListener('exit-vr', async () => {
      this.inVR = false;
      if (!this.data.alwaysshow3dstats) {
        this.hide();
      }
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
    this.data.anchorel.appendChild(this.statspanel);
    
    await this.addEls();
    if (this.data.alwaysshow3dstats || this.inVR) {
      this.show();
    }
    else if (!this.inVR) {
      this.hide();
    }
    if (this.data.debug) {
      this.sceneEl.components.stats.statsEl.appendChild(this.canvasParent);
    } else {
      document.body.appendChild(this.canvasParent)
    }
    this.addStatPanels();
    this.tick = AFRAME.utils.throttleTick(this.willtick, this.data.throttle, this);
  },
  
  waitForTime: async function(ms) {
    return new Promise((res,rej) => {
      setTimeout(res,ms)
    })
  },
  
  addEls: async function() {
    if (!document.querySelectorAll(".rs-canvas").length) {
      if (this.data.debug) console.log("no canvases, recurse in ", this.data.throttle)
      await this.waitForTime(this.data.throttle)
      await this.addEls()
    }
    // set up the VR stats panel
    this.valuecanvases = [];
    this.valueimages = [];
    this.rsids = [];
    this.rsvalues = [];
    this.stats = [];
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
    
    this.monoCanvas = document.createElement('canvas');
    this.monoCanvas.setAttribute("id", "value-monocanvas");
    this.monoCanvas.setAttribute("width", 128);
    this.monoCanvas.setAttribute("height", 16*this.rscanvases.length);
    this.monoCanvas.setAttribute("crossorigin", "anonymous");
    this.canvasParent.appendChild(this.monoCanvas)
    
    this.monoImage = this.monoImage || document.createElement("a-image");
    this.monoImage.setAttribute("id", "aframe-all");
    this.monoImage.setAttribute("position", {x:0.17, y:1.25, z:0});
    this.monoImage.setAttribute("width", .16);
    this.monoImage.setAttribute("height", .025 * this.rscanvases.length);
    this.monoImage.setAttribute("src", "#" + this.monoCanvas.id);
    this.statspanel.appendChild(this.monoImage);
    
    for (var i = 0; i < this.rscanvases.length; i++) {
      // console.log(this.rsid)
      this.yval = (1.3625 - i * 0.025);
      this.rsparent = this.rscanvases[i].parentElement;
      this.rsid = this.rsparent.querySelector(".rs-counter-id").innerText;

      if (this.rsids.indexOf(this.rsid) >= 0) {
        continue;
      }

      // remember labels and value elements
      this.rsids[i] = this.rsid;
      this.rsvalues[i] = (this.rsparent.querySelector(".rs-counter-value"));

      // inject id values for rstats canvases
      this.idsuffix = this.rsids[i].replace(" ", "_");
      this.rscanvases[i].id = "rstats-" + this.idsuffix;
      
      if (this.data.showallgraphs || this.data.showgraphs.includes(this.rsid.toLowerCase())) {
      // create the image for the rstats canvas
        this.stats[i] = document.createElement('a-image');
        this.stats[i].setAttribute('position', {x:-0.08, y:this.yval, z:0});
        this.stats[i].setAttribute('width', '0.34');
        this.stats[i].setAttribute('height', '0.025');
        this.stats[i].setAttribute('src', '#' + this.rscanvases[i].id);
        this.statspanel.appendChild(this.stats[i]);
      }
      
      if (this.data.showalllabel || this.data.showlabels.includes(this.rsid.toLowerCase())) {
        // console.log(this.data.showlabels,this.rsid.toLowerCase())
        // create the canvas for the value
        this.valuecanvases[i] = this.valuecanvases[i] || document.createElement("canvas");
        this.valuecanvases[i].setAttribute("id", "value-" + this.idsuffix);
        this.valuecanvases[i].setAttribute("width", 128);
        this.valuecanvases[i].setAttribute("height", 16);
        this.valuecanvases[i].setAttribute("crossorigin", "anonymous");

        // add the value canvas
        // this.canvasParent.appendChild(this.valuecanvases[i])

        // create the image for the value canvas
        this.valueimages[i] = this.valueimages[i] || document.createElement("a-image");
        this.valueimages[i].setAttribute("id", "aframe-" + this.idsuffix);
        this.valueimages[i].setAttribute("position", {x:0.17, y:this.yval, z:0});
        this.valueimages[i].setAttribute("width", .16);
        this.valueimages[i].setAttribute("height", .025);
        this.valueimages[i].setAttribute("src", "#" + this.valuecanvases[i].id);
      }
    }
  },

  update: function() {
    if (!this.statspanel) {
      return;
    }
    this.statspanel.setAttribute("position", this.data.position);
    this.statspanel.setAttribute("scale", this.data.scale);
    this.tick = AFRAME.utils.throttleTick(this.willtick, this.data.throttle, this);
    return this.data.enabled ? this.show() : this.hide();
  },

  remove: function() {
    var statsEl = this.sceneEl.components.stats.statsEl;

    statsEl.parentNode.removeChild(statsEl);
  },
  newText: "",
  tick(){},
  willtick: function(log) {
    if (!this.inVR && !this.data.debug && !this.data.alwaysshow3dstats) {
      return;
    }

    if (this.valuecanvases) {
      this.newText = "";
      var ctx = this.monoCanvas.getContext("2d");
      ctx.clearRect(0, 0, 192, 16 * this.valuecanvases.length);
      ctx.fillStyle = this.data.backgroundcolor;
      ctx.fillRect(0, 0, 192, 16 * this.valuecanvases.length);
      
      for (var i = 0; i < this.valuecanvases.length; i++) {
        if (!this.valuecanvases[i]) continue
        ctx.font = "12px monospace";
        ctx.fillStyle = "black";
        this.newText = `${this.rsvalues[i].innerText} ${this.rsids[i]}\n`
        ctx.fillText(this.newText, 2, 15.5 + (15.5*i));
      }

      for (i = 0; i < this.valuecanvases.length*2; i++) {
        if (this.statspanel.childNodes.item(i)?.components?.material?.shader){
          let node =this.statspanel.childNodes.item(i);
          if (node) node.components.material.material.map.needsUpdate = true;
        } 
      }
    }
  },

  hide: function() {
    if (this.data.debug) {
      return
    }
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
