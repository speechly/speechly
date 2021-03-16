
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    function attribute_to_object(attributes) {
        const result = {};
        for (const attribute of attributes) {
            result[attribute.name] = attribute.value;
        }
        return result;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                const { on_mount } = this.$$;
                this.$$.on_disconnect = on_mount.map(run).filter(is_function);
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            disconnectedCallback() {
                run_all(this.$$.on_disconnect);
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set($$props) {
                if (this.$$set && !is_empty($$props)) {
                    this.$$.skip_bound = true;
                    this.$$set($$props);
                    this.$$.skip_bound = false;
                }
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var types$3 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    (function (ClientState) {
        ClientState[ClientState["Failed"] = 0] = "Failed";
        ClientState[ClientState["NoBrowserSupport"] = 1] = "NoBrowserSupport";
        ClientState[ClientState["NoAudioConsent"] = 2] = "NoAudioConsent";
        ClientState[ClientState["Disconnected"] = 3] = "Disconnected";
        ClientState[ClientState["Disconnecting"] = 4] = "Disconnecting";
        ClientState[ClientState["Connecting"] = 5] = "Connecting";
        ClientState[ClientState["Connected"] = 6] = "Connected";
        ClientState[ClientState["Starting"] = 7] = "Starting";
        ClientState[ClientState["Stopping"] = 8] = "Stopping";
        ClientState[ClientState["Recording"] = 9] = "Recording";
    })(exports.ClientState || (exports.ClientState = {}));
    //# sourceMappingURL=types.js.map
    });

    /**
     * Converts client state value to a string, which could be useful for debugging or metrics.
     * @param state - the state of the client
     * @public
     */
    function stateToString(state) {
        var _a;
        return (_a = states.get(state)) !== null && _a !== void 0 ? _a : unknown;
    }
    var stateToString_1 = stateToString;
    // TODO: generate this from the enum.
    const unknown = 'Unknown';
    const states = new Map([
        [types$3.ClientState.Failed, 'Failed'],
        [types$3.ClientState.NoBrowserSupport, 'NoBrowserSupport'],
        [types$3.ClientState.NoAudioConsent, 'NoAudioConsent'],
        [types$3.ClientState.Disconnecting, 'Disconnecting'],
        [types$3.ClientState.Disconnected, 'Disconnected'],
        [types$3.ClientState.Connecting, 'Connecting'],
        [types$3.ClientState.Connected, 'Connected'],
        [types$3.ClientState.Starting, 'Starting'],
        [types$3.ClientState.Stopping, 'Stopping'],
        [types$3.ClientState.Recording, 'Recording'],
    ]);


    var state = /*#__PURE__*/Object.defineProperty({
    	stateToString: stateToString_1
    }, '__esModule', {value: true});

    const LANGUAGES_LIST = {
      aa: {
        name: 'Afar',
        nativeName: 'Afaraf',
      },
      ab: {
        name: 'Abkhaz',
        nativeName: 'аҧсуа бызшәа',
      },
      ae: {
        name: 'Avestan',
        nativeName: 'avesta',
      },
      af: {
        name: 'Afrikaans',
        nativeName: 'Afrikaans',
      },
      ak: {
        name: 'Akan',
        nativeName: 'Akan',
      },
      am: {
        name: 'Amharic',
        nativeName: 'አማርኛ',
      },
      an: {
        name: 'Aragonese',
        nativeName: 'aragonés',
      },
      ar: {
        name: 'Arabic',
        nativeName: 'اللغة العربية',
      },
      as: {
        name: 'Assamese',
        nativeName: 'অসমীয়া',
      },
      av: {
        name: 'Avaric',
        nativeName: 'авар мацӀ',
      },
      ay: {
        name: 'Aymara',
        nativeName: 'aymar aru',
      },
      az: {
        name: 'Azerbaijani',
        nativeName: 'azərbaycan dili',
      },
      ba: {
        name: 'Bashkir',
        nativeName: 'башҡорт теле',
      },
      be: {
        name: 'Belarusian',
        nativeName: 'беларуская мова',
      },
      bg: {
        name: 'Bulgarian',
        nativeName: 'български език',
      },
      bh: {
        name: 'Bihari',
        nativeName: 'भोजपुरी',
      },
      bi: {
        name: 'Bislama',
        nativeName: 'Bislama',
      },
      bm: {
        name: 'Bambara',
        nativeName: 'bamanankan',
      },
      bn: {
        name: 'Bengali',
        nativeName: 'বাংলা',
      },
      bo: {
        name: 'Tibetan',
        nativeName: 'བོད་ཡིག',
      },
      br: {
        name: 'Breton',
        nativeName: 'brezhoneg',
      },
      bs: {
        name: 'Bosnian',
        nativeName: 'bosanski jezik',
      },
      ca: {
        name: 'Catalan',
        nativeName: 'Català',
      },
      ce: {
        name: 'Chechen',
        nativeName: 'нохчийн мотт',
      },
      ch: {
        name: 'Chamorro',
        nativeName: 'Chamoru',
      },
      co: {
        name: 'Corsican',
        nativeName: 'corsu',
      },
      cr: {
        name: 'Cree',
        nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ',
      },
      cs: {
        name: 'Czech',
        nativeName: 'čeština',
      },
      cu: {
        name: 'Old Church Slavonic',
        nativeName: 'ѩзыкъ словѣньскъ',
      },
      cv: {
        name: 'Chuvash',
        nativeName: 'чӑваш чӗлхи',
      },
      cy: {
        name: 'Welsh',
        nativeName: 'Cymraeg',
      },
      da: {
        name: 'Danish',
        nativeName: 'dansk',
      },
      de: {
        name: 'German',
        nativeName: 'Deutsch',
      },
      dv: {
        name: 'Divehi',
        nativeName: 'Dhivehi',
      },
      dz: {
        name: 'Dzongkha',
        nativeName: 'རྫོང་ཁ',
      },
      ee: {
        name: 'Ewe',
        nativeName: 'Eʋegbe',
      },
      el: {
        name: 'Greek',
        nativeName: 'Ελληνικά',
      },
      en: {
        name: 'English',
        nativeName: 'English',
      },
      eo: {
        name: 'Esperanto',
        nativeName: 'Esperanto',
      },
      es: {
        name: 'Spanish',
        nativeName: 'Español',
      },
      et: {
        name: 'Estonian',
        nativeName: 'eesti',
      },
      eu: {
        name: 'Basque',
        nativeName: 'euskara',
      },
      fa: {
        name: 'Persian',
        nativeName: 'فارسی',
      },
      ff: {
        name: 'Fula',
        nativeName: 'Fulfulde',
      },
      fi: {
        name: 'Finnish',
        nativeName: 'suomi',
      },
      fj: {
        name: 'Fijian',
        nativeName: 'Vakaviti',
      },
      fo: {
        name: 'Faroese',
        nativeName: 'føroyskt',
      },
      fr: {
        name: 'French',
        nativeName: 'Français',
      },
      fy: {
        name: 'Western Frisian',
        nativeName: 'Frysk',
      },
      ga: {
        name: 'Irish',
        nativeName: 'Gaeilge',
      },
      gd: {
        name: 'Scottish Gaelic',
        nativeName: 'Gàidhlig',
      },
      gl: {
        name: 'Galician',
        nativeName: 'galego',
      },
      gn: {
        name: 'Guaraní',
        nativeName: "Avañe'ẽ",
      },
      gu: {
        name: 'Gujarati',
        nativeName: 'ગુજરાતી',
      },
      gv: {
        name: 'Manx',
        nativeName: 'Gaelg',
      },
      ha: {
        name: 'Hausa',
        nativeName: 'هَوُسَ',
      },
      he: {
        name: 'Hebrew',
        nativeName: 'עברית',
      },
      hi: {
        name: 'Hindi',
        nativeName: 'हिन्दी',
      },
      ho: {
        name: 'Hiri Motu',
        nativeName: 'Hiri Motu',
      },
      hr: {
        name: 'Croatian',
        nativeName: 'Hrvatski',
      },
      ht: {
        name: 'Haitian',
        nativeName: 'Kreyòl ayisyen',
      },
      hu: {
        name: 'Hungarian',
        nativeName: 'Magyar',
      },
      hy: {
        name: 'Armenian',
        nativeName: 'Հայերեն',
      },
      hz: {
        name: 'Herero',
        nativeName: 'Otjiherero',
      },
      ia: {
        name: 'Interlingua',
        nativeName: 'Interlingua',
      },
      id: {
        name: 'Indonesian',
        nativeName: 'Bahasa Indonesia',
      },
      ie: {
        name: 'Interlingue',
        nativeName: 'Interlingue',
      },
      ig: {
        name: 'Igbo',
        nativeName: 'Asụsụ Igbo',
      },
      ii: {
        name: 'Nuosu',
        nativeName: 'ꆈꌠ꒿ Nuosuhxop',
      },
      ik: {
        name: 'Inupiaq',
        nativeName: 'Iñupiaq',
      },
      io: {
        name: 'Ido',
        nativeName: 'Ido',
      },
      is: {
        name: 'Icelandic',
        nativeName: 'Íslenska',
      },
      it: {
        name: 'Italian',
        nativeName: 'Italiano',
      },
      iu: {
        name: 'Inuktitut',
        nativeName: 'ᐃᓄᒃᑎᑐᑦ',
      },
      ja: {
        name: 'Japanese',
        nativeName: '日本語',
      },
      jv: {
        name: 'Javanese',
        nativeName: 'basa Jawa',
      },
      ka: {
        name: 'Georgian',
        nativeName: 'ქართული',
      },
      kg: {
        name: 'Kongo',
        nativeName: 'Kikongo',
      },
      ki: {
        name: 'Kikuyu',
        nativeName: 'Gĩkũyũ',
      },
      kj: {
        name: 'Kwanyama',
        nativeName: 'Kuanyama',
      },
      kk: {
        name: 'Kazakh',
        nativeName: 'қазақ тілі',
      },
      kl: {
        name: 'Kalaallisut',
        nativeName: 'kalaallisut',
      },
      km: {
        name: 'Khmer',
        nativeName: 'ខេមរភាសា',
      },
      kn: {
        name: 'Kannada',
        nativeName: 'ಕನ್ನಡ',
      },
      ko: {
        name: 'Korean',
        nativeName: '한국어',
      },
      kr: {
        name: 'Kanuri',
        nativeName: 'Kanuri',
      },
      ks: {
        name: 'Kashmiri',
        nativeName: 'कश्मीरी',
      },
      ku: {
        name: 'Kurdish',
        nativeName: 'Kurdî',
      },
      kv: {
        name: 'Komi',
        nativeName: 'коми кыв',
      },
      kw: {
        name: 'Cornish',
        nativeName: 'Kernewek',
      },
      ky: {
        name: 'Kyrgyz',
        nativeName: 'Кыргызча',
      },
      la: {
        name: 'Latin',
        nativeName: 'latine',
      },
      lb: {
        name: 'Luxembourgish',
        nativeName: 'Lëtzebuergesch',
      },
      lg: {
        name: 'Ganda',
        nativeName: 'Luganda',
      },
      li: {
        name: 'Limburgish',
        nativeName: 'Limburgs',
      },
      ln: {
        name: 'Lingala',
        nativeName: 'Lingála',
      },
      lo: {
        name: 'Lao',
        nativeName: 'ພາສາ',
      },
      lt: {
        name: 'Lithuanian',
        nativeName: 'lietuvių kalba',
      },
      lu: {
        name: 'Luba-Katanga',
        nativeName: 'Tshiluba',
      },
      lv: {
        name: 'Latvian',
        nativeName: 'latviešu valoda',
      },
      mg: {
        name: 'Malagasy',
        nativeName: 'fiteny malagasy',
      },
      mh: {
        name: 'Marshallese',
        nativeName: 'Kajin M̧ajeļ',
      },
      mi: {
        name: 'Māori',
        nativeName: 'te reo Māori',
      },
      mk: {
        name: 'Macedonian',
        nativeName: 'македонски јазик',
      },
      ml: {
        name: 'Malayalam',
        nativeName: 'മലയാളം',
      },
      mn: {
        name: 'Mongolian',
        nativeName: 'Монгол хэл',
      },
      mr: {
        name: 'Marathi',
        nativeName: 'मराठी',
      },
      ms: {
        name: 'Malay',
        nativeName: 'Bahasa Malaysia',
      },
      mt: {
        name: 'Maltese',
        nativeName: 'Malti',
      },
      my: {
        name: 'Burmese',
        nativeName: 'ဗမာစာ',
      },
      na: {
        name: 'Nauru',
        nativeName: 'Ekakairũ Naoero',
      },
      nb: {
        name: 'Norwegian Bokmål',
        nativeName: 'Norsk bokmål',
      },
      nd: {
        name: 'Northern Ndebele',
        nativeName: 'isiNdebele',
      },
      ne: {
        name: 'Nepali',
        nativeName: 'नेपाली',
      },
      ng: {
        name: 'Ndonga',
        nativeName: 'Owambo',
      },
      nl: {
        name: 'Dutch',
        nativeName: 'Nederlands',
      },
      nn: {
        name: 'Norwegian Nynorsk',
        nativeName: 'Norsk nynorsk',
      },
      no: {
        name: 'Norwegian',
        nativeName: 'Norsk',
      },
      nr: {
        name: 'Southern Ndebele',
        nativeName: 'isiNdebele',
      },
      nv: {
        name: 'Navajo',
        nativeName: 'Diné bizaad',
      },
      ny: {
        name: 'Chichewa',
        nativeName: 'chiCheŵa',
      },
      oc: {
        name: 'Occitan',
        nativeName: 'occitan',
      },
      oj: {
        name: 'Ojibwe',
        nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ',
      },
      om: {
        name: 'Oromo',
        nativeName: 'Afaan Oromoo',
      },
      or: {
        name: 'Oriya',
        nativeName: 'ଓଡ଼ିଆ',
      },
      os: {
        name: 'Ossetian',
        nativeName: 'ирон æвзаг',
      },
      pa: {
        name: 'Panjabi',
        nativeName: 'ਪੰਜਾਬੀ',
      },
      pi: {
        name: 'Pāli',
        nativeName: 'पाऴि',
      },
      pl: {
        name: 'Polish',
        nativeName: 'język polski',
      },
      ps: {
        name: 'Pashto',
        nativeName: 'پښتو',
      },
      pt: {
        name: 'Portuguese',
        nativeName: 'Português',
      },
      qu: {
        name: 'Quechua',
        nativeName: 'Runa Simi',
      },
      rm: {
        name: 'Romansh',
        nativeName: 'rumantsch grischun',
      },
      rn: {
        name: 'Kirundi',
        nativeName: 'Ikirundi',
      },
      ro: {
        name: 'Romanian',
        nativeName: 'Română',
      },
      ru: {
        name: 'Russian',
        nativeName: 'Русский',
      },
      rw: {
        name: 'Kinyarwanda',
        nativeName: 'Ikinyarwanda',
      },
      sa: {
        name: 'Sanskrit',
        nativeName: 'संस्कृतम्',
      },
      sc: {
        name: 'Sardinian',
        nativeName: 'sardu',
      },
      sd: {
        name: 'Sindhi',
        nativeName: 'सिन्धी',
      },
      se: {
        name: 'Northern Sami',
        nativeName: 'Davvisámegiella',
      },
      sg: {
        name: 'Sango',
        nativeName: 'yângâ tî sängö',
      },
      si: {
        name: 'Sinhala',
        nativeName: 'සිංහල',
      },
      sk: {
        name: 'Slovak',
        nativeName: 'slovenčina',
      },
      sl: {
        name: 'Slovenian',
        nativeName: 'slovenski jezik',
      },
      sm: {
        name: 'Samoan',
        nativeName: "gagana fa'a Samoa",
      },
      sn: {
        name: 'Shona',
        nativeName: 'chiShona',
      },
      so: {
        name: 'Somali',
        nativeName: 'Soomaaliga',
      },
      sq: {
        name: 'Albanian',
        nativeName: 'Shqip',
      },
      sr: {
        name: 'Serbian',
        nativeName: 'српски језик',
      },
      ss: {
        name: 'Swati',
        nativeName: 'SiSwati',
      },
      st: {
        name: 'Southern Sotho',
        nativeName: 'Sesotho',
      },
      su: {
        name: 'Sundanese',
        nativeName: 'Basa Sunda',
      },
      sv: {
        name: 'Swedish',
        nativeName: 'Svenska',
      },
      sw: {
        name: 'Swahili',
        nativeName: 'Kiswahili',
      },
      ta: {
        name: 'Tamil',
        nativeName: 'தமிழ்',
      },
      te: {
        name: 'Telugu',
        nativeName: 'తెలుగు',
      },
      tg: {
        name: 'Tajik',
        nativeName: 'тоҷикӣ',
      },
      th: {
        name: 'Thai',
        nativeName: 'ไทย',
      },
      ti: {
        name: 'Tigrinya',
        nativeName: 'ትግርኛ',
      },
      tk: {
        name: 'Turkmen',
        nativeName: 'Türkmen',
      },
      tl: {
        name: 'Tagalog',
        nativeName: 'Wikang Tagalog',
      },
      tn: {
        name: 'Tswana',
        nativeName: 'Setswana',
      },
      to: {
        name: 'Tonga',
        nativeName: 'faka Tonga',
      },
      tr: {
        name: 'Turkish',
        nativeName: 'Türkçe',
      },
      ts: {
        name: 'Tsonga',
        nativeName: 'Xitsonga',
      },
      tt: {
        name: 'Tatar',
        nativeName: 'татар теле',
      },
      tw: {
        name: 'Twi',
        nativeName: 'Twi',
      },
      ty: {
        name: 'Tahitian',
        nativeName: 'Reo Tahiti',
      },
      ug: {
        name: 'Uyghur',
        nativeName: 'ئۇيغۇرچە‎',
      },
      uk: {
        name: 'Ukrainian',
        nativeName: 'Українська',
      },
      ur: {
        name: 'Urdu',
        nativeName: 'اردو',
      },
      uz: {
        name: 'Uzbek',
        nativeName: 'Ўзбек',
      },
      ve: {
        name: 'Venda',
        nativeName: 'Tshivenḓa',
      },
      vi: {
        name: 'Vietnamese',
        nativeName: 'Tiếng Việt',
      },
      vo: {
        name: 'Volapük',
        nativeName: 'Volapük',
      },
      wa: {
        name: 'Walloon',
        nativeName: 'walon',
      },
      wo: {
        name: 'Wolof',
        nativeName: 'Wollof',
      },
      xh: {
        name: 'Xhosa',
        nativeName: 'isiXhosa',
      },
      yi: {
        name: 'Yiddish',
        nativeName: 'ייִדיש',
      },
      yo: {
        name: 'Yoruba',
        nativeName: 'Yorùbá',
      },
      za: {
        name: 'Zhuang',
        nativeName: 'Saɯ cueŋƅ',
      },
      zh: {
        name: 'Chinese',
        nativeName: '中文',
      },
      zu: {
        name: 'Zulu',
        nativeName: 'isiZulu',
      },
    };

    class ISO6391 {
      static getLanguages(codes = []) {
        return codes.map(code => ({
          code,
          name: ISO6391.getName(code),
          nativeName: ISO6391.getNativeName(code),
        }));
      }

      static getName(code) {
        return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : '';
      }

      static getAllNames() {
        return Object.values(LANGUAGES_LIST).map(l => l.name);
      }

      static getNativeName(code) {
        return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : '';
      }

      static getAllNativeNames() {
        return Object.values(LANGUAGES_LIST).map(l => l.nativeName);
      }

      static getCode(name) {
        const code = Object.keys(LANGUAGES_LIST).find(code => {
          const language = LANGUAGES_LIST[code];

          return (
            language.name.toLowerCase() === name.toLowerCase() ||
            language.nativeName.toLowerCase() === name.toLowerCase()
          );
        });
        return code || '';
      }

      static getAllCodes() {
        return Object.keys(LANGUAGES_LIST);
      }

      static validate(code) {
        return LANGUAGES_LIST.hasOwnProperty(code);
      }
    }

    const LANGUAGES_ZH_NAMES = {
      aa: '阿法尔语',
      ab: '阿布哈兹语',
      ae: '阿维斯陀语',
      af: '南非荷兰语',
      ak: '阿坎语',
      am: '阿姆哈拉语',
      an: '阿拉贡语',
      ar: '阿拉伯语',
      as: '阿萨姆语',
      av: '阿瓦尔语',
      ay: '艾马拉语',
      az: '阿塞拜疆语',
      ba: '巴什基尔语',
      be: '白俄罗斯语',
      bg: '保加利亚语',
      bh: '比哈尔语',
      bi: '比斯拉马语',
      bm: '班巴拉语',
      bn: '孟加拉语',
      bo: '藏语',
      br: '布列塔尼语',
      bs: '波斯尼亚语',
      ca: '加泰罗尼亚语',
      ce: '车臣语',
      ch: '查莫洛语',
      co: '科西嘉语',
      cr: '克里语',
      cs: '捷克语',
      cu: '古教会斯拉夫语',
      cv: '楚瓦什语',
      cy: '威尔士语',
      da: '丹麦语',
      de: '德语',
      dv: '迪维希语',
      dz: '不丹语',
      ee: '埃维语',
      el: '希腊语',
      en: '英语',
      eo: '世界语',
      es: '西班牙语',
      et: '爱沙尼亚语',
      eu: '巴斯克语',
      fa: '波斯语',
      ff: '富拉语',
      fi: '芬兰语',
      fj: '斐济语',
      fo: '法罗语',
      fr: '法语',
      fy: '西弗里西亚语',
      ga: '爱尔兰语',
      gd: '苏格兰盖尔语',
      gl: '加利西亚语',
      gn: '瓜拉尼语',
      gu: '古吉拉特语',
      gv: '马恩岛语',
      ha: '豪萨语',
      he: '希伯来语',
      hi: '印地语',
      ho: '莫图语',
      hr: '克罗地亚语',
      ht: '海地文',
      hu: '匈牙利语',
      hy: '亚美尼亚语',
      hz: '赫勒娄语',
      ia: '国际语',
      id: '印尼语',
      ie: '国际语',
      ig: '伊博语',
      ii: '诺苏语',
      ik: '依奴皮维克文',
      io: '伊多文',
      is: '冰岛语',
      it: '意大利语',
      iu: '因纽特语',
      ja: '日语',
      jv: '爪哇语',
      ka: '格鲁吉亚语',
      kg: '刚果语',
      ki: '基库尤语',
      kj: '宽亚马语',
      kk: '哈萨克语',
      kl: '格陵兰语',
      km: '高棉语',
      kn: '卡纳达语',
      ko: '韩语',
      kr: '卡努里语',
      ks: '克什米尔语',
      ku: '库尔德语',
      kv: '科米语',
      kw: '科尼什语',
      ky: '吉尔吉斯语',
      la: '拉丁语',
      lb: '卢森堡语',
      lg: '甘达语',
      li: '林堡语',
      ln: '林加拉语',
      lo: '老挝语',
      lt: '立陶宛语',
      lu: '卢巴加丹加语',
      lv: '拉脱维亚语',
      mg: '马尔加什语',
      mh: '马绍尔语',
      mi: '毛利语',
      mk: '马其顿语',
      ml: '马拉雅拉姆语',
      mn: '蒙古文',
      mr: '马拉地语',
      ms: '马来语',
      mt: '马耳他语',
      my: '缅甸语',
      na: '瑙鲁语',
      nb: '挪威博克马尔语',
      nd: '北恩德贝勒语',
      ne: '尼泊尔语',
      ng: '尼日尔刚果语',
      nl: '荷兰语',
      nn: '挪威尼诺斯克语',
      no: '挪威语',
      nr: '南恩德贝勒语',
      nv: '纳瓦霍语',
      ny: '齐切瓦语',
      oc: '奥克西唐语',
      oj: '欧及布威语',
      om: '奥罗莫语',
      or: '奥里亚语',
      os: '奥塞梯语',
      pa: '旁遮普语',
      pi: '巴利语',
      pl: '波兰语',
      ps: '普什图语',
      pt: '葡萄牙语',
      qu: '克丘亚语',
      rm: '罗曼斯语',
      rn: '基隆迪语',
      ro: '罗马尼亚语',
      ru: '俄语',
      rw: '卢旺达语',
      sa: '梵文',
      sc: '撒丁岛语',
      sd: '信德语',
      se: '北萨米文',
      sg: '桑戈语',
      si: '僧伽罗语',
      sk: '斯洛伐克语',
      sl: '斯洛文尼亚语',
      sm: '萨摩亚语',
      sn: '绍纳语',
      so: '索马里语',
      sq: '阿尔巴尼亚语',
      sr: '塞尔维亚语',
      ss: '斯瓦蒂语',
      st: '南索托语',
      su: '巽他语',
      sv: '瑞典语',
      sw: '斯瓦希里语',
      ta: '泰米尔语',
      te: '泰卢固语',
      tg: '塔吉克语',
      th: '泰语',
      ti: '提格雷语',
      tk: '土库曼语',
      tl: '菲律宾语',
      tn: '茨瓦纳语',
      to: '汤加语',
      tr: '土耳其语',
      ts: '特松加语',
      tt: '塔塔尔语',
      tw: '契维语',
      ty: '塔希提语',
      ug: '维吾尔语',
      uk: '乌克兰语',
      ur: '乌尔都语',
      uz: '乌兹别克语',
      ve: '文达语',
      vi: '越南语',
      vo: '沃拉普克语',
      wa: '华隆语',
      wo: '沃洛夫语',
      xh: '科萨语',
      yi: '意第绪语',
      yo: '约鲁巴语',
      za: '壮语',
      zh: '中文',
      zu: '祖鲁语',
    };

    class ISO6391ZH extends ISO6391 {
      static getLanguages(codes) {
        return super.getLanguages(codes).map(language => {
          Object.assign(language, {
            zhName: ISO6391ZH.getZhName(language.code),
          });
          return language;
        });
      }

      static getZhName(code) {
        return super.validate(code) ? LANGUAGES_ZH_NAMES[code] : '';
      }

      static getAllZhNames() {
        return Object.values(LANGUAGES_ZH_NAMES);
      }
    }

    /**
         * Safer Object.hasOwnProperty
         */
         function hasOwn(obj, prop){
             return Object.prototype.hasOwnProperty.call(obj, prop);
         }

         var hasOwn_1 = hasOwn;

    var _hasDontEnumBug,
            _dontEnums;

        function checkDontEnum(){
            _dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ];

            _hasDontEnumBug = true;

            for (var key in {'toString': null}) {
                _hasDontEnumBug = false;
            }
        }

        /**
         * Similar to Array/forEach but works over object properties and fixes Don't
         * Enum bug on IE.
         * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
         */
        function forIn(obj, fn, thisObj){
            var key, i = 0;
            // no need to check if argument is a real object that way we can use
            // it for arrays, functions, date, etc.

            //post-pone check till needed
            if (_hasDontEnumBug == null) checkDontEnum();

            for (key in obj) {
                if (exec(fn, obj, key, thisObj) === false) {
                    break;
                }
            }


            if (_hasDontEnumBug) {
                var ctor = obj.constructor,
                    isProto = !!ctor && obj === ctor.prototype;

                while (key = _dontEnums[i++]) {
                    // For constructor, if it is a prototype object the constructor
                    // is always non-enumerable unless defined otherwise (and
                    // enumerated above).  For non-prototype objects, it will have
                    // to be defined on this object, since it cannot be defined on
                    // any prototype objects.
                    //
                    // For other [[DontEnum]] properties, check if the value is
                    // different than Object prototype value.
                    if (
                        (key !== 'constructor' ||
                            (!isProto && hasOwn_1(obj, key))) &&
                        obj[key] !== Object.prototype[key]
                    ) {
                        if (exec(fn, obj, key, thisObj) === false) {
                            break;
                        }
                    }
                }
            }
        }

        function exec(fn, obj, key, thisObj){
            return fn.call(thisObj, obj[key], key, obj);
        }

        var forIn_1 = forIn;

    /**
         * return a list of all enumerable properties that have function values
         */
        function functions(obj){
            var keys = [];
            forIn_1(obj, function(val, key){
                if (typeof val === 'function'){
                    keys.push(key);
                }
            });
            return keys.sort();
        }

        var functions_1 = functions;

    /**
         * Create slice of source array or array-like object
         */
        function slice(arr, start, end){
            var len = arr.length;

            if (start == null) {
                start = 0;
            } else if (start < 0) {
                start = Math.max(len + start, 0);
            } else {
                start = Math.min(start, len);
            }

            if (end == null) {
                end = len;
            } else if (end < 0) {
                end = Math.max(len + end, 0);
            } else {
                end = Math.min(end, len);
            }

            var result = [];
            while (start < end) {
                result.push(arr[start++]);
            }

            return result;
        }

        var slice_1 = slice;

    /**
         * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the beginning of the arguments collection.
         * @param {Function} fn  Function.
         * @param {object} context   Execution context.
         * @param {rest} args    Arguments (0...n arguments).
         * @return {Function} Wrapped Function.
         */
        function bind(fn, context, args){
            var argsArr = slice_1(arguments, 2); //curried args
            return function(){
                return fn.apply(context, argsArr.concat(slice_1(arguments)));
            };
        }

        var bind_1 = bind;

    /**
         * Array forEach
         */
        function forEach(arr, callback, thisObj) {
            if (arr == null) {
                return;
            }
            var i = -1,
                len = arr.length;
            while (++i < len) {
                // we iterate over sparse items since there is no way to make it
                // work properly on IE 7-8. see #64
                if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                    break;
                }
            }
        }

        var forEach_1 = forEach;

    /**
         * Binds methods of the object to be run in it's own context.
         */
        function bindAll(obj, rest_methodNames){
            var keys = arguments.length > 1?
                        slice_1(arguments, 1) : functions_1(obj);
            forEach_1(keys, function(key){
                obj[key] = bind_1(obj[key], obj);
            });
        }

        var bindAll_1 = bindAll;

    /**
         * Similar to Array/forEach but works over object properties and fixes Don't
         * Enum bug on IE.
         * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
         */
        function forOwn(obj, fn, thisObj){
            forIn_1(obj, function(val, key){
                if (hasOwn_1(obj, key)) {
                    return fn.call(thisObj, obj[key], key, obj);
                }
            });
        }

        var forOwn_1 = forOwn;

    /**
         * Returns the first argument provided to it.
         */
        function identity(val){
            return val;
        }

        var identity_1 = identity;

    /**
         * Returns a function that gets a property of the passed object
         */
        function prop(name){
            return function(obj){
                return obj[name];
            };
        }

        var prop_1 = prop;

    var _rKind = /^\[object (.*)\]$/,
            _toString = Object.prototype.toString,
            UNDEF$1;

        /**
         * Gets the "kind" of value. (e.g. "String", "Number", etc)
         */
        function kindOf(val) {
            if (val === null) {
                return 'Null';
            } else if (val === UNDEF$1) {
                return 'Undefined';
            } else {
                return _rKind.exec( _toString.call(val) )[1];
            }
        }
        var kindOf_1 = kindOf;

    /**
         * Check if value is from a specific "kind".
         */
        function isKind(val, kind){
            return kindOf_1(val) === kind;
        }
        var isKind_1 = isKind;

    /**
         */
        var isArray = Array.isArray || function (val) {
            return isKind_1(val, 'Array');
        };
        var isArray_1 = isArray;

    function containsMatch(array, pattern) {
            var i = -1, length = array.length;
            while (++i < length) {
                if (deepMatches(array[i], pattern)) {
                    return true;
                }
            }

            return false;
        }

        function matchArray(target, pattern) {
            var i = -1, patternLength = pattern.length;
            while (++i < patternLength) {
                if (!containsMatch(target, pattern[i])) {
                    return false;
                }
            }

            return true;
        }

        function matchObject(target, pattern) {
            var result = true;
            forOwn_1(pattern, function(val, key) {
                if (!deepMatches(target[key], val)) {
                    // Return false to break out of forOwn early
                    return (result = false);
                }
            });

            return result;
        }

        /**
         * Recursively check if the objects match.
         */
        function deepMatches(target, pattern){
            if (target && typeof target === 'object') {
                if (isArray_1(target) && isArray_1(pattern)) {
                    return matchArray(target, pattern);
                } else {
                    return matchObject(target, pattern);
                }
            } else {
                return target === pattern;
            }
        }

        var deepMatches_1 = deepMatches;

    /**
         * Converts argument into a valid iterator.
         * Used internally on most array/object/collection methods that receives a
         * callback/iterator providing a shortcut syntax.
         */
        function makeIterator(src, thisObj){
            if (src == null) {
                return identity_1;
            }
            switch(typeof src) {
                case 'function':
                    // function is the first to improve perf (most common case)
                    // also avoid using `Function#call` if not needed, which boosts
                    // perf a lot in some cases
                    return (typeof thisObj !== 'undefined')? function(val, i, arr){
                        return src.call(thisObj, val, i, arr);
                    } : src;
                case 'object':
                    return function(val){
                        return deepMatches_1(val, src);
                    };
                case 'string':
                case 'number':
                    return prop_1(src);
            }
        }

        var makeIterator_ = makeIterator;

    /**
         * Object some
         */
        function some(obj, callback, thisObj) {
            callback = makeIterator_(callback, thisObj);
            var result = false;
            forOwn_1(obj, function(val, key) {
                if (callback(val, key, obj)) {
                    result = true;
                    return false; // break
                }
            });
            return result;
        }

        var some_1 = some;

    /**
         * Check if object contains value
         */
        function contains$1(obj, needle) {
            return some_1(obj, function(val) {
                return (val === needle);
            });
        }
        var contains_1$1 = contains$1;

    /**
         * Checks if the value is created by the `Object` constructor.
         */
        function isPlainObject(value) {
            return (!!value && typeof value === 'object' &&
                value.constructor === Object);
        }

        var isPlainObject_1 = isPlainObject;

    /**
         * Deeply copy missing properties in the target from the defaults.
         */
        function deepFillIn(target, defaults){
            var i = 0,
                n = arguments.length,
                obj;

            while(++i < n) {
                obj = arguments[i];
                if (obj) {
                    // jshint loopfunc: true
                    forOwn_1(obj, function(newValue, key) {
                        var curValue = target[key];
                        if (curValue == null) {
                            target[key] = newValue;
                        } else if (isPlainObject_1(curValue) &&
                                   isPlainObject_1(newValue)) {
                            deepFillIn(curValue, newValue);
                        }
                    });
                }
            }

            return target;
        }

        var deepFillIn_1 = deepFillIn;

    /**
         * Mixes objects into the target object, recursively mixing existing child
         * objects.
         */
        function deepMixIn(target, objects) {
            var i = 0,
                n = arguments.length,
                obj;

            while(++i < n){
                obj = arguments[i];
                if (obj) {
                    forOwn_1(obj, copyProp$1, target);
                }
            }

            return target;
        }

        function copyProp$1(val, key) {
            var existing = this[key];
            if (isPlainObject_1(val) && isPlainObject_1(existing)) {
                deepMixIn(existing, val);
            } else {
                this[key] = val;
            }
        }

        var deepMixIn_1 = deepMixIn;

    /**
         * Object every
         */
        function every(obj, callback, thisObj) {
            callback = makeIterator_(callback, thisObj);
            var result = true;
            forOwn_1(obj, function(val, key) {
                // we consider any falsy values as "false" on purpose so shorthand
                // syntax can be used to check property existence
                if (!callback(val, key, obj)) {
                    result = false;
                    return false; // break
                }
            });
            return result;
        }

        var every_1 = every;

    /**
         */
        function isObject(val) {
            return isKind_1(val, 'Object');
        }
        var isObject_1 = isObject;

    /**
         * Check if both arguments are egal.
         */
        function is(x, y){
            // implementation borrowed from harmony:egal spec
            if (x === y) {
              // 0 === -0, but they are not identical
              return x !== 0 || 1 / x === 1 / y;
            }

            // NaN !== NaN, but they are identical.
            // NaNs are the only non-reflexive value, i.e., if x !== x,
            // then x is a NaN.
            // isNaN is broken: it converts its argument to number, so
            // isNaN("foo") => true
            return x !== x && y !== y;
        }

        var is_1 = is;

    // Makes a function to compare the object values from the specified compare
        // operation callback.
        function makeCompare(callback) {
            return function(value, key) {
                return hasOwn_1(this, key) && callback(value, this[key]);
            };
        }

        function checkProperties(value, key) {
            return hasOwn_1(this, key);
        }

        /**
         * Checks if two objects have the same keys and values.
         */
        function equals(a, b, callback) {
            callback = callback || is_1;

            if (!isObject_1(a) || !isObject_1(b)) {
                return callback(a, b);
            }

            return (every_1(a, makeCompare(callback), b) &&
                    every_1(b, checkProperties, a));
        }

        var equals_1 = equals;

    /**
         * Copy missing properties in the obj from the defaults.
         */
        function fillIn(obj, var_defaults){
            forEach_1(slice_1(arguments, 1), function(base){
                forOwn_1(base, function(val, key){
                    if (obj[key] == null) {
                        obj[key] = val;
                    }
                });
            });
            return obj;
        }

        var fillIn_1 = fillIn;

    /**
         * Creates a new object with all the properties where the callback returns
         * true.
         */
        function filterValues(obj, callback, thisObj) {
            callback = makeIterator_(callback, thisObj);
            var output = {};
            forOwn_1(obj, function(value, key, obj) {
                if (callback(value, key, obj)) {
                    output[key] = value;
                }
            });

            return output;
        }
        var filter = filterValues;

    /**
         * Returns first item that matches criteria
         */
        function find(obj, callback, thisObj) {
            callback = makeIterator_(callback, thisObj);
            var result;
            some_1(obj, function(value, key, obj) {
                if (callback(value, key, obj)) {
                    result = value;
                    return true; //break
                }
            });
            return result;
        }

        var find_1 = find;

    /*
         * Helper function to flatten to a destination object.
         * Used to remove the need to create intermediate objects while flattening.
         */
        function flattenTo(obj, result, prefix, level) {
            forOwn_1(obj, function (value, key) {
                var nestedPrefix = prefix ? prefix + '.' + key : key;

                if (level !== 0 && isPlainObject_1(value)) {
                    flattenTo(value, result, nestedPrefix, level - 1);
                } else {
                    result[nestedPrefix] = value;
                }
            });

            return result;
        }

        /**
         * Recursively flattens an object.
         * A new object containing all the elements is returned.
         * If level is specified, it will only flatten up to that level.
         */
        function flatten(obj, level) {
            if (obj == null) {
                return {};
            }

            level = level == null ? -1 : level;
            return flattenTo(obj, {}, '', level);
        }

        var flatten_1 = flatten;

    /**
         * get "nested" object property
         */
        function get(obj, prop){
            var parts = prop.split('.'),
                last = parts.pop();

            while (prop = parts.shift()) {
                obj = obj[prop];
                if (obj == null) return;
            }

            return obj[last];
        }

        var get_1 = get;

    var UNDEF;

        /**
         * Check if object has nested property.
         */
        function has(obj, prop){
            return get_1(obj, prop) !== UNDEF;
        }

        var has_1 = has;

    /**
         * Get object keys
         */
         var keys = Object.keys || function (obj) {
                var keys = [];
                forOwn_1(obj, function(val, key){
                    keys.push(key);
                });
                return keys;
            };

        var keys_1 = keys;

    /**
         * Creates a new object where all the values are the result of calling
         * `callback`.
         */
        function mapValues(obj, callback, thisObj) {
            callback = makeIterator_(callback, thisObj);
            var output = {};
            forOwn_1(obj, function(val, key, obj) {
                output[key] = callback(val, key, obj);
            });

            return output;
        }
        var map = mapValues;

    /**
         * checks if a object contains all given properties/values
         */
        function matches(target, props){
            // can't use "object/every" because of circular dependency
            var result = true;
            forOwn_1(props, function(val, key){
                if (target[key] !== val) {
                    // break loop at first difference
                    return (result = false);
                }
            });
            return result;
        }

        var matches_1 = matches;

    /**
         * Return maximum value inside array
         */
        function max$1(arr, iterator, thisObj){
            if (arr == null || !arr.length) {
                return Infinity;
            } else if (arr.length && !iterator) {
                return Math.max.apply(Math, arr);
            } else {
                iterator = makeIterator_(iterator, thisObj);
                var result,
                    compare = -Infinity,
                    value,
                    temp;

                var i = -1, len = arr.length;
                while (++i < len) {
                    value = arr[i];
                    temp = iterator(value, i, arr);
                    if (temp > compare) {
                        compare = temp;
                        result = value;
                    }
                }

                return result;
            }
        }

        var max_1$1 = max$1;

    /**
         * Get object values
         */
        function values(obj) {
            var vals = [];
            forOwn_1(obj, function(val, key){
                vals.push(val);
            });
            return vals;
        }

        var values_1 = values;

    /**
         * Returns maximum value inside object.
         */
        function max(obj, compareFn) {
            return max_1$1(values_1(obj), compareFn);
        }

        var max_1 = max;

    /**
        * Combine properties from all the objects into first one.
        * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
        * @param {object} target    Target Object
        * @param {...object} objects    Objects to be combined (0...n objects).
        * @return {object} Target Object.
        */
        function mixIn(target, objects){
            var i = 0,
                n = arguments.length,
                obj;
            while(++i < n){
                obj = arguments[i];
                if (obj != null) {
                    forOwn_1(obj, copyProp, target);
                }
            }
            return target;
        }

        function copyProp(val, key){
            this[key] = val;
        }

        var mixIn_1 = mixIn;

    /**
         * Clone native types.
         */
        function clone(val){
            switch (kindOf_1(val)) {
                case 'Object':
                    return cloneObject$1(val);
                case 'Array':
                    return cloneArray$1(val);
                case 'RegExp':
                    return cloneRegExp(val);
                case 'Date':
                    return cloneDate(val);
                default:
                    return val;
            }
        }

        function cloneObject$1(source) {
            if (isPlainObject_1(source)) {
                return mixIn_1({}, source);
            } else {
                return source;
            }
        }

        function cloneRegExp(r) {
            var flags = '';
            flags += r.multiline ? 'm' : '';
            flags += r.global ? 'g' : '';
            flags += r.ignoreCase ? 'i' : '';
            return new RegExp(r.source, flags);
        }

        function cloneDate(date) {
            return new Date(+date);
        }

        function cloneArray$1(arr) {
            return arr.slice();
        }

        var clone_1 = clone;

    /**
         * Recursively clone native types.
         */
        function deepClone(val, instanceClone) {
            switch ( kindOf_1(val) ) {
                case 'Object':
                    return cloneObject(val, instanceClone);
                case 'Array':
                    return cloneArray(val, instanceClone);
                default:
                    return clone_1(val);
            }
        }

        function cloneObject(source, instanceClone) {
            if (isPlainObject_1(source)) {
                var out = {};
                forOwn_1(source, function(val, key) {
                    this[key] = deepClone(val, instanceClone);
                }, out);
                return out;
            } else if (instanceClone) {
                return instanceClone(source);
            } else {
                return source;
            }
        }

        function cloneArray(arr, instanceClone) {
            var out = [],
                i = -1,
                n = arr.length;
            while (++i < n) {
                out[i] = deepClone(arr[i], instanceClone);
            }
            return out;
        }

        var deepClone_1 = deepClone;

    /**
         * Deep merge objects.
         */
        function merge() {
            var i = 1,
                key, val, obj, target;

            // make sure we don't modify source element and it's properties
            // objects are passed by reference
            target = deepClone_1( arguments[0] );

            while (obj = arguments[i++]) {
                for (key in obj) {
                    if ( ! hasOwn_1(obj, key) ) {
                        continue;
                    }

                    val = obj[key];

                    if ( isObject_1(val) && isObject_1(target[key]) ){
                        // inception, deep merge objects
                        target[key] = merge(target[key], val);
                    } else {
                        // make sure arrays, regexp, date, objects are cloned
                        target[key] = deepClone_1(val);
                    }

                }
            }

            return target;
        }

        var merge_1 = merge;

    /**
         * Return minimum value inside array
         */
        function min$1(arr, iterator, thisObj){
            if (arr == null || !arr.length) {
                return -Infinity;
            } else if (arr.length && !iterator) {
                return Math.min.apply(Math, arr);
            } else {
                iterator = makeIterator_(iterator, thisObj);
                var result,
                    compare = Infinity,
                    value,
                    temp;

                var i = -1, len = arr.length;
                while (++i < len) {
                    value = arr[i];
                    temp = iterator(value, i, arr);
                    if (temp < compare) {
                        compare = temp;
                        result = value;
                    }
                }

                return result;
            }
        }

        var min_1$1 = min$1;

    /**
         * Returns minimum value inside object.
         */
        function min(obj, iterator) {
            return min_1$1(values_1(obj), iterator);
        }

        var min_1 = min;

    /**
         * Create nested object if non-existent
         */
        function namespace(obj, path){
            if (!path) return obj;
            forEach_1(path.split('.'), function(key){
                if (!obj[key]) {
                    obj[key] = {};
                }
                obj = obj[key];
            });
            return obj;
        }

        var namespace_1 = namespace;

    /**
         * Array.indexOf
         */
        function indexOf(arr, item, fromIndex) {
            fromIndex = fromIndex || 0;
            if (arr == null) {
                return -1;
            }

            var len = arr.length,
                i = fromIndex < 0 ? len + fromIndex : fromIndex;
            while (i < len) {
                // we iterate over sparse items since there is no way to make it
                // work properly on IE 7-8. see #64
                if (arr[i] === item) {
                    return i;
                }

                i++;
            }

            return -1;
        }

        var indexOf_1 = indexOf;

    /**
         * If array contains values.
         */
        function contains(arr, val) {
            return indexOf_1(arr, val) !== -1;
        }
        var contains_1 = contains;

    /**
         * Return a copy of the object, filtered to only contain properties except the blacklisted keys.
         */
        function omit(obj, var_keys){
            var keys = typeof arguments[1] !== 'string'? arguments[1] : slice_1(arguments, 1),
                out = {};

            for (var property in obj) {
                if (obj.hasOwnProperty(property) && !contains_1(keys, property)) {
                    out[property] = obj[property];
                }
            }
            return out;
        }

        var omit_1 = omit;

    /**
         * Return a copy of the object, filtered to only have values for the whitelisted keys.
         */
        function pick(obj, var_keys){
            var keys = typeof arguments[1] !== 'string'? arguments[1] : slice_1(arguments, 1),
                out = {},
                i = 0, key;
            while (key = keys[i++]) {
                out[key] = obj[key];
            }
            return out;
        }

        var pick_1 = pick;

    /**
         * Extract a list of property values.
         */
        function pluck(obj, propName){
            return map(obj, prop_1(propName));
        }

        var pluck_1 = pluck;

    /**
         * Get object size
         */
        function size(obj) {
            var count = 0;
            forOwn_1(obj, function(){
                count++;
            });
            return count;
        }

        var size_1 = size;

    /**
         * Object reduce
         */
        function reduce(obj, callback, memo, thisObj) {
            var initial = arguments.length > 2;

            if (!size_1(obj) && !initial) {
                throw new Error('reduce of empty object with no initial value');
            }

            forOwn_1(obj, function(value, key, list) {
                if (!initial) {
                    memo = value;
                    initial = true;
                }
                else {
                    memo = callback.call(thisObj, memo, value, key, list);
                }
            });

            return memo;
        }

        var reduce_1 = reduce;

    /**
         * Object reject
         */
        function reject(obj, callback, thisObj) {
            callback = makeIterator_(callback, thisObj);
            return filter(obj, function(value, index, obj) {
                return !callback(value, index, obj);
            }, thisObj);
        }

        var reject_1 = reject;

    /**
         */
        function isFunction(val) {
            return isKind_1(val, 'Function');
        }
        var isFunction_1 = isFunction;

    function result(obj, prop) {
            var property = obj[prop];

            if(property === undefined) {
                return;
            }

            return isFunction_1(property) ? property.call(obj) : property;
        }

        var result_1 = result;

    /**
         * set "nested" object property
         */
        function set(obj, prop, val){
            var parts = (/^(.+)\.(.+)$/).exec(prop);
            if (parts){
                namespace_1(obj, parts[1])[parts[2]] = val;
            } else {
                obj[prop] = val;
            }
        }

        var set_1 = set;

    /**
         * Unset object property.
         */
        function unset(obj, prop){
            if (has_1(obj, prop)) {
                var parts = prop.split('.'),
                    last = parts.pop();
                while (prop = parts.shift()) {
                    obj = obj[prop];
                }
                return (delete obj[last]);

            } else {
                // if property doesn't exist treat as deleted
                return true;
            }
        }

        var unset_1 = unset;

    //automatically generated, do not edit!
    //run `node build` instead
    var object = {
        'bindAll' : bindAll_1,
        'contains' : contains_1$1,
        'deepFillIn' : deepFillIn_1,
        'deepMatches' : deepMatches_1,
        'deepMixIn' : deepMixIn_1,
        'equals' : equals_1,
        'every' : every_1,
        'fillIn' : fillIn_1,
        'filter' : filter,
        'find' : find_1,
        'flatten' : flatten_1,
        'forIn' : forIn_1,
        'forOwn' : forOwn_1,
        'functions' : functions_1,
        'get' : get_1,
        'has' : has_1,
        'hasOwn' : hasOwn_1,
        'keys' : keys_1,
        'map' : map,
        'matches' : matches_1,
        'max' : max_1,
        'merge' : merge_1,
        'min' : min_1,
        'mixIn' : mixIn_1,
        'namespace' : namespace_1,
        'omit' : omit_1,
        'pick' : pick_1,
        'pluck' : pluck_1,
        'reduce' : reduce_1,
        'reject' : reject_1,
        'result' : result_1,
        'set' : set_1,
        'size' : size_1,
        'some' : some_1,
        'unset' : unset_1,
        'values' : values_1
    };

    var iso31661Alpha2 = createCommonjsModule(function (module) {
    (function() {
        var Iso31661a2, mout, singleton;

        mout = object;

        Iso31661a2 = (function() {
            function Iso31661a2() {}

            Iso31661a2.prototype.getCountry = function(code) {
                return Iso31661a2.prototype.countries[code];
            };

            Iso31661a2.prototype.getCode = function(country) {
                var idx, ret;
                ret = null;
                if (country != null) {
                    idx = mout.values(Iso31661a2.prototype.countries).indexOf(country);
                    if (idx !== -1) {
                        ret = Object.keys(Iso31661a2.prototype.countries)[idx];
                    }
                }
                return ret;
            };

            Iso31661a2.prototype.getCountries = function() {
                return mout.values(Iso31661a2.prototype.countries);
            };

            Iso31661a2.prototype.getCodes = function() {
                return Object.keys(Iso31661a2.prototype.countries);
            };

            Iso31661a2.prototype.getData = function() {
                return Iso31661a2.prototype.countries;
            };

            Iso31661a2.prototype.countries = {
                AF: "Afghanistan",
                AX: "Åland Islands",
                AL: "Albania",
                DZ: "Algeria",
                AS: "American Samoa",
                AD: "Andorra",
                AO: "Angola",
                AI: "Anguilla",
                AQ: "Antarctica",
                AG: "Antigua and Barbuda",
                AR: "Argentina",
                AM: "Armenia",
                AW: "Aruba",
                AU: "Australia",
                AT: "Austria",
                AZ: "Azerbaijan",
                BS: "Bahamas",
                BH: "Bahrain",
                BD: "Bangladesh",
                BB: "Barbados",
                BY: "Belarus",
                BE: "Belgium",
                BZ: "Belize",
                BJ: "Benin",
                BM: "Bermuda",
                BT: "Bhutan",
                BO: "Bolivia, Plurinational State of",
                BQ: "Bonaire, Sint Eustatius and Saba",
                BA: "Bosnia and Herzegovina",
                BW: "Botswana",
                BV: "Bouvet Island",
                BR: "Brazil",
                IO: "British Indian Ocean Territory",
                BN: "Brunei Darussalam",
                BG: "Bulgaria",
                BF: "Burkina Faso",
                BI: "Burundi",
                KH: "Cambodia",
                CM: "Cameroon",
                CA: "Canada",
                CV: "Cape Verde",
                KY: "Cayman Islands",
                CF: "Central African Republic",
                TD: "Chad",
                CL: "Chile",
                CN: "China",
                CX: "Christmas Island",
                CC: "Cocos (Keeling) Islands",
                CO: "Colombia",
                KM: "Comoros",
                CG: "Congo",
                CD: "Congo, the Democratic Republic of the",
                CK: "Cook Islands",
                CR: "Costa Rica",
                CI: "Côte d'Ivoire",
                HR: "Croatia",
                CU: "Cuba",
                CW: "Curaçao",
                CY: "Cyprus",
                CZ: "Czech Republic",
                DK: "Denmark",
                DJ: "Djibouti",
                DM: "Dominica",
                DO: "Dominican Republic",
                EC: "Ecuador",
                EG: "Egypt",
                SV: "El Salvador",
                GQ: "Equatorial Guinea",
                ER: "Eritrea",
                EE: "Estonia",
                ET: "Ethiopia",
                FK: "Falkland Islands (Malvinas)",
                FO: "Faroe Islands",
                FJ: "Fiji",
                FI: "Finland",
                FR: "France",
                GF: "French Guiana",
                PF: "French Polynesia",
                TF: "French Southern Territories",
                GA: "Gabon",
                GM: "Gambia",
                GE: "Georgia",
                DE: "Germany",
                GH: "Ghana",
                GI: "Gibraltar",
                GR: "Greece",
                GL: "Greenland",
                GD: "Grenada",
                GP: "Guadeloupe",
                GU: "Guam",
                GT: "Guatemala",
                GG: "Guernsey",
                GN: "Guinea",
                GW: "Guinea-Bissau",
                GY: "Guyana",
                HT: "Haiti",
                HM: "Heard Island and McDonald Mcdonald Islands",
                VA: "Holy See (Vatican City State)",
                HN: "Honduras",
                HK: "Hong Kong",
                HU: "Hungary",
                IS: "Iceland",
                IN: "India",
                ID: "Indonesia",
                IR: "Iran, Islamic Republic of",
                IQ: "Iraq",
                IE: "Ireland",
                IM: "Isle of Man",
                IL: "Israel",
                IT: "Italy",
                JM: "Jamaica",
                JP: "Japan",
                JE: "Jersey",
                JO: "Jordan",
                KZ: "Kazakhstan",
                KE: "Kenya",
                KI: "Kiribati",
                KP: "Korea, Democratic People's Republic of",
                KR: "Korea, Republic of",
                KW: "Kuwait",
                KG: "Kyrgyzstan",
                LA: "Lao People's Democratic Republic",
                LV: "Latvia",
                LB: "Lebanon",
                LS: "Lesotho",
                LR: "Liberia",
                LY: "Libya",
                LI: "Liechtenstein",
                LT: "Lithuania",
                LU: "Luxembourg",
                MO: "Macao",
                MK: "Macedonia, the Former Yugoslav Republic of",
                MG: "Madagascar",
                MW: "Malawi",
                MY: "Malaysia",
                MV: "Maldives",
                ML: "Mali",
                MT: "Malta",
                MH: "Marshall Islands",
                MQ: "Martinique",
                MR: "Mauritania",
                MU: "Mauritius",
                YT: "Mayotte",
                MX: "Mexico",
                FM: "Micronesia, Federated States of",
                MD: "Moldova, Republic of",
                MC: "Monaco",
                MN: "Mongolia",
                ME: "Montenegro",
                MS: "Montserrat",
                MA: "Morocco",
                MZ: "Mozambique",
                MM: "Myanmar",
                NA: "Namibia",
                NR: "Nauru",
                NP: "Nepal",
                NL: "Netherlands",
                NC: "New Caledonia",
                NZ: "New Zealand",
                NI: "Nicaragua",
                NE: "Niger",
                NG: "Nigeria",
                NU: "Niue",
                NF: "Norfolk Island",
                MP: "Northern Mariana Islands",
                NO: "Norway",
                OM: "Oman",
                PK: "Pakistan",
                PW: "Palau",
                PS: "Palestine, State of",
                PA: "Panama",
                PG: "Papua New Guinea",
                PY: "Paraguay",
                PE: "Peru",
                PH: "Philippines",
                PN: "Pitcairn",
                PL: "Poland",
                PT: "Portugal",
                PR: "Puerto Rico",
                QA: "Qatar",
                RE: "Réunion",
                RO: "Romania",
                RU: "Russian Federation",
                RW: "Rwanda",
                BL: "Saint Barthélemy",
                SH: "Saint Helena, Ascension and Tristan da Cunha",
                KN: "Saint Kitts and Nevis",
                LC: "Saint Lucia",
                MF: "Saint Martin (French part)",
                PM: "Saint Pierre and Miquelon",
                VC: "Saint Vincent and the Grenadines",
                WS: "Samoa",
                SM: "San Marino",
                ST: "Sao Tome and Principe",
                SA: "Saudi Arabia",
                SN: "Senegal",
                RS: "Serbia",
                SC: "Seychelles",
                SL: "Sierra Leone",
                SG: "Singapore",
                SX: "Sint Maarten (Dutch part)",
                SK: "Slovakia",
                SI: "Slovenia",
                SB: "Solomon Islands",
                SO: "Somalia",
                ZA: "South Africa",
                GS: "South Georgia and the South Sandwich Islands",
                SS: "South Sudan",
                ES: "Spain",
                LK: "Sri Lanka",
                SD: "Sudan",
                SR: "Suriname",
                SJ: "Svalbard and Jan Mayen",
                SZ: "Swaziland",
                SE: "Sweden",
                CH: "Switzerland",
                SY: "Syrian Arab Republic",
                TW: "Taiwan, Province of China",
                TJ: "Tajikistan",
                TZ: "Tanzania, United Republic of",
                TH: "Thailand",
                TL: "Timor-Leste",
                TG: "Togo",
                TK: "Tokelau",
                TO: "Tonga",
                TT: "Trinidad and Tobago",
                TN: "Tunisia",
                TR: "Turkey",
                TM: "Turkmenistan",
                TC: "Turks and Caicos Islands",
                TV: "Tuvalu",
                UG: "Uganda",
                UA: "Ukraine",
                AE: "United Arab Emirates",
                GB: "United Kingdom",
                US: "United States",
                UM: "United States Minor Outlying Islands",
                UY: "Uruguay",
                UZ: "Uzbekistan",
                VU: "Vanuatu",
                VE: "Venezuela, Bolivarian Republic of",
                VN: "Viet Nam",
                VG: "Virgin Islands, British",
                VI: "Virgin Islands, U.S.",
                WF: "Wallis and Futuna",
                EH: "Western Sahara",
                YE: "Yemen",
                ZM: "Zambia",
                ZW: "Zimbabwe"
            };

            return Iso31661a2;

        })();

        singleton = null;

        module.exports = (function() {
            return singleton != null ? singleton : singleton = new Iso31661a2();
        })();

    }).call(commonjsGlobal);
    });

    const REG = /^([a-z]{2})-([A-Z]{2})$/;

    class LocaleCode {
      /* language iso-639-1 */
      static getLanguageCode(code) {
        var match = code.match(REG);
        if(!match || match.length < 1) return ''
        return match[1]
      }

      static getLanguageName(code) {
        var languageCode = LocaleCode.getLanguageCode(code);
        return ISO6391ZH.getName(languageCode)
      }

      static getLanguageNativeName(code) {
        var languageCode = LocaleCode.getLanguageCode(code);
        return ISO6391ZH.getNativeName(languageCode)
      }

      static getLanguageZhName(code) {
        var languageCode = LocaleCode.getLanguageCode(code);
        return ISO6391ZH.getZhName(languageCode)
      }

      static validateLanguageCode(code) {
        var languageCode = LocaleCode.getLanguageCode(code);
        return ISO6391ZH.validate(languageCode)
      }

      static getLanguages(codes) {
        var list = [];
        for (var i = 0; i < codes.length; i++) {
          list.push({
            code:codes[i], 
            name: LocaleCode.getLanguageName(codes[i]),
            nativeName: LocaleCode.getLanguageNativeName(codes[i]),
            zhName: LocaleCode.getLanguageZhName(codes[i])
          });
        }
        return list
      }

      /* country iso-3166-1-alpha-2 */
      static getCountryCode(code) {
        var match = code.match(REG);
        if(!match || match.length < 2) return ''
        return match[2]
      }
      static getCountryName(code) {
        var countryCode = LocaleCode.getCountryCode(code);
        return iso31661Alpha2.getCountry(countryCode)
      }
      static validateCountryCode(code) {
        code = LocaleCode.getCountryCode(code);
        if(iso31661Alpha2.getCodes().indexOf(code) === -1) {
          return false
        } else {
          return true
        }
      }

      /* validate */
      static validate(code) {
        var match = code.match(REG);
        if(match && match.length === 3 && 
          LocaleCode.validateLanguageCode(code) &&
          LocaleCode.validateCountryCode(code)) {
          return true
        } else {
          return false
        }
      }
    }

    var src = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': LocaleCode
    });

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html

    var _nodeId;

    var _clockseq; // Previous uuid creation time


    var _lastMSecs = 0;
    var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || new Array(16);
      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
      // specified.  We do this lazily to minimize issues related to insufficient
      // system entropy.  See #189

      if (node == null || clockseq == null) {
        var seedBytes = options.random || (options.rng || rng)();

        if (node == null) {
          // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
          node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }

        if (clockseq == null) {
          // Per 4.2.2, randomize (14 bit) clockseq
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
      } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
      // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
      // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
      // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


      var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
      // cycle to simulate higher resolution clock

      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

      var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
      // time interval


      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      } // Per 4.2.1.2 Throw error if too many uuids are requested


      if (nsecs >= 10000) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }

      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

      msecs += 12219292800000; // `time_low`

      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff; // `time_mid`

      var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff; // `time_high_and_version`

      b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

      b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

      b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

      b[i++] = clockseq & 0xff; // `node`

      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }

      return buf || stringify(b);
    }

    function parse(uuid) {
      if (!validate(uuid)) {
        throw TypeError('Invalid UUID');
      }

      var v;
      var arr = new Uint8Array(16); // Parse ########-....-....-....-............

      arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
      arr[1] = v >>> 16 & 0xff;
      arr[2] = v >>> 8 & 0xff;
      arr[3] = v & 0xff; // Parse ........-####-....-....-............

      arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
      arr[5] = v & 0xff; // Parse ........-....-####-....-............

      arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
      arr[7] = v & 0xff; // Parse ........-....-....-####-............

      arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
      arr[9] = v & 0xff; // Parse ........-....-....-....-############
      // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

      arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
      arr[11] = v / 0x100000000 & 0xff;
      arr[12] = v >>> 24 & 0xff;
      arr[13] = v >>> 16 & 0xff;
      arr[14] = v >>> 8 & 0xff;
      arr[15] = v & 0xff;
      return arr;
    }

    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str)); // UTF8 escape

      var bytes = [];

      for (var i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i));
      }

      return bytes;
    }

    var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
    function v35 (name, version, hashfunc) {
      function generateUUID(value, namespace, buf, offset) {
        if (typeof value === 'string') {
          value = stringToBytes(value);
        }

        if (typeof namespace === 'string') {
          namespace = parse(namespace);
        }

        if (namespace.length !== 16) {
          throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
        } // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
        // hashfunc([...namespace, ... value])`


        var bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 0x0f | version;
        bytes[8] = bytes[8] & 0x3f | 0x80;

        if (buf) {
          offset = offset || 0;

          for (var i = 0; i < 16; ++i) {
            buf[offset + i] = bytes[i];
          }

          return buf;
        }

        return stringify(bytes);
      } // Function#name is not settable on some platforms (#270)


      try {
        generateUUID.name = name; // eslint-disable-next-line no-empty
      } catch (err) {} // For CommonJS default export support


      generateUUID.DNS = DNS;
      generateUUID.URL = URL;
      return generateUUID;
    }

    /*
     * Browser-compatible JavaScript MD5
     *
     * Modification of JavaScript MD5
     * https://github.com/blueimp/JavaScript-MD5
     *
     * Copyright 2011, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * https://opensource.org/licenses/MIT
     *
     * Based on
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */
    function md5(bytes) {
      if (typeof bytes === 'string') {
        var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

        bytes = new Uint8Array(msg.length);

        for (var i = 0; i < msg.length; ++i) {
          bytes[i] = msg.charCodeAt(i);
        }
      }

      return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
    }
    /*
     * Convert an array of little-endian words to an array of bytes
     */


    function md5ToHexEncodedArray(input) {
      var output = [];
      var length32 = input.length * 32;
      var hexTab = '0123456789abcdef';

      for (var i = 0; i < length32; i += 8) {
        var x = input[i >> 5] >>> i % 32 & 0xff;
        var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
        output.push(hex);
      }

      return output;
    }
    /**
     * Calculate output length with padding and bit length
     */


    function getOutputLength(inputLength8) {
      return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
    }
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */


    function wordsToMd5(x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << len % 32;
      x[getOutputLength(len) - 1] = len;
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;

      for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5ff(a, b, c, d, x[i], 7, -680876936);
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, x[i], 20, -373897302);
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, x[i], 11, -358537222);
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5ii(a, b, c, d, x[i], 6, -198630844);
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
      }

      return [a, b, c, d];
    }
    /*
     * Convert an array bytes to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */


    function bytesToWords(input) {
      if (input.length === 0) {
        return [];
      }

      var length8 = input.length * 8;
      var output = new Uint32Array(getOutputLength(length8));

      for (var i = 0; i < length8; i += 8) {
        output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
      }

      return output;
    }
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */


    function safeAdd(x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | lsw & 0xffff;
    }
    /*
     * Bitwise rotate a 32-bit number to the left.
     */


    function bitRotateLeft(num, cnt) {
      return num << cnt | num >>> 32 - cnt;
    }
    /*
     * These functions implement the four basic operations the algorithm uses.
     */


    function md5cmn(q, a, b, x, s, t) {
      return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }

    function md5ff(a, b, c, d, x, s, t) {
      return md5cmn(b & c | ~b & d, a, b, x, s, t);
    }

    function md5gg(a, b, c, d, x, s, t) {
      return md5cmn(b & d | c & ~d, a, b, x, s, t);
    }

    function md5hh(a, b, c, d, x, s, t) {
      return md5cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5ii(a, b, c, d, x, s, t) {
      return md5cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    var v3 = v35('v3', 0x30, md5);

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    // Adapted from Chris Veness' SHA1 code at
    // http://www.movable-type.co.uk/scripts/sha1.html
    function f(s, x, y, z) {
      switch (s) {
        case 0:
          return x & y ^ ~x & z;

        case 1:
          return x ^ y ^ z;

        case 2:
          return x & y ^ x & z ^ y & z;

        case 3:
          return x ^ y ^ z;
      }
    }

    function ROTL(x, n) {
      return x << n | x >>> 32 - n;
    }

    function sha1(bytes) {
      var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
      var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

      if (typeof bytes === 'string') {
        var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

        bytes = [];

        for (var i = 0; i < msg.length; ++i) {
          bytes.push(msg.charCodeAt(i));
        }
      } else if (!Array.isArray(bytes)) {
        // Convert Array-like to Array
        bytes = Array.prototype.slice.call(bytes);
      }

      bytes.push(0x80);
      var l = bytes.length / 4 + 2;
      var N = Math.ceil(l / 16);
      var M = new Array(N);

      for (var _i = 0; _i < N; ++_i) {
        var arr = new Uint32Array(16);

        for (var j = 0; j < 16; ++j) {
          arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
        }

        M[_i] = arr;
      }

      M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
      M[N - 1][14] = Math.floor(M[N - 1][14]);
      M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

      for (var _i2 = 0; _i2 < N; ++_i2) {
        var W = new Uint32Array(80);

        for (var t = 0; t < 16; ++t) {
          W[t] = M[_i2][t];
        }

        for (var _t = 16; _t < 80; ++_t) {
          W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
        }

        var a = H[0];
        var b = H[1];
        var c = H[2];
        var d = H[3];
        var e = H[4];

        for (var _t2 = 0; _t2 < 80; ++_t2) {
          var s = Math.floor(_t2 / 20);
          var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
          e = d;
          d = c;
          c = ROTL(b, 30) >>> 0;
          b = a;
          a = T;
        }

        H[0] = H[0] + a >>> 0;
        H[1] = H[1] + b >>> 0;
        H[2] = H[2] + c >>> 0;
        H[3] = H[3] + d >>> 0;
        H[4] = H[4] + e >>> 0;
      }

      return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
    }

    var v5 = v35('v5', 0x50, sha1);

    var nil = '00000000-0000-0000-0000-000000000000';

    function version(uuid) {
      if (!validate(uuid)) {
        throw TypeError('Invalid UUID');
      }

      return parseInt(uuid.substr(14, 1), 16);
    }

    var esmBrowser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        v1: v1,
        v3: v3,
        v4: v4,
        v5: v5,
        NIL: nil,
        version: version,
        validate: validate,
        stringify: stringify,
        parse: parse
    });

    /*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */

    var base64 = createCommonjsModule(function (module, exports) {
    (function(root) {

    	// Detect free variables `exports`.
    	var freeExports = exports;

    	// Detect free variable `module`.
    	var freeModule = module &&
    		module.exports == freeExports && module;

    	// Detect free variable `global`, from Node.js or Browserified code, and use
    	// it as `root`.
    	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
    	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
    		root = freeGlobal;
    	}

    	/*--------------------------------------------------------------------------*/

    	var InvalidCharacterError = function(message) {
    		this.message = message;
    	};
    	InvalidCharacterError.prototype = new Error;
    	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    	var error = function(message) {
    		// Note: the error messages used throughout this file match those used by
    		// the native `atob`/`btoa` implementation in Chromium.
    		throw new InvalidCharacterError(message);
    	};

    	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    	// http://whatwg.org/html/common-microsyntaxes.html#space-character
    	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

    	// `decode` is designed to be fully compatible with `atob` as described in the
    	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
    	// The optimized base64-decoding algorithm used is based on @atk’s excellent
    	// implementation. https://gist.github.com/atk/1020396
    	var decode = function(input) {
    		input = String(input)
    			.replace(REGEX_SPACE_CHARACTERS, '');
    		var length = input.length;
    		if (length % 4 == 0) {
    			input = input.replace(/==?$/, '');
    			length = input.length;
    		}
    		if (
    			length % 4 == 1 ||
    			// http://whatwg.org/C#alphanumeric-ascii-characters
    			/[^+a-zA-Z0-9/]/.test(input)
    		) {
    			error(
    				'Invalid character: the string to be decoded is not correctly encoded.'
    			);
    		}
    		var bitCounter = 0;
    		var bitStorage;
    		var buffer;
    		var output = '';
    		var position = -1;
    		while (++position < length) {
    			buffer = TABLE.indexOf(input.charAt(position));
    			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
    			// Unless this is the first of a group of 4 characters…
    			if (bitCounter++ % 4) {
    				// …convert the first 8 bits to a single ASCII character.
    				output += String.fromCharCode(
    					0xFF & bitStorage >> (-2 * bitCounter & 6)
    				);
    			}
    		}
    		return output;
    	};

    	// `encode` is designed to be fully compatible with `btoa` as described in the
    	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
    	var encode = function(input) {
    		input = String(input);
    		if (/[^\0-\xFF]/.test(input)) {
    			// Note: no need to special-case astral symbols here, as surrogates are
    			// matched, and the input is supposed to only contain ASCII anyway.
    			error(
    				'The string to be encoded contains characters outside of the ' +
    				'Latin1 range.'
    			);
    		}
    		var padding = input.length % 3;
    		var output = '';
    		var position = -1;
    		var a;
    		var b;
    		var c;
    		var buffer;
    		// Make sure any padding is handled outside of the loop.
    		var length = input.length - padding;

    		while (++position < length) {
    			// Read three bytes, i.e. 24 bits.
    			a = input.charCodeAt(position) << 16;
    			b = input.charCodeAt(++position) << 8;
    			c = input.charCodeAt(++position);
    			buffer = a + b + c;
    			// Turn the 24 bits into four chunks of 6 bits each, and append the
    			// matching character for each of them to the output.
    			output += (
    				TABLE.charAt(buffer >> 18 & 0x3F) +
    				TABLE.charAt(buffer >> 12 & 0x3F) +
    				TABLE.charAt(buffer >> 6 & 0x3F) +
    				TABLE.charAt(buffer & 0x3F)
    			);
    		}

    		if (padding == 2) {
    			a = input.charCodeAt(position) << 8;
    			b = input.charCodeAt(++position);
    			buffer = a + b;
    			output += (
    				TABLE.charAt(buffer >> 10) +
    				TABLE.charAt((buffer >> 4) & 0x3F) +
    				TABLE.charAt((buffer << 2) & 0x3F) +
    				'='
    			);
    		} else if (padding == 1) {
    			buffer = input.charCodeAt(position);
    			output += (
    				TABLE.charAt(buffer >> 2) +
    				TABLE.charAt((buffer << 4) & 0x3F) +
    				'=='
    			);
    		}

    		return output;
    	};

    	var base64 = {
    		'encode': encode,
    		'decode': decode,
    		'version': '0.1.0'
    	};

    	// Some AMD build optimizers, like r.js, check for specific condition patterns
    	// like the following:
    	if (freeExports && !freeExports.nodeType) {
    		if (freeModule) { // in Node.js or RingoJS v0.8.0+
    			freeModule.exports = base64;
    		} else { // in Narwhal or RingoJS v0.7.0-
    			for (var key in base64) {
    				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
    			}
    		}
    	} else { // in Rhino or a web browser
    		root.base64 = base64;
    	}

    }(commonjsGlobal));
    });

    var token = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.minTokenValidTime = 60 * 60 * 1000; // 1 hour
    function fetchToken(baseUrl, appId, deviceId, fetcher = fetch, nowFn = Date.now) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const body = { appId, deviceId };
            const response = yield fetcher(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const json = yield response.json();
            if (response.status !== 200) {
                throw Error((_a = json.error) !== null && _a !== void 0 ? _a : `Speechly API login request failed with ${response.status}`);
            }
            if (json.access_token === undefined) {
                throw Error('Invalid login response from Speechly API');
            }
            if (!validateToken(json.access_token, appId, deviceId, nowFn)) {
                throw Error('Invalid token received from Speechly API');
            }
            return json.access_token;
        });
    }
    exports.fetchToken = fetchToken;
    function validateToken(token, appId, deviceId, now = Date.now) {
        const decoded = decodeToken(token);
        if (decoded.expiresAtMs - now() < exports.minTokenValidTime) {
            return false;
        }
        if (decoded.appId !== appId) {
            return false;
        }
        if (decoded.deviceId !== deviceId) {
            return false;
        }
        return true;
    }
    exports.validateToken = validateToken;
    function decodeToken(token) {
        const b = token.split('.')[1];
        let body;
        try {
            body = JSON.parse(base64.decode(b));
        }
        catch (e) {
            throw new Error('Error decoding Speechly token!');
        }
        return {
            appId: body.appId,
            deviceId: body.deviceId,
            configId: body.configId,
            scopes: body.scope.split(' '),
            issuer: body.iss,
            audience: body.aud,
            expiresAtMs: body.exp * 1000,
        };
    }
    exports.decodeToken = decodeToken;
    //# sourceMappingURL=token.js.map
    });

    /**
     * Default sample rate for microphone streams.
     * @public
     */
    var DefaultSampleRate = 16000;
    /**
     * Error to be thrown when the microphone was accessed before it was initialized.
     * @public
     */
    var ErrNotInitialized = new Error('Microphone is not initialized');
    /**
     * Error to be thrown when the initialize method of a Microphone instance is called more than once.
     * @public
     */
    var ErrAlreadyInitialized = new Error('Microphone is already initialized');
    /**
     * Error to be thrown when the device does not support the Microphone instance's target audio APIs.
     * @public
     */
    var ErrDeviceNotSupported = new Error('Current device does not support microphone API');
    /**
     * Error to be thrown when user did not give consent to the application to record audio.
     * @public
     */
    var ErrNoAudioConsent = new Error('Microphone consent is no given');


    var types$2 = /*#__PURE__*/Object.defineProperty({
    	DefaultSampleRate: DefaultSampleRate,
    	ErrNotInitialized: ErrNotInitialized,
    	ErrAlreadyInitialized: ErrAlreadyInitialized,
    	ErrDeviceNotSupported: ErrDeviceNotSupported,
    	ErrNoAudioConsent: ErrNoAudioConsent
    }, '__esModule', {value: true});

    var _default$1 = `
// Indices for the Control SAB.
const CONTROL = {
  'WRITE_INDEX': 0,
  'FRAMES_AVAILABLE': 1,
};

class SpeechlyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this._initialized = false;
    this.port.onmessage = this._initialize.bind(this);
  }

  _initialize(event) {
    this.controlSAB = new Int32Array(event.data.controlSAB);
    this.dataSAB = new Float32Array(event.data.dataSAB);
    this._initialized = true;
  }

  _pushData(data) {
    let inputWriteIndex = this.controlSAB[CONTROL.WRITE_INDEX];

    if (inputWriteIndex + data.length < this.dataSAB.length) {
      // Buffer has enough space to push the input.
      this.dataSAB.set(data, inputWriteIndex);
      this.controlSAB[CONTROL.WRITE_INDEX] += data.length;
    } else {
      // Buffer overflow
      this.dataSAB.set(data, 0);
      this.controlSAB[CONTROL.WRITE_INDEX] = 0;
    }

    // Update the number of available frames in the input buffer.
    this.controlSAB[CONTROL.FRAMES_AVAILABLE] += data.length;
  }

  process(inputs, outputs, parameters) {
    const inputChannelData = inputs[0][0];
      if (inputChannelData !== undefined) {
        if (this.controlSAB && this.dataSAB) {
          this._pushData(inputChannelData);
        } else {
          this.port.postMessage(inputChannelData);
        }
      }
      
      return true;
  }
}

registerProcessor('speechly-worklet', SpeechlyProcessor);
`;


    var audioworklet = /*#__PURE__*/Object.defineProperty({
    	default: _default$1
    }, '__esModule', {value: true});

    var __awaiter$2 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };


    const audioworklet_1 = __importDefault$2(audioworklet);
    const audioProcessEvent = 'audioprocess';
    const baseBufferSize = 4096;
    class BrowserMicrophone {
        constructor(isWebkit, sampleRate, apiClient) {
            this.initialized = false;
            this.muted = false;
            this.handleAudio = (array) => {
                if (this.muted) {
                    return;
                }
                this.apiClient.sendAudio(array);
            };
            this.isWebkit = isWebkit;
            this.apiClient = apiClient;
            this.sampleRate = sampleRate;
        }
        initialize(audioContext, opts) {
            var _a;
            return __awaiter$2(this, void 0, void 0, function* () {
                if (((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.mediaDevices) === undefined) {
                    throw types$2.ErrDeviceNotSupported;
                }
                this.audioContext = audioContext;
                this.resampleRatio = this.audioContext.sampleRate / this.sampleRate;
                // Start audio context if we are dealing with a WebKit browser.
                //
                // WebKit browsers (e.g. Safari) require to resume the context first,
                // before obtaining user media by calling `mediaDevices.getUserMedia`.
                //
                // If done in a different order, the audio context will resume successfully,
                // but will emit empty audio buffers.
                if (this.isWebkit) {
                    yield this.audioContext.resume();
                }
                try {
                    this.mediaStream = yield window.navigator.mediaDevices.getUserMedia(opts);
                }
                catch (_b) {
                    throw types$2.ErrNoAudioConsent;
                }
                this.audioTrack = this.mediaStream.getAudioTracks()[0];
                this.audioTrack.enabled = false;
                // Start audio context if we are dealing with a non-WebKit browser.
                //
                // Non-webkit browsers (currently only Chrome on Android)
                // require that user media is obtained before resuming the audio context.
                //
                // If audio context is attempted to be resumed before `mediaDevices.getUserMedia`,
                // `audioContext.resume()` will hang indefinitely, without being resolved or rejected.
                if (!this.isWebkit) {
                    yield this.audioContext.resume();
                }
                if (window.AudioWorkletNode !== undefined) {
                    const blob = new Blob([audioworklet_1.default], { type: 'text/javascript' });
                    const blobURL = window.URL.createObjectURL(blob);
                    yield this.audioContext.audioWorklet.addModule(blobURL);
                    const speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet');
                    this.audioContext.createMediaStreamSource(this.mediaStream).connect(speechlyNode);
                    speechlyNode.connect(this.audioContext.destination);
                    if (window.SharedArrayBuffer !== undefined) {
                        // Chrome, Edge, Firefox, Firefox Android
                        const controlSAB = new window.SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT);
                        const dataSAB = new window.SharedArrayBuffer(2 * 4096 * Float32Array.BYTES_PER_ELEMENT);
                        this.apiClient.postMessage({
                            type: 'SET_SHARED_ARRAY_BUFFERS',
                            controlSAB,
                            dataSAB,
                        });
                        speechlyNode.port.postMessage({
                            type: 'SET_SHARED_ARRAY_BUFFERS',
                            controlSAB,
                            dataSAB,
                        });
                    }
                    else {
                        // Opera, Chrome Android, Webview Anroid
                        speechlyNode.port.onmessage = (event) => {
                            this.handleAudio(event.data);
                        };
                    }
                }
                else {
                    // Safari, iOS Safari and Internet Explorer
                    if (this.isWebkit) {
                        // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
                        // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
                        const bufSize = baseBufferSize * Math.pow(2, Math.ceil(Math.log(this.resampleRatio) / Math.log(2)));
                        this.audioProcessor = this.audioContext.createScriptProcessor(bufSize, 1, 1);
                    }
                    else {
                        this.audioProcessor = this.audioContext.createScriptProcessor(undefined, 1, 1);
                    }
                    this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioProcessor);
                    this.audioProcessor.connect(this.audioContext.destination);
                    this.audioProcessor.addEventListener(audioProcessEvent, (event) => {
                        this.handleAudio(event.inputBuffer.getChannelData(0));
                    });
                }
                this.initialized = true;
                this.mute();
            });
        }
        close() {
            return __awaiter$2(this, void 0, void 0, function* () {
                this.mute();
                if (!this.initialized) {
                    throw types$2.ErrNotInitialized;
                }
                // Stop all media tracks
                const stream = this.mediaStream;
                stream.getTracks().forEach(t => t.stop());
                // Disconnect and stop ScriptProcessorNode
                if (this.audioProcessor != null) {
                    const proc = this.audioProcessor;
                    proc.disconnect();
                }
                // Unset all audio infrastructure
                this.mediaStream = undefined;
                this.audioTrack = undefined;
                this.audioProcessor = undefined;
                this.initialized = false;
            });
        }
        mute() {
            this.muted = true;
            if (this.initialized) {
                const t = this.audioTrack;
                t.enabled = false;
            }
        }
        unmute() {
            this.muted = false;
            if (this.initialized) {
                const t = this.audioTrack;
                t.enabled = true;
            }
        }
    }
    var BrowserMicrophone_1 = BrowserMicrophone;


    var browser_microphone = /*#__PURE__*/Object.defineProperty({
    	BrowserMicrophone: BrowserMicrophone_1
    }, '__esModule', {value: true});

    var microphone = createCommonjsModule(function (module, exports) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(browser_microphone);
    __export(types$2);
    //# sourceMappingURL=index.js.map
    });

    var types$1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    (function (WebsocketResponseType) {
        WebsocketResponseType["Opened"] = "WEBSOCKET_OPEN";
        WebsocketResponseType["SourceSampleRateSetSuccess"] = "SOURSE_SAMPLE_RATE_SET_SUCCESS";
        WebsocketResponseType["Started"] = "started";
        WebsocketResponseType["Stopped"] = "stopped";
        WebsocketResponseType["SegmentEnd"] = "segment_end";
        WebsocketResponseType["Transcript"] = "transcript";
        WebsocketResponseType["Entity"] = "entity";
        WebsocketResponseType["Intent"] = "intent";
        WebsocketResponseType["TentativeTranscript"] = "tentative_transcript";
        WebsocketResponseType["TentativeEntities"] = "tentative_entities";
        WebsocketResponseType["TentativeIntent"] = "tentative_intent";
    })(exports.WebsocketResponseType || (exports.WebsocketResponseType = {}));
    //# sourceMappingURL=types.js.map
    });

    var _default = `
// Indices for the Control SAB.
const CONTROL = {
  'WRITE_INDEX': 0,
  'FRAMES_AVAILABLE': 1,
};
let ws = undefined
let state = {
  isContextStarted: false,
  sourceSampleRate: undefined,
  targetSampleRate: undefined,
  resampleRatio: 1,
  buffer: new Float32Array(0),
  filter: undefined,
  controlSAB: undefined,
  dataSAB: undefined
}

function initializeWebsocket(url, protocol) {
  ws = new WebSocket(url, protocol)

  return new Promise((resolve, reject) => {
    const errhandler = () => {
      ws.removeEventListener('close', errhandler)
      ws.removeEventListener('error', errhandler)
      ws.removeEventListener('open', openhandler)

      reject(Error('Connection failed'))
    }

    const openhandler = () => {
      ws.removeEventListener('close', errhandler)
      ws.removeEventListener('error', errhandler)
      ws.removeEventListener('open', openhandler)

      resolve(ws)
    }

    ws.addEventListener('close', errhandler)
    ws.addEventListener('error', errhandler)
    ws.addEventListener('open', openhandler)
  })
}

function closeWebsocket(code, message) {
  if (ws === undefined) {
    throw Error('Websocket is not open')
  }

  ws.removeEventListener('message', onWebsocketMessage)
  ws.removeEventListener('error', onWebsocketError)
  ws.removeEventListener('close', onWebsocketClose)

  ws.close(code, message)
  ws = undefined
}

function onWebsocketClose(event) {
  ws = undefined
}

function onWebsocketError(_event) {
  onWebsocketClose(1000, 'Client disconnecting due to an error')
}

function onWebsocketMessage(event) {
  let response
  try {
    response = JSON.parse(event.data)
  } catch (e) {
    console.error('[SpeechlyClient] Error parsing response from the server:', e)
    return
  }

  self.postMessage(response)
}

function float32ToInt16(buffer) {
  const buf = new Int16Array(buffer.length)

  for (let l = 0; l < buffer.length; l++) {
    buf[l] = buffer[l] * (buffer[l] < 0 ? 0x8000 : 0x7fff)
  }

  return buf
}

self.onmessage = function(e) {
  switch (e.data.type) {
    case 'INIT':
      if (ws === undefined) {
        initializeWebsocket(e.data.apiUrl, e.data.authToken).then(function() {
          self.postMessage({
              type: 'WEBSOCKET_OPEN'
          })
          ws.addEventListener('message', onWebsocketMessage)
          ws.addEventListener('error', onWebsocketError)
          ws.addEventListener('close', onWebsocketClose)
        })
        
        state.targetSampleRate = e.data.targetSampleRate
      }
      break
    case 'SET_SOURSE_SAMPLE_RATE':
      state.sourceSampleRate = e.data.sourceSampleRate
      state.resampleRatio = e.data.sourceSampleRate / e.data.targetSampleRate
      if (state.resampleRatio > 1) {
        state.filter = generateFilter(e.data.sourceSampleRate, e.data.targetSampleRate, 127)
      }
      self.postMessage({
        type: 'SOURSE_SAMPLE_RATE_SET_SUCCESS'
      })
      break
    case 'SET_SHARED_ARRAY_BUFFERS':
      state.controlSAB = new Int32Array(e.data.controlSAB);
      state.dataSAB = new Float32Array(e.data.dataSAB);
      setInterval(sendAudioFromSAB, 4)
      break
    case 'CLOSE':
      if (ws !== undefined) {
        closeWebsocket(e.data.code, e.data.message)
      }
      break
    case 'START_CONTEXT':
      if (ws !== undefined && !state.isContextStarted) {
        state.isContextStarted = true
        const StartEventJSON = JSON.stringify({ event: 'start' })
        ws.send(StartEventJSON)
      } else {
        console.log('can not start context')
      }
      break
    case 'STOP_CONTEXT':
      if (ws !== undefined && state.isContextStarted) {
        state.isContextStarted = false
        const StopEventJSON = JSON.stringify({ event: 'stop' })
        ws.send(StopEventJSON)
      }
      break
    case 'AUDIO':
      if (ws !== undefined && state.isContextStarted) {
        if (state.resampleRatio > 1) {
          // Downsampling
          ws.send(downsample(e.data.payload))
        } else {
          ws.send(float32ToInt16(e.data.payload))
        }
      }
      break
    default:
      console.log('WORKER', e)
  }
}

function sendAudioFromSAB() {
  if (state.isContextStarted) {
    const data = state.dataSAB.subarray(0, state.controlSAB[CONTROL.FRAMES_AVAILABLE]);
    state.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0;
    state.controlSAB[CONTROL.WRITE_INDEX] = 0;
    if (state.resampleRatio > 1) {
      ws.send(downsample(data))
    } else {
      ws.send(float32ToInt16(data))
    }
    
  }
}

function downsample(input) {
  const inputBuffer = new Float32Array(state.buffer.length + input.length)
  inputBuffer.set(state.buffer, 0)
  inputBuffer.set(input, state.buffer.length)

  const outputLength = Math.ceil((inputBuffer.length - state.filter.length) / state.resampleRatio)
  const outputBuffer = new Int16Array(outputLength)

  for (let i = 0; i < outputLength; i++) {
    const offset = Math.round(state.resampleRatio * i)
    let val = 0.0

    for (let j = 0; j < state.filter.length; j++) {
      val += inputBuffer[offset + j] * state.filter[j]
    }

    outputBuffer[i] = val * (val < 0 ? 0x8000 : 0x7fff)
  }

  const remainingOffset = Math.round(state.resampleRatio * outputLength)
  if (remainingOffset < inputBuffer.length) {
    state.buffer = inputBuffer.subarray(remainingOffset)
  } else {
    state.buffer = emptyBuffer
  }

  return outputBuffer
}

function generateFilter(sourceSampleRate, targetSampleRate, length) {
  if (length % 2 === 0) {
    throw Error('Filter length must be odd')
  }

  const cutoff = targetSampleRate / 2
  const filter = new Float32Array(length)
  let sum = 0

  for (let i = 0; i < length; i++) {
    const x = sinc(((2 * cutoff) / sourceSampleRate) * (i - (length - 1) / 2))

    sum += x
    filter[i] = x
  }

  for (let i = 0; i < length; i++) {
    filter[i] = filter[i] / sum
  }

  return filter
}

function sinc(x) {
  if (x === 0.0) {
    return 1.0
  }

  const piX = Math.PI * x
  return Math.sin(piX) / piX
}
`;


    var worker = /*#__PURE__*/Object.defineProperty({
    	default: _default
    }, '__esModule', {value: true});

    var __awaiter$1 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };


    const worker_1 = __importDefault$1(worker);
    class WebWorkerController {
        constructor(apiUrl) {
            this.startCbs = [];
            this.stopCbs = [];
            this.onResponseCb = () => { };
            this.onCloseCb = () => { };
            this.onWebsocketMessage = (event) => {
                const response = event.data;
                switch (response.type) {
                    case types$1.WebsocketResponseType.Opened:
                        break;
                    case types$1.WebsocketResponseType.SourceSampleRateSetSuccess:
                        if (this.resolveInitialization != null) {
                            this.resolveInitialization();
                        }
                        break;
                    case types$1.WebsocketResponseType.Started:
                        this.startCbs.forEach(cb => {
                            try {
                                cb(undefined, response.audio_context);
                            }
                            catch (e) {
                                console.error('[SpeechlyClient] Error while invoking "onStart" callback:', e);
                            }
                        });
                        this.startCbs.length = 0;
                        break;
                    case types$1.WebsocketResponseType.Stopped:
                        this.stopCbs.forEach(cb => {
                            try {
                                cb(undefined, response.audio_context);
                            }
                            catch (e) {
                                console.error('[SpeechlyClient] Error while invoking "onStop" callback:', e);
                            }
                        });
                        this.stopCbs.length = 0;
                        break;
                    default:
                        this.onResponseCb(response);
                }
            };
            this.apiUrl = apiUrl;
        }
        onResponse(cb) {
            this.onResponseCb = cb;
        }
        onClose(cb) {
            this.onCloseCb = cb;
        }
        connect(token, targetSampleRate) {
            this.authToken = token;
            if (this.worker !== undefined) {
                throw Error('Cannot initialize an already initialized worker');
            }
            const blob = new Blob([worker_1.default], { type: 'text/javascript' });
            const blobURL = window.URL.createObjectURL(blob);
            this.worker = new Worker(blobURL);
            this.worker.postMessage({
                type: 'INIT',
                apiUrl: this.apiUrl,
                authToken: this.authToken,
                targetSampleRate,
            });
            if (this.worker != null) {
                this.worker.addEventListener('message', this.onWebsocketMessage);
            }
        }
        initialize(sourceSampleRate) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'SET_SOURSE_SAMPLE_RATE',
                    sourceSampleRate,
                });
                return new Promise((resolve) => {
                    this.resolveInitialization = resolve;
                });
            });
        }
        close() {
            return __awaiter$1(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    if (this.worker != null) {
                        this.worker.postMessage({
                            type: 'CLOSE',
                            code: 1000,
                            message: 'Client has ended the session',
                        });
                        resolve();
                    }
                });
            });
        }
        startContext() {
            return __awaiter$1(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    var _a;
                    this.startCbs.push((err, id) => {
                        if (err !== undefined) {
                            reject(err);
                        }
                        else {
                            resolve(id);
                        }
                    });
                    (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'START_CONTEXT' });
                });
            });
        }
        stopContext() {
            return __awaiter$1(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    var _a;
                    this.stopCbs.push((err, id) => {
                        if (err !== undefined) {
                            reject(err);
                        }
                        else {
                            resolve(id);
                        }
                    });
                    (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'STOP_CONTEXT' });
                });
            });
        }
        postMessage(message) {
            var _a;
            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage(message);
        }
        sendAudio(audioChunk) {
            var _a;
            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'AUDIO', payload: audioChunk });
        }
    }
    var WebWorkerController_1 = WebWorkerController;


    var webWorkerController = /*#__PURE__*/Object.defineProperty({
    	WebWorkerController: WebWorkerController_1
    }, '__esModule', {value: true});

    var websocket = createCommonjsModule(function (module, exports) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(webWorkerController);
    __export(types$1);
    //# sourceMappingURL=index.js.map
    });

    class LocalStorage {
        constructor() {
            this.storage = window.localStorage;
        }
        get(key) {
            const val = this.storage.getItem(key);
            return val;
        }
        set(key, val) {
            this.storage.setItem(key, val);
        }
        getOrSet(key, genFn) {
            let val = this.storage.getItem(key);
            if (val === null) {
                val = genFn();
                this.storage.setItem(key, val);
            }
            return val;
        }
    }
    var LocalStorage_1 = LocalStorage;


    var storage$1 = /*#__PURE__*/Object.defineProperty({
    	LocalStorage: LocalStorage_1
    }, '__esModule', {value: true});

    /**
     * Error to be thrown if storage API is not supported by the device.
     * @public
     */
    var ErrNoStorageSupport = new Error('Current device does not support storage API');
    /**
     * Error to be thrown if requested key was not found in the storage.
     * @public
     */
    var ErrKeyNotFound = new Error('Requested key was not present in storage');


    var types = /*#__PURE__*/Object.defineProperty({
    	ErrNoStorageSupport: ErrNoStorageSupport,
    	ErrKeyNotFound: ErrKeyNotFound
    }, '__esModule', {value: true});

    var storage = createCommonjsModule(function (module, exports) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(storage$1);
    __export(types);
    //# sourceMappingURL=index.js.map
    });

    class SegmentState {
        constructor(ctxId, sId) {
            this.isFinalized = false;
            this.words = [];
            this.entities = new Map();
            this.intent = { intent: '', isFinal: false };
            this.contextId = ctxId;
            this.id = sId;
        }
        toSegment() {
            let i = 0;
            const entities = new Array(this.entities.size);
            this.entities.forEach(v => {
                entities[i] = v;
                i++;
            });
            return {
                id: this.id,
                contextId: this.contextId,
                isFinal: this.isFinalized,
                words: this.words,
                entities: entities,
                intent: this.intent,
            };
        }
        updateTranscript(words) {
            words.forEach(w => {
                // Only accept tentative words if the segment is tentative.
                if (!this.isFinalized || w.isFinal) {
                    this.words[w.index] = w;
                }
            });
            return this;
        }
        updateEntities(entities) {
            entities.forEach(e => {
                // Only accept tentative entities if the segment is tentative.
                if (!this.isFinalized || e.isFinal) {
                    this.entities.set(entityMapKey(e), e);
                }
            });
            return this;
        }
        updateIntent(intent) {
            // Only accept tentative intent if the segment is tentative.
            if (!this.isFinalized || intent.isFinal) {
                this.intent = intent;
            }
            return this;
        }
        finalize() {
            // Filter away any entities which were not finalized.
            this.entities.forEach((val, key) => {
                if (!val.isFinal) {
                    this.entities.delete(key);
                }
            });
            // Filter away any transcripts which were not finalized.
            this.words = this.words.filter(w => w.isFinal);
            if (!this.intent.isFinal) {
                this.intent.intent = '';
                this.intent.isFinal = true;
            }
            // Mark as final.
            this.isFinalized = true;
            return this;
        }
    }
    var SegmentState_1 = SegmentState;
    function entityMapKey(e) {
        return `${e.startPosition.toString()}:${e.endPosition.toString()}`;
    }


    var segment = /*#__PURE__*/Object.defineProperty({
    	SegmentState: SegmentState_1
    }, '__esModule', {value: true});

    function parseTentativeTranscript(data) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        return data.words.map(({ word, index, start_timestamp, end_timestamp }) => {
            return {
                value: word,
                index: index,
                startTimestamp: start_timestamp,
                endTimestamp: end_timestamp,
                isFinal: false,
            };
        });
    }
    var parseTentativeTranscript_1 = parseTentativeTranscript;
    function parseTranscript(data) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        return {
            value: data.word,
            index: data.index,
            startTimestamp: data.start_timestamp,
            endTimestamp: data.end_timestamp,
            isFinal: true,
        };
    }
    var parseTranscript_1 = parseTranscript;
    function parseTentativeEntities(data) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        return data.entities.map(({ entity, value, start_position, end_position }) => {
            return {
                type: entity,
                value: value,
                startPosition: start_position,
                endPosition: end_position,
                isFinal: false,
            };
        });
    }
    var parseTentativeEntities_1 = parseTentativeEntities;
    function parseEntity(data) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        return {
            type: data.entity,
            value: data.value,
            startPosition: data.start_position,
            endPosition: data.end_position,
            isFinal: true,
        };
    }
    var parseEntity_1 = parseEntity;
    function parseIntent(data, isFinal) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        return {
            intent: data.intent,
            isFinal: isFinal,
        };
    }
    var parseIntent_1 = parseIntent;


    var parsers = /*#__PURE__*/Object.defineProperty({
    	parseTentativeTranscript: parseTentativeTranscript_1,
    	parseTranscript: parseTranscript_1,
    	parseTentativeEntities: parseTentativeEntities_1,
    	parseEntity: parseEntity_1,
    	parseIntent: parseIntent_1
    }, '__esModule', {value: true});

    function RetryOperation(timeouts, options) {
      // Compatibility for the old (timeouts, retryForever) signature
      if (typeof options === 'boolean') {
        options = { forever: options };
      }

      this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
      this._timeouts = timeouts;
      this._options = options || {};
      this._maxRetryTime = options && options.maxRetryTime || Infinity;
      this._fn = null;
      this._errors = [];
      this._attempts = 1;
      this._operationTimeout = null;
      this._operationTimeoutCb = null;
      this._timeout = null;
      this._operationStart = null;

      if (this._options.forever) {
        this._cachedTimeouts = this._timeouts.slice(0);
      }
    }
    var retry_operation = RetryOperation;

    RetryOperation.prototype.reset = function() {
      this._attempts = 1;
      this._timeouts = this._originalTimeouts;
    };

    RetryOperation.prototype.stop = function() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      this._timeouts       = [];
      this._cachedTimeouts = null;
    };

    RetryOperation.prototype.retry = function(err) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      if (!err) {
        return false;
      }
      var currentTime = new Date().getTime();
      if (err && currentTime - this._operationStart >= this._maxRetryTime) {
        this._errors.unshift(new Error('RetryOperation timeout occurred'));
        return false;
      }

      this._errors.push(err);

      var timeout = this._timeouts.shift();
      if (timeout === undefined) {
        if (this._cachedTimeouts) {
          // retry forever, only keep last error
          this._errors.splice(this._errors.length - 1, this._errors.length);
          this._timeouts = this._cachedTimeouts.slice(0);
          timeout = this._timeouts.shift();
        } else {
          return false;
        }
      }

      var self = this;
      var timer = setTimeout(function() {
        self._attempts++;

        if (self._operationTimeoutCb) {
          self._timeout = setTimeout(function() {
            self._operationTimeoutCb(self._attempts);
          }, self._operationTimeout);

          if (self._options.unref) {
              self._timeout.unref();
          }
        }

        self._fn(self._attempts);
      }, timeout);

      if (this._options.unref) {
          timer.unref();
      }

      return true;
    };

    RetryOperation.prototype.attempt = function(fn, timeoutOps) {
      this._fn = fn;

      if (timeoutOps) {
        if (timeoutOps.timeout) {
          this._operationTimeout = timeoutOps.timeout;
        }
        if (timeoutOps.cb) {
          this._operationTimeoutCb = timeoutOps.cb;
        }
      }

      var self = this;
      if (this._operationTimeoutCb) {
        this._timeout = setTimeout(function() {
          self._operationTimeoutCb();
        }, self._operationTimeout);
      }

      this._operationStart = new Date().getTime();

      this._fn(this._attempts);
    };

    RetryOperation.prototype.try = function(fn) {
      console.log('Using RetryOperation.try() is deprecated');
      this.attempt(fn);
    };

    RetryOperation.prototype.start = function(fn) {
      console.log('Using RetryOperation.start() is deprecated');
      this.attempt(fn);
    };

    RetryOperation.prototype.start = RetryOperation.prototype.try;

    RetryOperation.prototype.errors = function() {
      return this._errors;
    };

    RetryOperation.prototype.attempts = function() {
      return this._attempts;
    };

    RetryOperation.prototype.mainError = function() {
      if (this._errors.length === 0) {
        return null;
      }

      var counts = {};
      var mainError = null;
      var mainErrorCount = 0;

      for (var i = 0; i < this._errors.length; i++) {
        var error = this._errors[i];
        var message = error.message;
        var count = (counts[message] || 0) + 1;

        counts[message] = count;

        if (count >= mainErrorCount) {
          mainError = error;
          mainErrorCount = count;
        }
      }

      return mainError;
    };

    var retry$2 = createCommonjsModule(function (module, exports) {
    exports.operation = function(options) {
      var timeouts = exports.timeouts(options);
      return new retry_operation(timeouts, {
          forever: options && options.forever,
          unref: options && options.unref,
          maxRetryTime: options && options.maxRetryTime
      });
    };

    exports.timeouts = function(options) {
      if (options instanceof Array) {
        return [].concat(options);
      }

      var opts = {
        retries: 10,
        factor: 2,
        minTimeout: 1 * 1000,
        maxTimeout: Infinity,
        randomize: false
      };
      for (var key in options) {
        opts[key] = options[key];
      }

      if (opts.minTimeout > opts.maxTimeout) {
        throw new Error('minTimeout is greater than maxTimeout');
      }

      var timeouts = [];
      for (var i = 0; i < opts.retries; i++) {
        timeouts.push(this.createTimeout(i, opts));
      }

      if (options && options.forever && !timeouts.length) {
        timeouts.push(this.createTimeout(i, opts));
      }

      // sort the array numerically ascending
      timeouts.sort(function(a,b) {
        return a - b;
      });

      return timeouts;
    };

    exports.createTimeout = function(attempt, opts) {
      var random = (opts.randomize)
        ? (Math.random() + 1)
        : 1;

      var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
      timeout = Math.min(timeout, opts.maxTimeout);

      return timeout;
    };

    exports.wrap = function(obj, options, methods) {
      if (options instanceof Array) {
        methods = options;
        options = null;
      }

      if (!methods) {
        methods = [];
        for (var key in obj) {
          if (typeof obj[key] === 'function') {
            methods.push(key);
          }
        }
      }

      for (var i = 0; i < methods.length; i++) {
        var method   = methods[i];
        var original = obj[method];

        obj[method] = function retryWrapper(original) {
          var op       = exports.operation(options);
          var args     = Array.prototype.slice.call(arguments, 1);
          var callback = args.pop();

          args.push(function(err) {
            if (op.retry(err)) {
              return;
            }
            if (err) {
              arguments[0] = op.mainError();
            }
            callback.apply(this, arguments);
          });

          op.attempt(function() {
            original.apply(obj, args);
          });
        }.bind(obj, original);
        obj[method].options = options;
      }
    };
    });

    var retry$1 = retry$2;

    // Packages


    function retry(fn, opts) {
      function run(resolve, reject) {
        var options = opts || {};

        // Default `randomize` to true
        if (!('randomize' in options)) {
          options.randomize = true;
        }

        var op = retry$1.operation(options);

        // We allow the user to abort retrying
        // this makes sense in the cases where
        // knowledge is obtained that retrying
        // would be futile (e.g.: auth errors)

        function bail(err) {
          reject(err || new Error('Aborted'));
        }

        function onError(err, num) {
          if (err.bail) {
            bail(err);
            return;
          }

          if (!op.retry(err)) {
            reject(op.mainError());
          } else if (options.onRetry) {
            options.onRetry(err, num);
          }
        }

        function runAttempt(num) {
          var val;

          try {
            val = fn(bail, num);
          } catch (err) {
            onError(err, num);
            return;
          }

          Promise.resolve(val)
            .then(resolve)
            .catch(function catchIt(err) {
              onError(err, num);
            });
        }

        op.attempt(runAttempt);
      }

      return new Promise(run);
    }

    var lib = retry;

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(src);

    var uuid_1 = /*@__PURE__*/getAugmentedNamespace(esmBrowser);

    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const locale_code_1 = __importDefault(require$$0);









    const async_retry_1 = __importDefault(lib);
    const deviceIdStorageKey = 'speechly-device-id';
    const authTokenKey = 'speechly-auth-token';
    const defaultApiUrl = 'wss://api.speechly.com/ws/v1';
    const defaultLoginUrl = 'https://api.speechly.com/login';
    const defaultLanguage = 'en-US';
    /**
     * A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the microphone
     * and websocket connection to Speechly API, passing control events and audio stream to the API, reading the responses
     * and dispatching them, as well as providing a high-level API for interacting with so-called speech segments.
     * @public
     */
    class Client {
        constructor(options) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            this.activeContexts = new Map();
            this.reconnectAttemptCount = 5;
            this.reconnectMinDelay = 1000;
            this.contextStopDelay = 250;
            this.state = types$3.ClientState.Disconnected;
            this.stateChangeCb = () => { };
            this.segmentChangeCb = () => { };
            this.tentativeTranscriptCb = () => { };
            this.tentativeEntitiesCb = () => { };
            this.tentativeIntentCb = () => { };
            this.transcriptCb = () => { };
            this.entityCb = () => { };
            this.intentCb = () => { };
            this.handleWebsocketResponse = (response) => {
                var _a;
                if (this.debug) {
                    console.log('[SpeechlyClient]', 'Received response', response);
                }
                // eslint-disable-next-line @typescript-eslint/camelcase
                const { audio_context, segment_id, type } = response;
                let { data } = response;
                const context = this.activeContexts.get(audio_context);
                if (context === undefined) {
                    console.warn('[SpeechlyClient]', 'Received response for non-existent context', audio_context);
                    return;
                }
                let segmentState = (_a = context.get(segment_id)) !== null && _a !== void 0 ? _a : new segment.SegmentState(audio_context, segment_id);
                switch (type) {
                    case websocket.WebsocketResponseType.TentativeTranscript:
                        data = data;
                        const words = parsers.parseTentativeTranscript(data);
                        this.tentativeTranscriptCb(audio_context, segment_id, words, data.transcript);
                        segmentState = segmentState.updateTranscript(words);
                        break;
                    case websocket.WebsocketResponseType.Transcript:
                        data = data;
                        const word = parsers.parseTranscript(data);
                        this.transcriptCb(audio_context, segment_id, word);
                        segmentState = segmentState.updateTranscript([word]);
                        break;
                    case websocket.WebsocketResponseType.TentativeEntities:
                        data = data;
                        const entities = parsers.parseTentativeEntities(data);
                        this.tentativeEntitiesCb(audio_context, segment_id, entities);
                        segmentState = segmentState.updateEntities(entities);
                        break;
                    case websocket.WebsocketResponseType.Entity:
                        data = data;
                        const entity = parsers.parseEntity(data);
                        this.entityCb(audio_context, segment_id, entity);
                        segmentState = segmentState.updateEntities([entity]);
                        break;
                    case websocket.WebsocketResponseType.TentativeIntent:
                        data = data;
                        const tentativeIntent = parsers.parseIntent(data, false);
                        this.tentativeIntentCb(audio_context, segment_id, tentativeIntent);
                        segmentState = segmentState.updateIntent(tentativeIntent);
                        break;
                    case websocket.WebsocketResponseType.Intent:
                        data = data;
                        const intent = parsers.parseIntent(data, true);
                        this.intentCb(audio_context, segment_id, intent);
                        segmentState = segmentState.updateIntent(intent);
                        break;
                    case websocket.WebsocketResponseType.SegmentEnd:
                        segmentState = segmentState.finalize();
                        break;
                    // TODO: handle unexpected response types.
                }
                // Update the segment in current context.
                context.set(segment_id, segmentState);
                // Update current contexts.
                this.activeContexts.set(audio_context, context);
                // Fire segment change event.
                this.segmentChangeCb(segmentState.toSegment());
            };
            this.handleWebsocketClosure = (err) => {
                if (this.debug) {
                    console.error('[SpeechlyClient]', 'Server connection closed', err);
                }
                // If for some reason deviceId is missing, there's nothing else we can do but fail completely.
                if (this.deviceId === undefined) {
                    this.setState(types$3.ClientState.Failed);
                    return;
                }
                // Make sure we don't have concurrent reconnection procedures or attempt to reconnect from a failed state.
                if (this.state === types$3.ClientState.Connecting || this.state === types$3.ClientState.Failed) {
                    return;
                }
                this.setState(types$3.ClientState.Connecting);
                this.reconnectWebsocket(this.deviceId)
                    .then(() => this.setState(types$3.ClientState.Connected))
                    .catch(() => this.setState(types$3.ClientState.Failed));
            };
            this.sampleRate = (_a = options.sampleRate) !== null && _a !== void 0 ? _a : microphone.DefaultSampleRate;
            try {
                const constraints = window.navigator.mediaDevices.getSupportedConstraints();
                this.nativeResamplingSupported = constraints.sampleRate === true;
            }
            catch (_k) {
                this.nativeResamplingSupported = false;
            }
            const language = (_b = options.language) !== null && _b !== void 0 ? _b : defaultLanguage;
            if (!locale_code_1.default.validate(language)) {
                throw Error(`[SpeechlyClient] Invalid language "${language}"`);
            }
            this.debug = (_c = options.debug) !== null && _c !== void 0 ? _c : false;
            this.loginUrl = (_d = options.loginUrl) !== null && _d !== void 0 ? _d : defaultLoginUrl;
            this.appId = options.appId;
            const apiUrl = generateWsUrl((_e = options.apiUrl) !== null && _e !== void 0 ? _e : defaultApiUrl, language, (_f = options.sampleRate) !== null && _f !== void 0 ? _f : microphone.DefaultSampleRate);
            this.apiClient = (_g = options.apiClient) !== null && _g !== void 0 ? _g : new websocket.WebWorkerController(apiUrl);
            this.storage = (_h = options.storage) !== null && _h !== void 0 ? _h : new storage.LocalStorage();
            this.deviceId = this.storage.getOrSet(deviceIdStorageKey, uuid_1.v4);
            const storedToken = this.storage.get(authTokenKey);
            // 2. Fetch auth token. It doesn't matter if it's not present.
            if (storedToken == null || !token.validateToken(storedToken, this.appId, this.deviceId)) {
                token.fetchToken(this.loginUrl, this.appId, this.deviceId).then((token) => {
                    this.authToken = token;
                    // Cache the auth token in local storage for future use.
                    this.storage.set(authTokenKey, this.authToken);
                    // Esteblish websocket connection
                    this.apiClient.connect(this.authToken, this.sampleRate);
                }).catch(err => { throw err; });
            }
            else {
                this.authToken = storedToken;
                this.apiClient.connect(this.authToken, this.sampleRate);
            }
            if (window.AudioContext !== undefined) {
                this.isWebkit = false;
            }
            else if (window.webkitAudioContext !== undefined) {
                this.isWebkit = true;
            }
            else {
                throw microphone.ErrDeviceNotSupported;
            }
            this.microphone = (_j = options.microphone) !== null && _j !== void 0 ? _j : new microphone.BrowserMicrophone(this.isWebkit, this.sampleRate, this.apiClient);
            this.apiClient.onResponse(this.handleWebsocketResponse);
            this.apiClient.onClose(this.handleWebsocketClosure);
        }
        /**
         * Initializes the client, by initializing the microphone and establishing connection to the API.
         *
         * This function HAS to be invoked by a user by e.g. binding it to a button press,
         * or some other user-performed action.
         *
         * If this function is invoked without a user interaction,
         * the microphone functionality will not work due to security restrictions by the browser.
         */
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.state !== types$3.ClientState.Disconnected) {
                    throw Error('Cannot initialize client - client is not in Disconnected state');
                }
                this.setState(types$3.ClientState.Connecting);
                try {
                    // 1. Initialise the storage and fetch deviceId (or generate new one and store it).
                    // await this.storage.initialize()
                    // this.deviceId = await this.storage.getOrSet(deviceIdStorageKey, uuidv4)
                    // 2. Initialise the microphone stack.
                    if (this.isWebkit) {
                        if (window.webkitAudioContext !== undefined) {
                            // eslint-disable-next-line new-cap
                            this.audioContext = new window.webkitAudioContext();
                        }
                    }
                    else {
                        const opts = {};
                        if (this.nativeResamplingSupported) {
                            opts.sampleRate = this.sampleRate;
                        }
                        this.audioContext = new window.AudioContext(opts);
                    }
                    const opts = {
                        video: false,
                    };
                    if (this.nativeResamplingSupported) {
                        opts.audio = {
                            sampleRate: this.sampleRate,
                        };
                    }
                    else {
                        opts.audio = true;
                    }
                    if (this.audioContext != null) {
                        // 3. Initialise websocket.
                        yield this.apiClient.initialize(this.audioContext.sampleRate);
                        yield this.microphone.initialize(this.audioContext, opts);
                    }
                    else {
                        throw microphone.ErrDeviceNotSupported;
                    }
                }
                catch (err) {
                    switch (err) {
                        case microphone.ErrDeviceNotSupported:
                            this.setState(types$3.ClientState.NoBrowserSupport);
                            break;
                        case microphone.ErrNoAudioConsent:
                            this.setState(types$3.ClientState.NoAudioConsent);
                            break;
                        default:
                            this.setState(types$3.ClientState.Failed);
                    }
                    throw err;
                }
                this.setState(types$3.ClientState.Connected);
            });
        }
        /**
         * Closes the client by closing the API connection and disabling the microphone.
         */
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                const errs = [];
                try {
                    yield this.microphone.close();
                }
                catch (err) {
                    errs.push(err.message);
                }
                try {
                    yield this.apiClient.close();
                }
                catch (err) {
                    errs.push(err.message);
                }
                this.activeContexts.clear();
                this.setState(types$3.ClientState.Disconnected);
                if (errs.length > 0) {
                    throw Error(errs.join(','));
                }
            });
        }
        /**
         * Starts a new SLU context by sending a start context event to the API and unmuting the microphone.
         * @param cb - the callback which is invoked when the context start was acknowledged by the API.
         */
        startContext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.resolveStopContext != null) {
                    this.resolveStopContext();
                    yield this.stoppedContextIdPromise;
                }
                if (this.state === types$3.ClientState.Disconnected) {
                    throw Error('Cannot start context - client is not connected');
                }
                this.setState(types$3.ClientState.Starting);
                const contextId = yield this._startContext();
                return contextId;
            });
        }
        _startContext() {
            return __awaiter(this, void 0, void 0, function* () {
                let contextId;
                try {
                    contextId = yield this.apiClient.startContext();
                }
                catch (err) {
                    this.setState(types$3.ClientState.Connected);
                    throw err;
                }
                this.setState(types$3.ClientState.Recording);
                this.microphone.unmute();
                this.activeContexts.set(contextId, new Map());
                return contextId;
            });
        }
        /**
         * Stops current SLU context by sending a stop context event to the API and muting the microphone
         * delayed by contextStopDelay = 250 ms
         */
        stopContext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.state !== types$3.ClientState.Recording && this.state !== types$3.ClientState.Starting) {
                    throw Error('Cannot stop context - client is not recording');
                }
                this.setState(types$3.ClientState.Stopping);
                this.stoppedContextIdPromise = new Promise((resolve) => {
                    Promise.race([
                        new Promise((resolve) => setTimeout(resolve, this.contextStopDelay)),
                        new Promise((resolve) => { this.resolveStopContext = resolve; }),
                    ])
                        .then(() => {
                        this._stopContext()
                            .then(id => { resolve(id); })
                            .catch(err => { throw err; });
                    })
                        .catch(err => { throw err; });
                });
                const contextId = yield this.stoppedContextIdPromise;
                this.setState(types$3.ClientState.Connected);
                this.activeContexts.delete(contextId);
                return contextId;
            });
        }
        _stopContext() {
            return __awaiter(this, void 0, void 0, function* () {
                this.microphone.mute();
                let contextId;
                try {
                    contextId = yield this.apiClient.stopContext();
                }
                catch (err) {
                    this.setState(types$3.ClientState.Failed);
                    throw err;
                }
                return contextId;
            });
        }
        /**
         * Adds a listener for client state change events.
         * @param cb - the callback to invoke on state change events.
         */
        onStateChange(cb) {
            this.stateChangeCb = cb;
        }
        /**
         * Adds a listener for current segment change events.
         * @param cb - the callback to invoke on segment change events.
         */
        onSegmentChange(cb) {
            this.segmentChangeCb = cb;
        }
        /**
         * Adds a listener for tentative transcript responses from the API.
         * @param cb - the callback to invoke on a tentative transcript response.
         */
        onTentativeTranscript(cb) {
            this.tentativeTranscriptCb = cb;
        }
        /**
         * Adds a listener for transcript responses from the API.
         * @param cb - the callback to invoke on a transcript response.
         */
        onTranscript(cb) {
            this.transcriptCb = cb;
        }
        /**
         * Adds a listener for tentative entities responses from the API.
         * @param cb - the callback to invoke on a tentative entities response.
         */
        onTentativeEntities(cb) {
            this.tentativeEntitiesCb = cb;
        }
        /**
         * Adds a listener for entity responses from the API.
         * @param cb - the callback to invoke on an entity response.
         */
        onEntity(cb) {
            this.entityCb = cb;
        }
        /**
         * Adds a listener for tentative intent responses from the API.
         * @param cb - the callback to invoke on a tentative intent response.
         */
        onTentativeIntent(cb) {
            this.tentativeIntentCb = cb;
        }
        /**
         * Adds a listener for intent responses from the API.
         * @param cb - the callback to invoke on an intent response.
         */
        onIntent(cb) {
            this.intentCb = cb;
        }
        reconnectWebsocket(deviceId) {
            return __awaiter(this, void 0, void 0, function* () {
                return async_retry_1.default((_, attempt) => __awaiter(this, void 0, void 0, function* () {
                    if (this.debug) {
                        console.log('[SpeechlyClient]', 'WebSocket reconnection attempt number:', attempt);
                    }
                    // await this.initializeWebsocket(deviceId)
                }), {
                    retries: this.reconnectAttemptCount,
                    minTimeout: this.reconnectMinDelay,
                });
            });
        }
        setState(newState) {
            if (this.state === newState) {
                return;
            }
            if (this.debug) {
                console.log('[SpeechlyClient]', 'State transition', state.stateToString(this.state), state.stateToString(newState));
            }
            this.state = newState;
            this.stateChangeCb(newState);
        }
    }
    var Client_1 = Client;
    function generateWsUrl(baseUrl, languageCode, sampleRate) {
        const params = new URLSearchParams();
        params.append('languageCode', languageCode);
        params.append('sampleRate', sampleRate.toString());
        return `${baseUrl}?${params.toString()}`;
    }


    var client = /*#__PURE__*/Object.defineProperty({
    	Client: Client_1
    }, '__esModule', {value: true});

    var speechly = createCommonjsModule(function (module, exports) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(types$3);

    exports.stateToString = state.stateToString;

    exports.Client = client.Client;
    //# sourceMappingURL=index.js.map
    });

    var browserClient = createCommonjsModule(function (module, exports) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(speechly);
    __export(types$2);
    __export(types$1);
    __export(types);
    //# sourceMappingURL=index.js.map
    });

    /* src/components/mic-frame.svelte generated by Svelte v3.35.0 */

    const file$3 = "src/components/mic-frame.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;
    	let g;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			this.c = noop;
    			attr_dev(stop0, "stop-color", "var(--gradient-stop1)");
    			attr_dev(stop0, "offset", "0%");
    			add_location(stop0, file$3, 9, 4, 218);
    			attr_dev(stop1, "stop-color", "var(--gradient-stop2)");
    			attr_dev(stop1, "offset", "100%");
    			add_location(stop1, file$3, 10, 4, 278);
    			attr_dev(linearGradient, "x1", "50%");
    			attr_dev(linearGradient, "y1", "0%");
    			attr_dev(linearGradient, "x2", "50%");
    			attr_dev(linearGradient, "y2", "100%");
    			attr_dev(linearGradient, "id", "a");
    			add_location(linearGradient, file$3, 8, 2, 154);
    			add_location(defs, file$3, 7, 2, 145);
    			attr_dev(path0, "d", "M46 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z");
    			attr_dev(path0, "fill", "#FFF");
    			add_location(path0, file$3, 14, 2, 405);
    			attr_dev(path1, "d", "M46 0C20.595 0 0 20.595 0 46s20.595 46 46 46 46-20.595 46-46S71.405 0 46 0zm0 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z");
    			attr_dev(path1, "fill", "url(#a)");
    			add_location(path1, file$3, 18, 2, 562);
    			attr_dev(g, "fill", "none");
    			attr_dev(g, "fillrule", "nonzero");
    			add_location(g, file$3, 13, 2, 368);
    			attr_dev(svg, "class", "buttonFrameEl");
    			attr_dev(svg, "viewBox", "0 0 92 92");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 2, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("mic-frame", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<mic-frame> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Mic_frame extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>svg{position:absolute;width:100%;height:100%;pointer-events:auto;user-select:none;cursor:pointer;transform:rotate(var(--fx-rotation));-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none !important;-webkit-user-select:none !important}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance$3,
    			create_fragment$3,
    			not_equal,
    			{}
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("mic-frame", Mic_frame);

    /* src/components/mic-icon.svelte generated by Svelte v3.35.0 */

    const file$2 = "src/components/mic-icon.svelte";

    // (7:0) {#if icon == "mic"}
    function create_if_block_3(ctx) {
    	let svg;
    	let g;
    	let path;
    	let rect;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			rect = svg_element("rect");
    			attr_dev(path, "d", "M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z");
    			add_location(path, file$2, 13, 4, 251);
    			attr_dev(rect, "x", "20");
    			attr_dev(rect, "y", "1");
    			attr_dev(rect, "width", "16");
    			attr_dev(rect, "height", "37");
    			attr_dev(rect, "rx", "8");
    			add_location(rect, file$2, 16, 4, 443);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fillrule", "evenodd");
    			add_location(g, file$2, 12, 2, 212);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 7, 0, 121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path);
    			append_dev(g, rect);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(7:0) {#if icon == \\\"mic\\\"}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#if icon == "failed" || icon == "nobrowsersupport"}
    function create_if_block_2(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z");
    			attr_dev(path0, "fillrule", "nonzero");
    			add_location(path0, file$2, 24, 4, 692);
    			attr_dev(path1, "d", "M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z");
    			add_location(path1, file$2, 28, 4, 909);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fillrule", "evenodd");
    			add_location(g, file$2, 23, 2, 653);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 22, 0, 569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(22:0) {#if icon == \\\"failed\\\" || icon == \\\"nobrowsersupport\\\"}",
    		ctx
    	});

    	return block;
    }

    // (34:0) {#if icon == "noaudioconsent"}
    function create_if_block_1(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M36 14.828V30a8 8 0 01-15.961.79l15.96-15.962zM28 1a8 8 0 018 8v.172L20 25.173V9a8 8 0 018-8z");
    			add_location(path0, file$2, 36, 4, 1259);
    			attr_dev(path1, "d", "M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z");
    			add_location(path1, file$2, 37, 4, 1370);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fillrule", "nonzero");
    			add_location(g, file$2, 35, 2, 1220);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 34, 0, 1136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(34:0) {#if icon == \\\"noaudioconsent\\\"}",
    		ctx
    	});

    	return block;
    }

    // (43:0) {#if icon == "poweron"}
    function create_if_block(ctx) {
    	let svg;
    	let g;
    	let path;
    	let rect;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			rect = svg_element("rect");
    			attr_dev(path, "d", "M52 28c0 13.255-10.745 24-24 24S4 41.255 4 28c0-8.921 4.867-16.705 12.091-20.842l1.984 3.474C12.055 14.08 8 20.566 8 28c0 11.046 8.954 20 20 20s20-8.954 20-20c0-7.434-4.056-13.92-10.075-17.368L39.91 7.16C47.133 11.296 52 19.079 52 28z");
    			attr_dev(path, "fillrule", "nonzero");
    			add_location(path, file$2, 45, 4, 1716);
    			attr_dev(rect, "x", "24");
    			attr_dev(rect, "y", "1");
    			attr_dev(rect, "width", "8");
    			attr_dev(rect, "height", "23");
    			attr_dev(rect, "rx", "4");
    			add_location(rect, file$2, 49, 4, 2003);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fillrule", "evenodd");
    			add_location(g, file$2, 44, 2, 1677);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 43, 0, 1593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path);
    			append_dev(g, rect);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(43:0) {#if icon == \\\"poweron\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let if_block3_anchor;
    	let if_block0 = /*icon*/ ctx[0] == "mic" && create_if_block_3(ctx);
    	let if_block1 = (/*icon*/ ctx[0] == "failed" || /*icon*/ ctx[0] == "nobrowsersupport") && create_if_block_2(ctx);
    	let if_block2 = /*icon*/ ctx[0] == "noaudioconsent" && create_if_block_1(ctx);
    	let if_block3 = /*icon*/ ctx[0] == "poweron" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			this.c = noop;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon*/ ctx[0] == "mic") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*icon*/ ctx[0] == "failed" || /*icon*/ ctx[0] == "nobrowsersupport") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*icon*/ ctx[0] == "noaudioconsent") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*icon*/ ctx[0] == "poweron") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("mic-icon", slots, []);
    	let { icon = "mic" } = $$props;
    	const writable_props = ["icon"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<mic-icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({ icon });

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon];
    }

    class Mic_icon extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>svg{position:absolute;width:60%;height:60%;top:50%;left:50%;transform:translate(-50%, -50%);pointer-events:none;transition:0.25s}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance$2,
    			create_fragment$2,
    			not_equal,
    			{ icon: 0 }
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["icon"];
    	}

    	get icon() {
    		return this.$$.ctx[0];
    	}

    	set icon(icon) {
    		this.$set({ icon });
    		flush();
    	}
    }

    customElements.define("mic-icon", Mic_icon);

    /* src/components/mic-fx.svelte generated by Svelte v3.35.0 */

    const file$1 = "src/components/mic-fx.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;
    	let filter;
    	let feGaussianBlur;
    	let circle;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			filter = svg_element("filter");
    			feGaussianBlur = svg_element("feGaussianBlur");
    			circle = svg_element("circle");
    			this.c = noop;
    			attr_dev(stop0, "stop-color", "var(--gradient-stop1)");
    			attr_dev(stop0, "offset", "0%");
    			add_location(stop0, file$1, 8, 4, 192);
    			attr_dev(stop1, "stop-color", "var(--gradient-stop2)");
    			attr_dev(stop1, "offset", "100%");
    			add_location(stop1, file$1, 9, 4, 252);
    			attr_dev(linearGradient, "x1", "50%");
    			attr_dev(linearGradient, "y1", "10%");
    			attr_dev(linearGradient, "x2", "50%");
    			attr_dev(linearGradient, "y2", "100%");
    			attr_dev(linearGradient, "id", "a");
    			add_location(linearGradient, file$1, 7, 2, 127);
    			attr_dev(feGaussianBlur, "stdDeviation", "18");
    			attr_dev(feGaussianBlur, "in", "SourceGraphic");
    			add_location(feGaussianBlur, file$1, 19, 4, 456);
    			attr_dev(filter, "x", "-35%");
    			attr_dev(filter, "y", "-35%");
    			attr_dev(filter, "width", "170%");
    			attr_dev(filter, "height", "170%");
    			attr_dev(filter, "filterUnits", "objectBoundingBox");
    			attr_dev(filter, "id", "b");
    			add_location(filter, file$1, 11, 2, 332);
    			add_location(defs, file$1, 6, 0, 118);
    			attr_dev(circle, "filter", "url(#b)");
    			attr_dev(circle, "cx", "124");
    			attr_dev(circle, "cy", "124");
    			attr_dev(circle, "r", "79");
    			attr_dev(circle, "fill", "url(#a)");
    			attr_dev(circle, "fillrule", "evenodd");
    			add_location(circle, file$1, 22, 0, 532);
    			attr_dev(svg, "viewBox", "0 0 246 246");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 2, 0, 50);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    			append_dev(defs, filter);
    			append_dev(filter, feGaussianBlur);
    			append_dev(svg, circle);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("mic-fx", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<mic-fx> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Mic_fx extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>svg{top:-75%;left:-75%;height:250%;width:250%;position:absolute;pointer-events:none;transform:rotate(var(--fx-rotation))}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance$1,
    			create_fragment$1,
    			not_equal,
    			{}
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("mic-fx", Mic_fx);

    /* src/push-to-talk-button.svelte generated by Svelte v3.35.0 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src/push-to-talk-button.svelte";

    function create_fragment(ctx) {
    	let main;
    	let mic_fx;
    	let t0;
    	let mic_frame;
    	let t1;
    	let mic_icon;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			mic_fx = element("mic-fx");
    			t0 = space();
    			mic_frame = element("mic-frame");
    			t1 = space();
    			mic_icon = element("mic-icon");
    			this.c = noop;
    			set_style(mic_fx, "opacity", /*fxOpacity*/ ctx[6][1]);
    			set_style(mic_fx, "transform", "rotate(" + /*rotation*/ ctx[4][1] + "deg)");
    			add_location(mic_fx, file, 244, 2, 6172);
    			add_location(mic_frame, file, 248, 2, 6266);
    			set_custom_element_data(mic_icon, "icon", /*icon*/ ctx[0]);
    			add_location(mic_icon, file, 249, 2, 6281);
    			set_style(main, "width", /*size*/ ctx[1]);
    			set_style(main, "height", /*size*/ ctx[1]);
    			set_style(main, "transform", "scale(" + /*scale*/ ctx[5][1] + ")");
    			set_style(main, "--gradient-stop1", /*gradientstop1*/ ctx[2]);
    			set_style(main, "--gradient-stop2", /*gradientstop2*/ ctx[3]);
    			set_style(main, "--fx-rotation", /*rotation*/ ctx[4][1] + "deg");
    			add_location(main, file, 228, 0, 5792);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, mic_fx);
    			append_dev(main, t0);
    			append_dev(main, mic_frame);
    			append_dev(main, t1);
    			append_dev(main, mic_icon);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mouseup", /*tangentEnd*/ ctx[8], false, false, false),
    					listen_dev(window_1, "keydown", /*keyDownCallback*/ ctx[9], false, false, false),
    					listen_dev(window_1, "keyup", /*keyUpCallBack*/ ctx[10], false, false, false),
    					listen_dev(main, "mousedown", /*tangentStart*/ ctx[7], false, false, false),
    					listen_dev(main, "touchstart", /*tangentStart*/ ctx[7], { passive: true }, false, false),
    					listen_dev(main, "dragstart", /*tangentStart*/ ctx[7], false, false, false),
    					listen_dev(main, "mouseup", /*tangentEnd*/ ctx[8], false, false, false),
    					listen_dev(main, "touchend", /*tangentEnd*/ ctx[8], { passive: true }, false, false),
    					listen_dev(main, "dragend", /*tangentEnd*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fxOpacity*/ 64) {
    				set_style(mic_fx, "opacity", /*fxOpacity*/ ctx[6][1]);
    			}

    			if (dirty & /*rotation*/ 16) {
    				set_style(mic_fx, "transform", "rotate(" + /*rotation*/ ctx[4][1] + "deg)");
    			}

    			if (dirty & /*icon*/ 1) {
    				set_custom_element_data(mic_icon, "icon", /*icon*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(main, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(main, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*scale*/ 32) {
    				set_style(main, "transform", "scale(" + /*scale*/ ctx[5][1] + ")");
    			}

    			if (dirty & /*gradientstop1*/ 4) {
    				set_style(main, "--gradient-stop1", /*gradientstop1*/ ctx[2]);
    			}

    			if (dirty & /*gradientstop2*/ 8) {
    				set_style(main, "--gradient-stop2", /*gradientstop2*/ ctx[3]);
    			}

    			if (dirty & /*rotation*/ 16) {
    				set_style(main, "--fx-rotation", /*rotation*/ ctx[4][1] + "deg");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("push-to-talk-button", slots, []);
    	let { size = "6rem" } = $$props;
    	let { icon = "poweron" } = $$props;
    	let { capturekey = " " } = $$props;
    	let { appid } = $$props;
    	let { gradientstop1 = "#15e8b5" } = $$props;
    	let { gradientstop2 = "#4fa1f9" } = $$props;
    	let tangentHeld = false;
    	let rotation = [0, 0];
    	let scale = [0, 0];
    	let fxOpacity = [0, 0];
    	let client = null;
    	let ready = false;
    	let listening = false;
    	let clientState;
    	let pendingClientState;
    	let timeout = null;

    	// Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
    	const thisComponent = get_current_component();

    	const dispatchUnbounded = (name, detail) => {
    		thisComponent.dispatchEvent(new CustomEvent(name,
    		{
    				detail,
    				composed: true, // propagate across the shadow DOM
    				
    			}));
    	};

    	onMount(() => {
    		// Transition in button
    		$$invalidate(5, scale[0] = 1, scale);

    		if (appid) {
    			console.log("Connecting", appid);
    			client = new browserClient.Client({ appId: appid });
    			client.onStateChange(onStateChange);
    		}

    		let requestId = null;

    		const tick = () => {
    			$$invalidate(5, scale = animateValue(scale, 0.2));
    			$$invalidate(6, fxOpacity = animateValue(fxOpacity, 0.08));
    			$$invalidate(4, rotation = animateValue([rotation[0] + 2.5, rotation[1]], 0.05));
    			requestId = requestAnimationFrame(tick);
    		};

    		tick();
    		return () => cancelAnimationFrame(requestId);
    	});

    	const connectSpeechly = appid => {
    		// Create a new Client. appid and language are configured in the dashboard.
    		// Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
    		// Make sure you call `initialize` from a user action handler (e.g. from a button press handler).
    		(async () => {
    			try {
    				await client.initialize();
    			} catch(e) {
    				client = null;
    			}
    		})();

    		// Pass on segment updates from Speechly API.
    		client.onSegmentChange(segment => {
    			dispatchUnbounded("segment-update", segment);
    		});
    	};

    	const tangentStart = () => {
    		if (!tangentHeld) {
    			tangentHeld = true;
    			$$invalidate(5, scale[0] = 1.35, scale);
    			$$invalidate(6, fxOpacity[0] = 1, fxOpacity);
    			vibrate();

    			// Trigger callback defined as property
    			if (thisComponent.onholdstart) thisComponent.onholdstart();

    			// Also trigger an event
    			dispatchUnbounded("onholdstart");

    			// Connect on 1st press
    			if (!ready) {
    				// Play a rotation whirl
    				$$invalidate(4, rotation[0] += 720, rotation);

    				// Auto-release hold after some time
    				if (timeout === null) {
    					timeout = window.setTimeout(
    						() => {
    							$$invalidate(6, fxOpacity[0] = 0, fxOpacity);
    							$$invalidate(5, scale[0] = 1, scale);

    							// updateSkin();
    							timeout = null;
    						},
    						500
    					);
    				}

    				if (appid) connectSpeechly();
    			}

    			// Control speechly
    			if (client && ready && !listening) (async () => {
    				await client.startContext();
    			})();
    		}
    	};

    	const tangentEnd = () => {
    		if (tangentHeld) {
    			tangentHeld = false;
    			$$invalidate(5, scale[0] = 1, scale);
    			$$invalidate(6, fxOpacity[0] = 0, fxOpacity);
    			vibrate();

    			// Cancel any pending auto-release
    			if (timeout !== null) {
    				window.clearTimeout(timeout);
    			}

    			// Trigger callback defined as property
    			if (thisComponent.onholdend) thisComponent.onholdend();

    			// Also trigger an event
    			dispatchUnbounded("onholdend");

    			// Control speechly
    			if (client && listening) (async () => {
    				await client.stopContext();
    			})();

    			updateSkin();
    		}
    	};

    	const keyDownCallback = event => {
    		if (capturekey) {
    			if (event.key === capturekey) {
    				if (!event.repeat) {
    					tangentStart();
    				}

    				event.preventDefault();
    				event.stopPropagation();
    			}
    		}
    	};

    	const keyUpCallBack = event => {
    		if (event.key === capturekey) {
    			tangentEnd();
    		}
    	};

    	const setIcon = newIcon => {
    		$$invalidate(0, icon = newIcon.toLowerCase());
    	};

    	const animateValue = (value, pull) => {
    		return [value[0], value[1] = value[1] * (1 - pull) + value[0] * pull];
    	};

    	const vibrate = (durationMs = 5) => {
    		if (navigator.vibrate !== undefined) {
    			navigator.vibrate(durationMs);
    		}
    	};

    	const updateSkin = () => {
    		if (clientState !== pendingClientState) {
    			clientState = pendingClientState;

    			switch (clientState) {
    				case browserClient.ClientState.Connected:
    					ready = true;
    					setIcon("mic");
    					break;
    				case browserClient.ClientState.Failed:
    					setIcon("failed");
    					dispatchUnbounded("error", "Failed");
    					break;
    				case browserClient.ClientState.NoBrowserSupport:
    					setIcon("failed");
    					dispatchUnbounded("error", "NoBrowserSupport");
    					break;
    				case browserClient.ClientState.NoAudioConsent:
    					setIcon("noaudioconsent");
    					dispatchUnbounded("error", "NoAudioConsent");
    					break;
    			}
    		}
    	};

    	const onStateChange = s => {
    		pendingClientState = s;

    		switch (s) {
    			case browserClient.ClientState.Starting:
    			case browserClient.ClientState.Recording:
    			case browserClient.ClientState.Stopping:
    				listening = true;
    				break;
    			case browserClient.ClientState.Connected:
    				listening = false;
    				break;
    		}

    		// Immediately apply changes if not button held
    		if (!tangentHeld) updateSkin();
    	};

    	const writable_props = ["size", "icon", "capturekey", "appid", "gradientstop1", "gradientstop2"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<push-to-talk-button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("capturekey" in $$props) $$invalidate(11, capturekey = $$props.capturekey);
    		if ("appid" in $$props) $$invalidate(12, appid = $$props.appid);
    		if ("gradientstop1" in $$props) $$invalidate(2, gradientstop1 = $$props.gradientstop1);
    		if ("gradientstop2" in $$props) $$invalidate(3, gradientstop2 = $$props.gradientstop2);
    	};

    	$$self.$capture_state = () => ({
    		Client: browserClient.Client,
    		ClientState: browserClient.ClientState,
    		onMount,
    		get_current_component,
    		size,
    		icon,
    		capturekey,
    		appid,
    		gradientstop1,
    		gradientstop2,
    		tangentHeld,
    		rotation,
    		scale,
    		fxOpacity,
    		client,
    		ready,
    		listening,
    		clientState,
    		pendingClientState,
    		timeout,
    		thisComponent,
    		dispatchUnbounded,
    		connectSpeechly,
    		tangentStart,
    		tangentEnd,
    		keyDownCallback,
    		keyUpCallBack,
    		setIcon,
    		animateValue,
    		vibrate,
    		updateSkin,
    		onStateChange
    	});

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("capturekey" in $$props) $$invalidate(11, capturekey = $$props.capturekey);
    		if ("appid" in $$props) $$invalidate(12, appid = $$props.appid);
    		if ("gradientstop1" in $$props) $$invalidate(2, gradientstop1 = $$props.gradientstop1);
    		if ("gradientstop2" in $$props) $$invalidate(3, gradientstop2 = $$props.gradientstop2);
    		if ("tangentHeld" in $$props) tangentHeld = $$props.tangentHeld;
    		if ("rotation" in $$props) $$invalidate(4, rotation = $$props.rotation);
    		if ("scale" in $$props) $$invalidate(5, scale = $$props.scale);
    		if ("fxOpacity" in $$props) $$invalidate(6, fxOpacity = $$props.fxOpacity);
    		if ("client" in $$props) client = $$props.client;
    		if ("ready" in $$props) ready = $$props.ready;
    		if ("listening" in $$props) listening = $$props.listening;
    		if ("clientState" in $$props) clientState = $$props.clientState;
    		if ("pendingClientState" in $$props) pendingClientState = $$props.pendingClientState;
    		if ("timeout" in $$props) timeout = $$props.timeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		icon,
    		size,
    		gradientstop1,
    		gradientstop2,
    		rotation,
    		scale,
    		fxOpacity,
    		tangentStart,
    		tangentEnd,
    		keyDownCallback,
    		keyUpCallBack,
    		capturekey,
    		appid
    	];
    }

    class Push_to_talk_button extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>main{position:relative;user-select:none}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance,
    			create_fragment,
    			not_equal,
    			{
    				size: 1,
    				icon: 0,
    				capturekey: 11,
    				appid: 12,
    				gradientstop1: 2,
    				gradientstop2: 3
    			}
    		);

    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*appid*/ ctx[12] === undefined && !("appid" in props)) {
    			console_1.warn("<push-to-talk-button> was created without expected prop 'appid'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["size", "icon", "capturekey", "appid", "gradientstop1", "gradientstop2"];
    	}

    	get size() {
    		return this.$$.ctx[1];
    	}

    	set size(size) {
    		this.$set({ size });
    		flush();
    	}

    	get icon() {
    		return this.$$.ctx[0];
    	}

    	set icon(icon) {
    		this.$set({ icon });
    		flush();
    	}

    	get capturekey() {
    		return this.$$.ctx[11];
    	}

    	set capturekey(capturekey) {
    		this.$set({ capturekey });
    		flush();
    	}

    	get appid() {
    		return this.$$.ctx[12];
    	}

    	set appid(appid) {
    		this.$set({ appid });
    		flush();
    	}

    	get gradientstop1() {
    		return this.$$.ctx[2];
    	}

    	set gradientstop1(gradientstop1) {
    		this.$set({ gradientstop1 });
    		flush();
    	}

    	get gradientstop2() {
    		return this.$$.ctx[3];
    	}

    	set gradientstop2(gradientstop2) {
    		this.$set({ gradientstop2 });
    		flush();
    	}
    }

    customElements.define("push-to-talk-button", Push_to_talk_button);

    return Push_to_talk_button;

}());
//# sourceMappingURL=push-to-talk-button.js.map
