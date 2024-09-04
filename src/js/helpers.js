import { TIMEOUT_SEC } from './config.js';

export const hideElem = function (elems, className) {
  const [...nodes] = elems;
  nodes.forEach(el => el.classList.toggle(`${className}`));
};

export const removeClass = function (elems, nameClasses) {
  if (elems.length >= 1 && nameClasses.length === elems.length) {
    [...elems].forEach((el, i) => {
      el.classList.remove(`${nameClasses[i]}`);
    });
  }
};

export const addClass = function (elems, nameClasses) {
  if (elems.length >= 1 && nameClasses.length === elems.length) {
    [...elems].forEach((el, i) => {
      el.classList.add(`${nameClasses[i]}`);
    });
  }
};

export const autoCloseMobileMenu = function () {
  const activeTrigger = document.querySelector('.active-trigger');
  if (!activeTrigger) return;
  activeTrigger
    .querySelectorAll('.invert')
    .forEach(line => line.classList.remove('invert'));

  activeTrigger.classList.remove('active-trigger');
};

// Invert node elements color (if background = white || black)
export const invertColor = function (node, background) {
  if (!node) return;
  if (!background) return;
  const menuTriggerLines = node.querySelectorAll('.line');
  // const color = window.getComputedStyle(node).backgroundColor; //get COMPUTED STYLE (background-color) of current node

  const nodeElems = [
    ...Array.from(node.querySelectorAll('a')),
    ...Array.from(node.querySelectorAll('li')),
    ...Array.from(node.querySelectorAll('button')),
    ...Array.from(node.querySelectorAll('img')),
    ...Array.from(node.querySelectorAll('button svg')),
  ];
  // console.log(node);
  if (
    node.querySelector('.mobile-menu-trigger') &&
    background === 'rgb(255, 255, 255)'
  ) {
    menuTriggerLines.forEach(line => (line.style.backgroundColor = '#000000'));
  } else {
    menuTriggerLines.forEach(line => (line.style.backgroundColor = '#ffffff'));
  }

  nodeElems.forEach(el => {
    const tag = el.tagName.toLowerCase();
    const bgColor = window.getComputedStyle(el).backgroundColor;

    if (background === 'rgb(255, 255, 255)') {
      if (bgColor !== 'rgb(0, 0, 0)') {
        el.style.color = '#000000';
      }

      if (tag === 'button' && bgColor === 'rgb(255, 255, 255)') {
        el.style.backgroundColor = 'rgb(0, 0, 0)';
        el.style.color = '#ffffff';
      }
      if (tag === 'img') {
        el.src = el.src.replace('-light.', '-dark.');
      }
      if (tag === 'svg') {
        el.classList.add('invert');
      }
    }
    if (background === 'rgb(0, 0, 0)') {
      el.style.color = '#ffffff';
      if (tag === 'button' && bgColor === 'rgb(0, 0, 0)') {
        el.style.backgroundColor = 'rgb(255, 255, 255)';
        el.style.color = '#000000';
      }
      if (tag === 'img') {
        el.src = el.src.replace('-dark.', '-light.');
      }
    }
  });
};

/* FUNCTION TO TIMEOUT LONG REQUESTS TO THE SERVER */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/* FOR AJAX REQUESTS */
export const AJAX = async function (
  url,
  uploadData = undefined,
  typeMethod = 'POST'
) {
  try {
    const options = {
      method: typeMethod,
      body: uploadData,
    };

    const fetchMethod = uploadData ? fetch(url, options) : fetch(url);

    const res = await Promise.race([fetchMethod, timeout(TIMEOUT_SEC)]); //timeout(TIMEOUT_SEC) - for break a longer connect
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} Error code (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

/* --------------------------------------------------------- */

/* FORM VALIDATION */

export const formValidator = function (formFields) {
  const form = formFields;
  console.dir(form);
  for (const elem of form) {
    if (
      elem.tagName.toLowerCase() === 'textarea' ||
      elem.tagName.toLowerCase() === 'input'
    ) {
      if (elem.value.trim() === '') {
        elem.value = elem.value.trim();
        form.classList.add('empty');
        form.classList.add('was-validated');
      } else {
        form.classList.remove('empty');
      }
    }
  }

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return false;
  }
  if (form.checkValidity()) return true;
};
