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