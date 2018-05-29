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
  'Digit0',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Space',
];

const state = {
  // DOM elements:
  input: null,
  output: null,
  clear: null,
  submit: null,
  languages: [],

  // User generated text:
  text: '',

  // Config for speechSynthesis:
  lang: 'fr',
  rate: '1',

  // speechSynthesis instances:
  synth: null,
  utterance: null,
};

const setProperty = function (key, value) {
  state[key] = value;
  return state[key];
};

const renderText = function (text) {
  // Set to state:
  setProperty('text', text);

  // Send to DOM:
  state.output.innerText = text;
  return state.output.innerText;
};

const speak = function (text) {
  // Config:
  state.utterance.lang = state.lang;
  state.utterance.rate = state.rate;
  state.utterance.text = text;

  // Stop current speech:
  state.synth.cancel();

  // Speak:
  return state.synth.speak(state.utterance);
};

const toggleLangButtons = function (newLang) {
  const activeLang = state.languages.filter(language => language.dataset['lang'] === newLang);

  state.languages.map((lang) => lang.className = 'languages__toggle');
  activeLang[0].className = 'languages__toggle languages__toggle--is-active';

  return activeLang[0];
};

const keypress = {
  backspace() {
    const text = state.text;
    return renderText(text.substring(0, text.length - 1));
  },

  enter() {
    return actions.speakText();
  },

  escape() {
    return actions.clearText();
  },

  letter(key) {
    renderText(state.text + key);
    return speak(state.text[state.text.length - 1]);
  },
};

const actions = {
  handleKeyup(e) {
    if (e.code === 'Backspace') { keypress.backspace(); };
    if (e.code === 'Enter') { keypress.enter(); };
    if (e.code === 'Escape') { keypress.escape(); };
    if (letters.indexOf(e.code) === -1) { return false; };

    return keypress.letter(e.key);
  },

  changeLanguage(e) {
    const newLang = e.target.dataset['lang'];

    toggleLangButtons(newLang);
    return setProperty('lang', newLang);
  },

  speakText() {
    setProperty('text', state.text);
    return speak(state.text);
  },

  clearText() {
    return renderText('');
  },
};

const bind = {
  input() {
    state.input.focus();
    return state.input.addEventListener('keyup', actions.handleKeyup);
  },

  languageButtons() {
    return state.languages.map(function (language) {
      return language.addEventListener('click', actions.changeLanguage)
    });
  },

  submitButton() {
    return state.submit.addEventListener('click', this.speakText);
  },

  clearButton() {
    return state.clear.addEventListener('click', actions.clearText);
  },
};

const app = {
  initInput() {
    setProperty('input', document.querySelector('body'));
    return bind.input();
  },

  initOutput() {
    return setProperty('output', document.querySelector('div[name="output"]'));
  },

  initSubmit() {
    setProperty('submit', document.querySelector('a[name="speak-input"]'));
    return bind.submitButton();
  },

  initClear() {
    setProperty('clear', document.querySelector('a[name="clear-input"]'));
    return bind.clearButton();
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
    return bind.languageButtons();
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
