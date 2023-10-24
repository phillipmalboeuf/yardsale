console.log('Yardsale')

const epigraph = document.getElementById("epigraphConfiguratorLite");
if (epigraph) {
  window.epigraph = epigraph
  window.addEventListener(
    "core:ready",
    (event) => {
      // Here you could execute tasks like, updating product pricing, populating a custom UI if need be.
      console.log("Processes that need to happend once the core is ready");
      console.log(event)
    }
  );
}