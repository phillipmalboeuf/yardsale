console.log('Yardsale')

const epigraph = document.getElementById("epigraphConfiguratorLite");
if (epigraph) {
  window.epigraph = epigraph
  window.addEventListener(
    "core:ready",
    (event) => {
    }
  );
}

const builder = document.getElementById("pole-builder");
if (builder) {
  builder.addEventListener("submit", e => {
    // e.preventDefault()

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    console.log(formProps)
  })
}

const header = document.getElementById("header");
if (header) {
  if (header.hasAttribute('data-header')) {
    const attributes = JSON.parse(header.getAttribute('data-header'))

    window.addEventListener('scroll', (e) => {
      if (header.hasAttribute('style') && window.scrollY > 0) {
        header.removeAttribute('style')
      } else if (!header.hasAttribute('style') && window.scrollY <= 0) {
        header.style.color = `rgb(${attributes.foreground})`
        header.style.background = `linear-gradient(rgba(${attributes.background}, 0.666), rgba(${attributes.background}, 0))`
      }
    })
  }
}

const variants = {
  'Gondola': 'red',
  'Powder': 'sand',
  'Glade': 'green',
  'Sunlight': 'yellow',
}

const classes = document.querySelectorAll("[data-3d-class]");
if (classes) {
  classes.forEach(c => {
    c.addEventListener("click", () => {
      if (window.epigraph) {
        if (c.getAttribute("data-3d-class").startsWith('both')) {
          window.epigraph.api.makeProductClassIdActive(c.getAttribute("data-3d-class").replace('both', 'left'));

          if (c.hasAttribute("data-value")) {
            window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class").replace('both', 'left'), variants[c.getAttribute("data-value")])
            window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class").replace('both', 'right'), variants[c.getAttribute("data-value")])
          }
        } else {
          window.epigraph.api.makeProductClassIdActive(c.getAttribute("data-3d-class"));
          if (c.hasAttribute("data-value")) {
            window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class"), variants[c.getAttribute("data-value")])
          }
        }
      }
    })
  })
}

const floats = document.querySelectorAll("[data-float-right]");
if (floats?.length) {
  floats[0].classList.add("float--active")
  floats.forEach(float => {
    float.addEventListener("mouseenter", () => {
      floats.forEach(f => {
        f.classList.remove("float--active")
      })
      float.classList.add("float--active")
    })
  })
}


class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    // const poster = this.querySelector('[id^="Deferred-Poster-"]');
    // if (!poster) {
    //   // this.loadContent.bind(this)();
    //   return;
    // };
    // poster.addEventListener('click', this.loadContent.bind(this));
    this.loadContent.bind(this)()
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
      if (deferredElement.nodeName == 'VIDEO' && deferredElement.getAttribute('autoplay')) {
        // force autoplay for safari
        deferredElement.play();
      }
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}