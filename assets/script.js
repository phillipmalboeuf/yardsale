console.log('Yardsale')

const epigraph = document.getElementById("epigraphConfiguratorLite");
if (epigraph) {
  window.epigraph = epigraph
  window.addEventListener(
    "core:ready",
    (event) => {
      setTimeout(() => {
        if (epigraph.hasAttribute("data-class")) {
          // window.epigraph.api.makeProductClassIdActive("rightPole");
        }

        if (epigraph.hasAttribute("data-variant")) {
          // window.epigraph.api.makeProductClassIdActive(epigraph.getAttribute("data-class"));
          window.epigraph.api.switchVariantForProductClass("rightHandle", "green")
          window.epigraph.api.switchVariantForProductClass("leftHandle", "green")
          window.epigraph.api.switchVariantForProductClass("rightStrap", "green")
          window.epigraph.api.switchVariantForProductClass("leftStrap", "green")
          window.epigraph.api.switchVariantForProductClass("rightBasket", "green")
          window.epigraph.api.switchVariantForProductClass("leftBasket", "green")
          window.epigraph.api.switchVariantForProductClass("rightPole", "green")
          window.epigraph.api.switchVariantForProductClass("leftPole", "green")
        }
      }, 1000);
      // console.log(epigraph.getAttribute("data-class"))
      
    }
  );
}

function builderParams(form, seperator='%26') {
  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);

  const [left, right] = Object.entries(formProps).filter(([key]) => key.startsWith('left') || key.startsWith('right'))
  const params = Object.entries(formProps)
      .filter(([key]) => !key.startsWith('left') && !key.startsWith('right'))
      .filter(([key]) => !key.includes(left[0]) || key.includes(left[0]+'-'+left[1]))
      .filter(([key]) => !key.includes(right[0]) || key.includes(right[0]+'-'+right[1]))
      .map(([key, value]) => `${key}=${value}${seperator}${key.replace('[id]','[properties][Pole]')}=${key.includes('left') ? '1st' : '2nd'}`).reverse()

  return params
}

const builder = document.getElementById("pole-builder");
if (builder) {
  builder.addEventListener("submit", e => {
    e.preventDefault()

    window.location = `/cart/clear?return_to=${`/cart/add?${builderParams(e.target).join('%26')}%26return_to=checkout`}`
  })

  const add = document.getElementById("add-to-cart");
  if (add) {
    add.addEventListener("click", e => {
      e.preventDefault()

      window.location = `/cart/add?${builderParams(builder, '&').join('&')}`
    })
  }
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

const onscrolls = document.querySelectorAll("[data-onscroll]");
if (onscrolls) {
  const observer = new IntersectionObserver((elements, observer) => {
    elements.forEach((element, index) => {
      if (element.isIntersecting) {
        !element.target.classList.contains('visible') && element.target.classList.add('visible')
      } else {
        element.target.classList.contains('visible') && element.target.classList.remove('visible')
      }
    });
  }, {
    rootMargin: '0px 0px 0px 0px',
  });
  onscrolls.forEach((element) => observer.observe(element));
}

const variants = {
  'Gondola': 'red',
  'Powder': 'sand',
  'Glade': 'green',
  'Sunlight': 'yellow',
}

const classes = document.querySelectorAll("[data-3d-class]");
if (classes) {
  window.addEventListener(
    "core:ready",
    () => {
      window.epigraph.api.moveCameraToCameraViewById('pole-both-mobile');
    }
  )
  classes.forEach(c => {
    c.addEventListener("click", () => {
      if (window.epigraph) {
        if (c.getAttribute("data-3d-class").startsWith('both')) {
          window.epigraph.api.moveCameraToCameraViewById(c.getAttribute("data-3d-class").replace('both', '').toLowerCase() + '-both-mobile')
          // window.epigraph.api.makeProductClassIdActive(c.getAttribute("data-3d-class").replace('both', 'left'));

          console.log(variants[c.getAttribute("data-value")])

          if (c.hasAttribute("data-value") && variants[c.getAttribute("data-value")]) {
            window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class").replace('both', 'left'), variants[c.getAttribute("data-value")])
            window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class").replace('both', 'right'), variants[c.getAttribute("data-value")])
          }
        } else {
          window.epigraph.api.makeProductClassIdActive(c.getAttribute("data-3d-class"));
          if (c.hasAttribute("data-value") && variants[c.getAttribute("data-value")]) {
            window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class"), variants[c.getAttribute("data-value")])
          }
        }
      }
    })
  })
}

const allvalues = document.querySelectorAll("[data-all-values]");
if (allvalues) {
  allvalues.forEach(a => {
    a.addEventListener("click", () => {
      const inputs = document.querySelectorAll(`[data-value="${a.getAttribute("data-all-values")}"]`)
      console.log(inputs.length)
      inputs.forEach(input => input.click())
      window.epigraph.api.moveCameraToCameraViewById('pole-both-mobile')
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

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}