const languages = [
  'en-US',
  'fr-CA',
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
  clear: null,
  submit: null,
  languages: [],

  // Config for speechSynthesis:
  lang: 'fr-CA',
  rate: '1',

  // speechSynthesis instances:
  synth: null,
};

const setProperty = function (key, value) {
  state[key] = value;
  return state[key];
};

const renderText = function (text) {
  state.output.value = text;

  return state.output.value;
};

const speak = function (text) {
  const utterance = new SpeechSynthesisUtterance('');

  // Config:
  utterance.lang = state.lang;
  utterance.rate = state.rate;
  utterance.text = text;

  // Stop current speech:
  state.synth.cancel();

  // Speak:
  return state.synth.speak(utterance);
};

const toggleLangButtons = function (newLang) {
  const activeLang = state.languages.filter(language => language.dataset['lang'] === newLang);

  state.languages.map((lang) => lang.className = 'languages__toggle');
  activeLang[0].className = 'languages__toggle languages__toggle--is-active';

  return activeLang[0];
};

const keypress = {
  enter() {
    return actions.speakText();
  },

  escape() {
    return actions.clearText();
  },

  letter(key) {
    const currentText = state.output.value;
    return speak(currentText[currentText.length - 1]);
  },
};

const actions = {
  handleKeyup(event) {
    if (e.code === 'Enter') { keypress.enter(); };
    if (e.code === 'Escape') { keypress.escape(); };
    if (letters.indexOf(event.code) === -1) { return false; };

    return keypress.letter(event.key);
  },

  changeLanguage(e) {
    const newLang = e.target.dataset['lang'];

    toggleLangButtons(newLang);
    return setProperty('lang', newLang);
  },

  speakText() {
    const currentText = state.output.value;

    return speak(currentText);
  },

  clearText() {
    return renderText('');
  },
};

const bind = {
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
  },

  initSubmit() {
    setProperty('submit', document.querySelector('[name="speak-input"]'));
    return bind.submitButton();
  },

  initClear() {
    setProperty('clear', document.querySelector('[name="clear-input"]'));
    return bind.clearButton();
  },

  initSynth() {
    const synth = window.speechSynthesis;

    return setProperty('synth', synth);
  },

  initLanguages() {
    const nodeList = document.querySelectorAll('[name="change-language"]');
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
