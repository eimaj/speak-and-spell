/**
 * An Array of default languages based on the browser API
 *
 * @return {String[]}
 */
const languages = ['en-US', 'fr-CA'];

/**
 * An Array of available key codes that can be rendered into the textarea.
 *
 * @return {String[]}
 */
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

const locale = {
  'en-US': {
    title: 'Spell & Speak',
    warning: 'Check your volume before you type!',
    language: 'Language:',
    english: 'English',
    french: 'French',
    speak: 'Speak! (Enter)',
    clear: 'Clear (Esc)',
    built: 'Built by @eimaj',
    source: 'Source on Github',
  },
  'fr-CA': {
    title: 'Épeler et Parler',
    warning: 'Vérifiez votre volume avant de taper!',
    language: 'Langue:',
    english: 'Anglais',
    french: 'Français',
    speak: 'Parler! (Entre)',
    clear: 'Recommencer (Esc)',
    built: 'Construit par @eimaj',
    source: 'Source sur Github',
  },
};

/**
 * The initial state Object for this application.
 *
 * @return {Object}
 */
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

/**
 * The method that sets a value in the state Object.
 *
 * @param  {String}                        key   The key whose value will be set
 * @param  {Boolean|String|Array|Object}   value The value to set at key
 * @return {Boolean|String|Array|Object}
 */
const setProperty = function(key, value) {
  state[key] = value;
  return state[key];
};

/**
 * A method to set the value of the textarea.
 *
 * @param  {String} text The text to set as the textarea value
 * @return {String}      The updated value of textarea
 */
const renderText = function(text) {
  state.textarea.value = text;

  return state.textarea.value;
};

/**
 * Create a new utterance, triggers synth.cancel() and speak() the new utterance.
 *
 * @param  {String} text  The text to speak
 * @return {Undefined}
 */
const speak = function(text) {
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

/**
 * Updates the UI strings based on the language selected.
 *
 * @param  {String} text  The locale [en-US, fr-CA]
 * @return {Array}        An array of translated UI keys/values
 */
const setLanguageStrings = function(newLang) {
  const localeStrings = locale[newLang];
  const translateNodes = document.querySelectorAll('.translate');

  return [...translateNodes].map(node => {
    const attr = node.attributes.getNamedItem('name').nodeValue;

    node.innerText = localeStrings[attr] || 'Missing translation';
    return { [attr]: localeStrings[attr] };
  });
};

/**
 * Updates the lang state and toggles the active class on the button.
 *
 * @param  {String} newLang   The lang that will be set
 * @return {HTMLElement}      The active button
 */
const toggleLangButtons = function(newLang) {
  const activeLang = state.languageButtons.filter(language => language.dataset['lang'] === newLang);

  state.languageButtons.map(lang => (lang.className = 'languages__toggle'));
  activeLang[0].className = 'languages__toggle languages__toggle--is-active';

  return activeLang[0];
};

/**
 * The Object that contains keypress methods.
 */
const keypress = {
  /**
   * Triggers the speakText method when Enter is pressed.
   *
   * @return {Undefined}  The return from speak()
   */
  enter() {
    return actions.speakText();
  },

  /**
   * Triggers the clearText() method.
   *
   * @return {String}  An empty String returned by renderText()
   */
  escape() {
    return actions.clearText();
  },

  /**
   * Captures the last character from textarea an passes it to speak().
   *
   * @return {Undefined}  The return from speak()
   */
  letter() {
    const currentText = state.textarea.value;

    return speak(currentText[currentText.length - 1]);
  },
};

/**
 * The Object that contains application actions.
 */
const actions = {
  /**
   * Recieves the keyup Event and figures out what to do with it.
   *
   * @param  {Event.<keyup>} event The keyup action from textarea
   * @return {Undefined|String}    A return from the keypress methods
   */
  handleKeyup(event) {
    if (event.code === 'Enter') {
      keypress.enter();
    }
    if (event.code === 'Escape') {
      keypress.escape();
    }
    if (letters.indexOf(event.code) === -1) {
      return false;
    }

    return keypress.letter(event.key);
  },

  /**
   * Recieves the language button press event and toggles the lang.
   *
   * @param  {Event.<click>} event The click event from the language button
   * @return {String}              The updated lang String via setProperty()
   */
  changeLanguage(event) {
    const newLang = event.target.dataset['lang'];

    setLanguageStrings(newLang);
    toggleLangButtons(newLang);
    return setProperty('lang', newLang);
  },

  /**
   * Gets the textarea.value and sends it to speak().
   *
   * @return {Undefined}  The return from speak()
   */
  speakText() {
    const currentText = state.textarea.value;

    return speak(currentText);
  },

  /**
   * Resets the textarea.value to ''.
   *
   * @return {String}   The updated value of textarea
   */
  clearText() {
    return renderText('');
  },
};

const bind = {
  /**
   * Binds a handleKeyup methos to the textarea keyup event.
   *
   * @return {Undefined}  Return from addEventListener()
   */
  textarea() {
    return state.textarea.addEventListener('keyup', actions.handleKeyup);
  },

  /**
   * Binds the changeLanguage method to the language button click events.
   *
   * @return {Array.<Undefined>}  An array of undefined responses from addEventListener()s
   */
  languageButtons() {
    return state.languageButtons.map(function(language) {
      return language.addEventListener('click', actions.changeLanguage);
    });
  },
};

const app = {
  /**
   * Save the textarea HTMLElement to state.
   *
   * @return {Undefined}  Triggers the bind.textarea method textarea
   */
  initTextArea() {
    const textarea = document.querySelector('[name="textarea"]');

    setProperty('textarea', textarea);
    return bind.textarea();
  },

  /**
   * initSynth - Creates an instance of speechSynthesis and saves it to the state.
   *
   * @return {SpeechSynthesis}  The instance of SpeechSynthesis
   */
  initSynth() {
    const synth = window.speechSynthesis;

    return setProperty('synth', synth);
  },

  /**
   * initLanguages - Saves an Array of languageButtons to the state and triggers
   * the bind.languageButtons()
   *
   * @return {Array.<Undefined>}  The response from the bind.languageButtons method
   */
  initLanguages() {
    const nodeList = document.querySelectorAll('[ref="change-language"]');
    const languageButtons = Array.from(nodeList);

    setLanguageStrings(state.lang);
    setProperty('languageButtons', languageButtons);
    return bind.languageButtons();
  },

  /**
   * init - Initialize the app by triggering all each init method.
   *
   * @return {Object}
   */
  init() {
    this.initTextArea();
    this.initLanguages();
    this.initSynth();

    return this;
  },
};

app.init();
