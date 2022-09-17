const textarea = document.querySelector('textarea');
const defaultSVG = textarea.value;
const preview = document.querySelector('#preview');
const permalink = document.querySelector('#permalink');
const clearHash = document.querySelector('#clear-hash');

if (location.hash) {
  textarea.value = atob(location.hash.substring(1));
}

window.onhashchange = e => {
  let text = atob(location.hash.substring(1));
  if (text == '')
    text = defaultSVG;

  textarea.value = text;
  update();
}

textarea.oninput = update;
update();

permalink.onclick = () => {
  location.href = getPermalink(textarea.value);
};

clearHash.onclick = () => {
  location.hash = '';
};

function update() {
  const input = textarea.value;

  try {
    const parser = new DOMParser();
    const svg = parser.parseFromString(input, 'text/html').body.childNodes[0];
    let svgWidth = svg.width.baseVal.value;
    let svgHeight = svg.height.baseVal.value;
    if (svgWidth == 0 && svgHeight == 0) {
      svgWidth = 400;
      svgHeight = 400;
    }

    preview.style.width = `${svgWidth}px`;
    preview.style.height = `${svgHeight}px`;
    preview.replaceChildren(svg);
  } catch (e) {
    preview.innerHTML = `<p class="error">${e.message}</p><p class="stack">${e.stack}</p>`;
  }
}

function getPermalink(input) {
  const url = new URL(location.href);
  url.hash = btoa(input);
  return url.href;
}
