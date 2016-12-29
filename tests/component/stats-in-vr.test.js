/* global assert, setup, suite, teardown, test */

suite('stats-in-vr', function () {
  setup(function (done) {
    var el = this.sceneEl = document.createElement('a-scene');
    el.setAttribute('stats-in-vr', '');
    document.body.appendChild(el);

    el.addEventListener('loaded', function () { done(); });
  });

  teardown(function () {
    var el = this.sceneEl;
    el.parentNode.removeChild(el);
  });

  suite('stats-in-vr default:true', function () {
    setup(function (done) {
      var el = this.sceneEl = document.createElement('a-scene');
      el.setAttribute('stats-in-vr', '');
      document.body.appendChild(el);

      el.addEventListener('loaded', function () { done(); });
    });

    teardown(function () {
      var el = this.sceneEl;
      el.parentNode.removeChild(el);
    });

    test('Stats are created', function () {
      assert.equal(document.querySelector('.rs-container').parentElement.outerHtml, this.sceneEl.components.stats.statsEl.outerHtml);
      assert.ok(this.sceneEl.components.stats.statsEl);
    });

    test('Stats DOM element is not visible', function () {
      assert.equal(this.sceneEl.components.stats.statsEl.style.display, 'none');
    });

    test('Stats A-Frame element is attached', function () {
      setTimeout(function () { assert.ok(this.sceneEl.components.stats.statspanel); }, 0);
    });
  });
});
