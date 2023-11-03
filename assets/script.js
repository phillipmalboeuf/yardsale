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

const variants = {
  'Gondola': 'red',
  'Powder': 'sand',
  'Glade': 'green',
  'Sunlight': 'yellow',
}

const classes = document.querySelectorAll("input[data-3d-class]");
if (classes) {
  classes.forEach(c => {
    c.addEventListener("click", () => {
      if (window.epigraph) {
        window.epigraph.api.makeProductClassIdActive(c.getAttribute("data-3d-class"));
        window.epigraph.api.switchVariantForProductClass(c.getAttribute("data-3d-class"), variants[c.getAttribute("data-value")])
      }
    })
  })
}