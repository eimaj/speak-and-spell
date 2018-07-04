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
  textarea: null,
  clear: null,
  submit: null,
  languageButtons: [],

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
  state.textarea.value = text;

  return state.textarea.value;
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
  const activeLang = state.languageButtons.filter(language => language.dataset['lang'] === newLang);

  state.languageButtons.map((lang) => lang.className = 'languages__toggle');
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

  letter() {
    const currentText = state.textarea.value;

    return speak(currentText[currentText.length - 1]);
  },
};

const actions = {
  handleKeyup(event) {
    if (event.code === 'Enter') { keypress.enter(); };
    if (event.code === 'Escape') { keypress.escape(); };
    if (letters.indexOf(event.code) === -1) { return false; };

    return keypress.letter(event.key);
  },

  changeLanguage(event) {
    const newLang = event.target.dataset['lang'];

    toggleLangButtons(newLang);
    return setProperty('lang', newLang);
  },

  speakText() {
    const currentText = state.textarea.value;

    return speak(currentText);
  },

  clearText() {
    return renderText('');
  },
};

const bind = {
  textarea() {
    return state.textarea.addEventListener('keyup', actions.handleKeyup);
  },

  languageButtons() {
    return state.languageButtons.map(function (language) {
      return language.addEventListener('click', actions.changeLanguage)
    });
  },
};

const app = {
  initTextArea() {
    const textarea = document.querySelector('[name="textarea"]');

    setProperty('textarea', textarea);
    return bind.textarea();
  },

  initSynth() {
    const synth = window.speechSynthesis;

    return setProperty('synth', synth);
  },

  initLanguages() {
    const nodeList = document.querySelectorAll('[name="change-language"]');
    const languageButtons = Array.from(nodeList);

    setProperty('languageButtons', languageButtons);
    return bind.languageButtons();
  },

  init() {
    this.initTextArea();
    this.initLanguages();
    this.initSynth();

    return this;
  },
};

app.init();
