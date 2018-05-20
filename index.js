const speak = function (text) {
  const synth = new SpeechSynthesisUtterance(text);
  synth.lang = state.lang;
  synth.rate = state.rate;

  return window.speechSynthesis.speak(synth);
};

const state = {
  input: null,
  output: null,
  clear: null,
  submit: null,
  languages: [],

  text: '',

  lang: 'fr',
  rate: '1',
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

const actions = {
  speakLetter(e) {
    console.log(e);
    // catch enter keyCode == 13
    // catch esc keyCode == 27
    // catch tab keyCode == 9: block event
    // catch backspace keyCode == 8: block event

    setText(state.text + e.key);
    return speak(state.text[state.text.length - 1]);
  },

  changeLanguage(e) {
    const newLang = e.target.dataset['lang']
    return setProperty('lang', newLang);
  },

  speakInput() {
    setProperty('text', state.text);
    return speak(state.text);
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
    return state.submit.addEventListener('click', actions.speakInput);
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

    return this;
  },
};

app.init();
