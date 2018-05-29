const languages = [
  'en',
  'fr',
];

const letters = [
  'KeyA',
  'KeyB',
  'KeyC',
  'KeyD',
  'KeyE',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyI',
  'KeyJ',
  'KeyK',
  'KeyL',
  'KeyM',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyQ',
  'KeyR',
  'KeyS',
  'KeyT',
  'KeyU',
  'KeyV',
  'KeyW',
  'KeyX',
  'KeyY',
  'KeyZ',
  'Space',
];

const state = {
  input: null,
  output: null,
  clear: null,
  submit: null,
  languages: [],

  text: '',

  lang: 'fr',
  rate: '1',
  synth: null,
  utterance: null,
};

const speak = function (text) {
  state.synth.lang = state.lang;
  state.synth.rate = state.rate;
  state.synth.text = text;

  return window.speechSynthesis.speak(state.synth);
};

const setProperty = function (key, value) {
  state[key] = value;
  return state[key];
};

const setText = function (text) {
  setProperty('text', text);
  return renderOutput(state.text);
};

const renderOutput = function (text) {
  state.output.innerText = text;
  return state.output.innerText;
};

const speakInput = function () {
  setProperty('text', state.text);
  return speak(state.text);
};

const actions = {
  speakLetter(e) {
    console.log('e.code', e.code);
    // catch enter keyCode == 13
    // catch esc keyCode == 27
    // catch tab keyCode == 9: block event
    // catch backspace keyCode == 8: block event

    if (e.code === 'Backspace') {
      const text = state.text;
      return setText(text.substring(0, text.length - 1));
    };

    if (e.code === 'Delete') {
      return setText('');
    };

    if (e.code === 'Enter') {
      return speakInput();
    };

    // if (e.code === 'Tab') {
    //   const newLang = state.lang === 'en' ? 'fr' : 'en';
    //   return setProperty('lang', newLang);
    // };

    if (letters.indexOf(e.code) === -1) { return false; };

    setText(state.text + e.key);
    return speak(state.text[state.text.length - 1]);
  },

  changeLanguage(e) {
    const newLang = e.target.dataset['lang']
    return setProperty('lang', newLang);
  },

  clearText() {
    return setText('');
  },
};

const app = {
  bindInput() {
    state.input.focus();
    return state.input.addEventListener('keyup', actions.speakLetter);
  },

  bindLanguageButtons() {
    return state.languages.map(function (language) {
      return language.addEventListener('click', actions.changeLanguage)
    });
  },

  bindSubmitButton() {
    return state.submit.addEventListener('click', speakInput);
  },

  bindClearButton() {
    return state.clear.addEventListener('click', actions.clearText);
  },

  initInput() {
    setProperty('input', document.querySelector('body'));
    return this.bindInput();
  },

  initOutput() {
    return setProperty('output', document.querySelector('div[name="output"]'));
  },

  initSubmit() {
    setProperty('submit', document.querySelector('a[name="speak-input"]'));
    return this.bindSubmitButton();
  },

  initClear() {
    setProperty('clear', document.querySelector('a[name="clear-input"]'));
    return this.bindClearButton();
  },

  initSynth() {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance('');

    setProperty('utterance', utterance);
    return setProperty('synth', synth);
  },

  initLanguages() {
    const nodeList = document.querySelectorAll('a[name="change-language"]');
    const languageButtons = Array.from(nodeList);

    setProperty('languages', languageButtons);
    return this.bindLanguageButtons();
  },

  init() {
    this.initInput();
    this.initOutput();
    this.initSubmit();
    this.initClear();
    this.initLanguages();
    this.initSynth();

    return this;
  },
};

app.init();
