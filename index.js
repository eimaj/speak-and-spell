const speak = function (text) {
  const synth = new SpeechSynthesisUtterance(text);
  synth.lang = state.lang;
  synth.rate = state.rate;

  return window.speechSynthesis.speak(synth);
};

const state = {
  input: null,
  clear: null,
  submit: null,
  
  text: '',

  lang: 'fr',
  rate: '1',
};

const setProperty = function (key, value) {
  state[key] = value;
  return state[key];
};

const actions = {
  speakLetter(e) {
    // catch enter keyCode == 13
    // catch esc keyCode == 27
    // catch tab keyCode == 9: block event
    // catch backspace keyCode == 8: block event

    setProperty('text', state.input.value);
    return speak(state.text[state.text.length - 1]);
  },

  speakInput() {
    setProperty('text', state.input.value);
    return speak(state.text);
  },

  clearInput() {
    state.input.value = '';
    return setProperty('text', state.input.value);
  },
};

const app = {
  bindInput() {
    state.input.focus();
    return state.input.addEventListener('keyup', actions.speakLetter);
  },

  bindSubmit() {
    return state.submit.addEventListener('click', actions.speakInput);
  },

  bindClear() {
    return state.clear.addEventListener('click', actions.clearInput);
  },

  init() {
    setProperty('input', document.querySelector('input[name="type-here"]'));
    this.bindInput();

    setProperty('submit', document.querySelector('a[name="speak-input"]'));
    this.bindSubmit();

    setProperty('clear', document.querySelector('a[name="clear-input"]'));
    this.bindClear();

    return this;
  },
};

app.init();
