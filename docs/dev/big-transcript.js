
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    const nodes_to_detach = new Set();
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
        for (const node of nodes_to_detach) {
            node.parentNode.removeChild(node);
        }
        nodes_to_detach.clear();
    }
    function append(target, node) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        if (is_hydrating) {
            nodes_to_detach.add(node);
        }
        else if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
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
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
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
                start_hydrating();
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
            end_hydrating();
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
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
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
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.0' }, detail)));
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var types = createCommonjsModule(function (module, exports) {
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

    var SpeechState;
    (function (SpeechState) {
        /**
         * The context is in a state of unrecoverable error.
         * It is only possible to fix this by destroying and creating it from scratch.
         */
        SpeechState["Failed"] = "Failed";
        /**
         * Current browser is not supported by Speechly - it's not possible to use speech functionality.
         */
        SpeechState["NoBrowserSupport"] = "NoBrowserSupport";
        /**
         * The user did not provide permissions to use the microphone - it is not possible to use speech functionality.
         */
        SpeechState["NoAudioConsent"] = "NoAudioConsent";
        /**
         * The context has been created but not initialised. The audio and API connection are not enabled.
         */
        SpeechState["Idle"] = "Idle";
        /**
         * The context is connecting to the API.
         */
        SpeechState["Connecting"] = "Connecting";
        /**
         * The context is ready to use.
         */
        SpeechState["Ready"] = "Ready";
        /**
         * The context is current recording audio and sending it to the API for recognition.
         * The results are also being fetched.
         */
        SpeechState["Recording"] = "Recording";
        /**
         * The context is waiting for the API to finish sending trailing responses.
         * No audio is being sent anymore.
         */
        SpeechState["Loading"] = "Loading";
    })(SpeechState || (SpeechState = {}));
    var Icon;
    (function (Icon) {
        Icon["Poweron"] = "poweron";
        Icon["Mic"] = "mic";
        Icon["Error"] = "error";
        Icon["Denied"] = "denied";
    })(Icon || (Icon = {}));
    var Behaviour;
    (function (Behaviour) {
        Behaviour["Hold"] = "hold";
        Behaviour["Click"] = "click";
        Behaviour["Noninteractive"] = "noninteractive";
    })(Behaviour || (Behaviour = {}));
    var Effect;
    (function (Effect) {
        Effect["None"] = "none";
        Effect["Connecting"] = "connecting";
        Effect["Busy"] = "busy";
    })(Effect || (Effect = {}));
    ({
        [types.ClientState.Disconnected]: { icon: Icon.Poweron, behaviour: Behaviour.Click, effect: Effect.None },
        [types.ClientState.Disconnecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting },
        [types.ClientState.Connecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting },
        [types.ClientState.Connected]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None },
        [types.ClientState.Starting]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.Connecting },
        [types.ClientState.Recording]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None },
        [types.ClientState.Stopping]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Busy },
        [types.ClientState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None },
        [types.ClientState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None },
        [types.ClientState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None },
        [SpeechState.Idle]: { icon: Icon.Poweron, behaviour: Behaviour.Click, effect: Effect.None },
        [SpeechState.Connecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting },
        [SpeechState.Ready]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None },
        [SpeechState.Recording]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None },
        [SpeechState.Loading]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Busy },
        [SpeechState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None },
        [SpeechState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None },
        [SpeechState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None },
    });

    // transfix.js from https://github.com/sveltejs/svelte/issues/4735
    function fix(transtion) {
        return function (node, params) {
            if (!node.hasOwnProperty('ownerDocument')) {
                Object.defineProperty(node, 'ownerDocument', { get: function () { return node.parentElement; } });
                let elem = node;
                while (elem.parentElement) {
                    elem = elem.parentElement;
                }
                node.parentElement.head = elem;
            }
            return transtion(node, params);
        };
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        const len = node.getTotalLength();
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    /**
    * Returns a value based on a response curve defined by tabular data.
    * Some pre-defined graceful curves (gaussian, for example) are pre-defined as part of class
    * @author arzga
    *
    * INTERPOLATE USAGE:
    *
    * float outputValue = TableInterpolator.interpolateLinearf(TableInterpolator.gaussian, 30, 0, 100f);
    *
    * Example:
    *  - Output curve is defined by values in a float array (in this gaussian curve example: values ranging from 0.0f via 1.0f back to 0.0f).
    *  - We want the interpolateLinearf to interpolate and return the value at position 30 on the curve
    *  - The input value range in this call is defined as 0 to 100.
    *  - The output curve is "stretched" to fit the input range. The table defining the curve may have an arbitrary number of values, they just enhance the resolution of the curve.
    *  - A linear interpolated value is returned based on two neighbouring tabular values.
    *  - If pos < min, first table value is returned
    *  - If pos > max, last table value is returned
    *
    * EXTRAPOLATE USAGE:
    *
    * float outputValue = TableInterpolator.extrapolateLinearf(TableInterpolator.gaussian, 30, 0, 100f);
    *
    * To extrapolate output values outside input range, use extrapolateLinearf. Within input range, it functions exactly as interpolateLinearf.
    * Output values outside input range are linearly extrapolated based on two first/last values of tabular data.
    *
    **/
    const fadeIn = [0.0, 1.0];
    /**
     * Look up a matching y for x from table of "y-values" evenly mapped to x-axis range min..max
     * Linearly interpolate in-between values.
     * Repeat table edge y values for x values outside min..max range
     * @param table	Table of float values of at least 2 values
     * @param x
     * @param min	X coordinate of first value in table. If x < min, return first value in table
     * @param max	X coordinate of last value in table. If x > max, return first last in table
     * @return linearly interpolated value "y" corresponding to tabular data mapped to range min..max
     */
    function interpolateLinearf(table, x, min, max) {
        if (x < min)
            return table[0];
        if (x > max)
            return table[table.length - 1];
        let step = (max - min) / (table.length - 1);
        if (step <= 0)
            return table[0];
        let index = (x - min) / step;
        let index_floor = Math.floor(index);
        let index_ceil = Math.ceil(index);
        let offset = index - index_floor;
        return ((1 - offset) * table[index_floor]) + (offset * table[index_ceil]);
    }

    /* src/components/VuMeter.svelte generated by Svelte v3.38.0 */
    const file$1 = "src/components/VuMeter.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-1fz8oog-style";
    	style.textContent = "canvas.svelte-1fz8oog{display:block;width:1.35rem;height:1.5rem;margin:0;padding:0 0.8rem 0 0rem;flex-grow:0;flex-shrink:0;flex-basis:1.35rem}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVnVNZXRlci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBMkpFLE1BQU0sZUFBQyxDQUFBLEFBQ0wsT0FBTyxDQUFFLEtBQUssQ0FDZCxLQUFLLENBQUUsT0FBTyxDQUNkLE1BQU0sQ0FBRSxNQUFNLENBQ2QsTUFBTSxDQUFFLENBQUMsQ0FDVCxPQUFPLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN4QixTQUFTLENBQUUsQ0FBQyxDQUNaLFdBQVcsQ0FBRSxDQUFDLENBQ2QsVUFBVSxDQUFFLE9BQU8sQUFDckIsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJWdU1ldGVyLnN2ZWx0ZSJdfQ== */";
    	append_dev(document.head, style);
    }

    function create_fragment$1(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			set_style(canvas_1, "color", /*color*/ ctx[0]);
    			set_style(canvas_1, "display", "block");
    			set_style(canvas_1, "width", "1.35rem");
    			set_style(canvas_1, "height", "1.5rem");
    			set_style(canvas_1, "margin", "0");
    			set_style(canvas_1, "padding", "0 0.8rem 0 0rem");
    			set_style(canvas_1, "flex-grow", "0");
    			set_style(canvas_1, "flex-shrink", "0");
    			set_style(canvas_1, "flex-basis", "1.35rem");
    			attr_dev(canvas_1, "class", "svelte-1fz8oog");
    			add_location(canvas_1, file$1, 109, 0, 4138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[3](canvas_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(canvas_1, "color", /*color*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[3](null);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("VuMeter", slots, []);
    	let { color = "#60e0ff" } = $$props;

    	const updateVU = (level, seekTimeMs) => {
    		if (Date.now() > VUUpdateTimeStamp) {
    			VUTarget = level;
    		} else {
    			VUTarget = Math.max(VUTarget, level);
    		}

    		VUUpdateTimeStamp = Date.now() + seekTimeMs;
    	};

    	let canvas;
    	let VUTarget = 0;
    	let VUUpdateTimeStamp = 0;
    	let VULevels = [0, 0];

    	const getPixelRatio = context => {
    		var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    		return (window.devicePixelRatio || 1) / backingStore;
    	};

    	const roundRect = (ctx, x, y, width, height, radius) => {
    		if (width < 2 * radius) radius = width / 2;
    		if (height < 2 * radius) radius = height / 2;
    		ctx.beginPath();
    		ctx.moveTo(x + radius, y);
    		ctx.arcTo(x + width, y, x + width, y + height, radius);
    		ctx.arcTo(x + width, y + height, x, y + height, radius);
    		ctx.arcTo(x, y + height, x, y, radius);
    		ctx.arcTo(x, y, x + width, y, radius);
    		ctx.closePath();
    	};

    	onMount(() => {
    		let requestId;
    		const numVUs = (VULevels.length - 1) * 2 + 1;
    		const vuWidthWeight = 3;
    		const vuGapWeight = 1;
    		const totalWeight = vuWidthWeight * numVUs + vuGapWeight * (numVUs - 1);
    		const SeekRatio = 0.15;
    		const DecayRatio = 0.25;
    		const AdoptRatio = 0.25;
    		const VUMinLevel = 0.25;

    		const render = () => {
    			requestId = requestAnimationFrame(render);
    			if (!canvas) return;
    			const context = canvas.getContext("2d");
    			if (!context) return;
    			let ratio = getPixelRatio(context);
    			let width = Number.parseInt(getComputedStyle(canvas).getPropertyValue("width").slice(0, -2));
    			let height = Number.parseInt(getComputedStyle(canvas).getPropertyValue("height").slice(0, -2));
    			$$invalidate(1, canvas.width = width * ratio, canvas);
    			$$invalidate(1, canvas.height = height * ratio, canvas);

    			if (Date.now() < VUUpdateTimeStamp) {
    				VULevels[0] = VUTarget * SeekRatio + VULevels[0] * (1 - SeekRatio);
    			} else {
    				VULevels[0] = VUMinLevel * DecayRatio + VULevels[0] * (1 - DecayRatio);
    			}

    			let i = 1;

    			while (i < VULevels.length) {
    				VULevels[i] = VULevels[i - 1] * AdoptRatio + VULevels[i] * (1 - DecayRatio - AdoptRatio) + VUMinLevel * DecayRatio;
    				i++;
    			}

    			context.clearRect(0, 0, canvas.width, canvas.height);

    			// canvas.style.width = `${width}px`;
    			// canvas.style.height = `${height}px`;
    			const rad = vuWidthWeight / totalWeight * canvas.width * 0.5;

    			const spacing = (vuGapWeight + vuWidthWeight) / totalWeight * canvas.width;
    			context.fillStyle = canvas.style["color"] || "#000000";

    			for (i = 0; i < VULevels.length; i++) {
    				const l = VULevels[i] * canvas.height;

    				// Right symmetrical VU
    				if (l * canvas.height > 2 * rad) {
    					roundRect(context, canvas.width * 0.5 - rad + i * spacing, (canvas.height - l) * 0.5, rad * 2, l, rad);
    				} else {
    					context.beginPath();
    					context.arc(canvas.width * 0.5 + i * spacing, canvas.height * 0.5, l * canvas.height * 0.5, 0, Math.PI * 2);
    				}

    				context.fill();

    				// Left symmetrical VU
    				if (i > 0) {
    					if (l * canvas.height > 2 * rad) {
    						roundRect(context, canvas.width * 0.5 - rad - i * spacing, (canvas.height - l) * 0.5, rad * 2, l, rad);
    					} else {
    						context.beginPath();
    						context.arc(canvas.width * 0.5 - i * spacing, canvas.height * 0.5, l * canvas.height * 0.5, 0, Math.PI * 2);
    					}

    					context.fill();
    				}
    			}
    		};

    		render();
    		updateVU(1, 500);

    		return () => {
    			cancelAnimationFrame(requestId);
    		};
    	});

    	const writable_props = ["color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VuMeter> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvas = $$value;
    			$$invalidate(1, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("color" in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		color,
    		updateVU,
    		canvas,
    		VUTarget,
    		VUUpdateTimeStamp,
    		VULevels,
    		getPixelRatio,
    		roundRect
    	});

    	$$self.$inject_state = $$props => {
    		if ("color" in $$props) $$invalidate(0, color = $$props.color);
    		if ("canvas" in $$props) $$invalidate(1, canvas = $$props.canvas);
    		if ("VUTarget" in $$props) VUTarget = $$props.VUTarget;
    		if ("VUUpdateTimeStamp" in $$props) VUUpdateTimeStamp = $$props.VUUpdateTimeStamp;
    		if ("VULevels" in $$props) VULevels = $$props.VULevels;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, canvas, updateVU, canvas_1_binding];
    }

    class VuMeter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1fz8oog-style")) add_css();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { color: 0, updateVU: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VuMeter",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get color() {
    		throw new Error("<VuMeter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<VuMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateVU() {
    		return this.$$.ctx[2];
    	}

    	set updateVU(value) {
    		throw new Error("<VuMeter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/big-transcript.svelte generated by Svelte v3.38.0 */

    const { window: window_1 } = globals;
    const file = "src/big-transcript.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    // (194:2) {#if visibility}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let vumeter_1;
    	let t1;
    	let div2_intro;
    	let t2;
    	let t3;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let vumeter_1_props = { color: /*highlightcolor*/ ctx[4] };
    	vumeter_1 = new VuMeter({ props: vumeter_1_props, $$inline: true });
    	/*vumeter_1_binding*/ ctx[18](vumeter_1);
    	let if_block0 = /*showlistening*/ ctx[10] && create_if_block_3(ctx);
    	let each_value = /*words*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block1 = /*acknowledged*/ ctx[9] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			create_component(vumeter_1.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "TransscriptItemBgDiv");
    			add_location(div0, file, 196, 8, 6356);
    			attr_dev(div1, "class", "TransscriptItemContent");
    			add_location(div1, file, 197, 8, 6400);
    			attr_dev(div2, "class", "TranscriptItem");
    			add_location(div2, file, 195, 6, 6280);
    			attr_dev(div3, "class", "BigTranscript");
    			add_location(div3, file, 194, 4, 6205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(vumeter_1, div1, null);
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div3, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t3);
    			if (if_block1) if_block1.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const vumeter_1_changes = {};
    			if (dirty & /*highlightcolor*/ 16) vumeter_1_changes.color = /*highlightcolor*/ ctx[4];
    			vumeter_1.$set(vumeter_1_changes);

    			if (/*showlistening*/ ctx[10]) {
    				if (if_block0) {
    					if (dirty & /*showlistening*/ 1024) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*entityClass, words, acknowledged*/ 33344) {
    				each_value = /*words*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div3, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*acknowledged*/ ctx[9]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*acknowledged*/ 512) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(vumeter_1.$$.fragment, local);
    			transition_in(if_block0);

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, /*slideTransition*/ ctx[13], { duration: 200 });
    					div2_intro.start();
    				});
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (div3_outro) div3_outro.end(1);
    				if (!div3_intro) div3_intro = create_in_transition(div3, /*revealTransition*/ ctx[12], {});
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(vumeter_1.$$.fragment, local);
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, /*revealTransition*/ ctx[12], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*vumeter_1_binding*/ ctx[18](null);
    			destroy_component(vumeter_1);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (detaching && div3_outro) div3_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(194:2) {#if visibility}",
    		ctx
    	});

    	return block;
    }

    // (200:10) {#if showlistening}
    function create_if_block_3(ctx) {
    	let div;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Listening...";
    			attr_dev(div, "class", "listening");
    			add_location(div, file, 200, 12, 6552);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, /*slideTransition*/ ctx[13], { duration: 400 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(200:10) {#if showlistening}",
    		ctx
    	});

    	return block;
    }

    // (210:12) {#if index < words.length}
    function create_if_block_2(ctx) {
    	let span;
    	let span_style_value;

    	const block = {
    		c: function create() {
    			span = element("span");

    			attr_dev(span, "style", span_style_value = /*index*/ ctx[30] < /*words*/ ctx[6].length - 1
    			? "width:0.25em;"
    			: /*acknowledged*/ ctx[9] ? "width:1.2em;" : "");

    			add_location(span, file, 210, 14, 7044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*words, acknowledged*/ 576 && span_style_value !== (span_style_value = /*index*/ ctx[30] < /*words*/ ctx[6].length - 1
    			? "width:0.25em;"
    			: /*acknowledged*/ ctx[9] ? "width:1.2em;" : "")) {
    				attr_dev(span, "style", span_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(210:12) {#if index < words.length}",
    		ctx
    	});

    	return block;
    }

    // (205:6) {#each words as word, index}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let div0_intro;
    	let t0;
    	let div1;
    	let t1_value = /*word*/ ctx[28].word + "";
    	let t1;
    	let t2;
    	let div1_intro;
    	let div2_class_value;
    	let if_block = /*index*/ ctx[30] < /*words*/ ctx[6].length && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "TransscriptItemBgDiv");
    			add_location(div0, file, 206, 10, 6846);
    			attr_dev(div1, "class", "TransscriptItemContent");
    			add_location(div1, file, 207, 10, 6911);
    			attr_dev(div2, "class", div2_class_value = "TranscriptItem " + /*entityClass*/ ctx[15](/*word*/ ctx[28]));
    			toggle_class(div2, "Entity", /*word*/ ctx[28].entityType !== null);
    			toggle_class(div2, "Final", /*word*/ ctx[28].isFinal);
    			add_location(div2, file, 205, 8, 6720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*words*/ 64 && t1_value !== (t1_value = /*word*/ ctx[28].word + "")) set_data_dev(t1, t1_value);

    			if (/*index*/ ctx[30] < /*words*/ ctx[6].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*words*/ 64 && div2_class_value !== (div2_class_value = "TranscriptItem " + /*entityClass*/ ctx[15](/*word*/ ctx[28]))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*words, words*/ 64) {
    				toggle_class(div2, "Entity", /*word*/ ctx[28].entityType !== null);
    			}

    			if (dirty & /*words, words*/ 64) {
    				toggle_class(div2, "Final", /*word*/ ctx[28].isFinal);
    			}
    		},
    		i: function intro(local) {
    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, /*slideTransition*/ ctx[13], {});
    					div0_intro.start();
    				});
    			}

    			if (!div1_intro) {
    				add_render_callback(() => {
    					div1_intro = create_in_transition(div1, /*slideTransition*/ ctx[13], {});
    					div1_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(205:6) {#each words as word, index}",
    		ctx
    	});

    	return block;
    }

    // (216:6) {#if acknowledged}
    function create_if_block_1(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let svg;
    	let path;
    	let path_intro;
    	let div2_intro;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(div0, "class", "TransscriptItemBgDiv");
    			set_style(div0, "background-color", /*highlightcolor*/ ctx[4]);
    			add_location(div0, file, 217, 10, 7334);
    			attr_dev(path, "stroke", "currentColor");
    			attr_dev(path, "stroke-width", "3");
    			attr_dev(path, "d", "M7.191 11.444l4.059 6.107 7.376-12.949");
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "fill-rule", "evenodd");
    			add_location(path, file, 219, 179, 7665);
    			set_style(svg, "width", "2rem");
    			set_style(svg, "height", "2rem");
    			set_style(svg, "position", "absolute");
    			set_style(svg, "transform", "translate(-0.5rem, -0.5rem)");
    			set_style(svg, "stroke", "#eee");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file, 219, 12, 7498);
    			set_style(div1, "width", "1.0rem");
    			set_style(div1, "height", "1rem");
    			set_style(div1, "position", "relative");
    			add_location(div1, file, 218, 10, 7424);
    			attr_dev(div2, "class", "TranscriptItem");
    			add_location(div2, file, 216, 8, 7243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*highlightcolor*/ 16) {
    				set_style(div0, "background-color", /*highlightcolor*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (!path_intro) {
    				add_render_callback(() => {
    					path_intro = create_in_transition(path, /*draw*/ ctx[11], { duration: 500 });
    					path_intro.start();
    				});
    			}

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, /*slideTransition*/ ctx[13], { duration: 200, maxWidth: 3 });
    					div2_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(216:6) {#if acknowledged}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visibility*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t = space();
    			link = element("link");
    			this.c = noop;
    			set_style(main, "--voffset", /*voffset*/ ctx[1]);
    			set_style(main, "--hoffset", /*hoffset*/ ctx[2]);
    			set_style(main, "--fontsize", /*fontsize*/ ctx[3]);
    			set_style(main, "--highlight-color", /*highlightcolor*/ ctx[4]);
    			set_style(main, "--text-bg-color", /*textbgcolor*/ ctx[5]);
    			toggle_class(main, "placementTop", /*placement*/ ctx[0] === "top");
    			add_location(main, file, 185, 0, 5976);
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file, 228, 2, 7909);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			insert_dev(target, t, anchor);
    			append_dev(document.head, link);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "message", /*handleMessage*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visibility*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visibility*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*voffset*/ 2) {
    				set_style(main, "--voffset", /*voffset*/ ctx[1]);
    			}

    			if (!current || dirty & /*hoffset*/ 4) {
    				set_style(main, "--hoffset", /*hoffset*/ ctx[2]);
    			}

    			if (!current || dirty & /*fontsize*/ 8) {
    				set_style(main, "--fontsize", /*fontsize*/ ctx[3]);
    			}

    			if (!current || dirty & /*highlightcolor*/ 16) {
    				set_style(main, "--highlight-color", /*highlightcolor*/ ctx[4]);
    			}

    			if (!current || dirty & /*textbgcolor*/ 32) {
    				set_style(main, "--text-bg-color", /*textbgcolor*/ ctx[5]);
    			}

    			if (dirty & /*placement*/ 1) {
    				toggle_class(main, "placementTop", /*placement*/ ctx[0] === "top");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t);
    			detach_dev(link);
    			mounted = false;
    			dispose();
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

    const HIDE_TIMEOUT_MS = 2000;

    function instance($$self, $$props, $$invalidate) {
    	let showlistening;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("null", slots, []);
    	
    	
    	let { placement = undefined } = $$props;
    	let { voffset = "3rem" } = $$props;
    	let { hoffset = "2rem" } = $$props;
    	let { fontsize = "1.5rem" } = $$props;
    	let { highlightcolor = "#15e8b5" } = $$props;
    	let { textbgcolor = "#202020" } = $$props;
    	let words = [];
    	let vumeter = undefined;
    	let buttonheld = false;
    	let timeout = null;
    	let lastSegmentId = null;
    	let clientState = types.ClientState.Disconnected;
    	let showingTranscript = false;
    	let visibility = false;
    	let acknowledged = false;
    	const thisComponent = get_current_component();

    	// Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
    	const dispatchUnbounded = (name, detail) => {
    		thisComponent.dispatchEvent(new CustomEvent(name,
    		{
    				detail,
    				composed: true, // propagate across the shadow DOM
    				
    			}));
    	};

    	const draw$1 = fix(draw);

    	const revealTransition = fix((node, { delay = 0, duration = 400 }) => {
    		return {
    			delay,
    			duration,
    			easing: cubicInOut,
    			css: t => `
        opacity: ${interpolateLinearf(fadeIn, t, 0, 1)};
        max-height: ${interpolateLinearf(fadeIn, t, 0, 0.6) * 10}rem;
      `
    		}; // margin-bottom: ${interpolateLinearf(fadeIn, t, 0.0, 0.6) * 1.5}rem;
    	});

    	const slideTransition = fix((node, { delay = 0, duration = 350, maxWidth = 10 }) => {
    		return {
    			delay,
    			duration,
    			css: t => `
        max-width: ${interpolateLinearf(fadeIn, t, 0, 1) * maxWidth}rem;
      `
    		};
    	});

    	const handleMessage = e => {
    		switch (e.data.type) {
    			case "speechsegment":
    				onSegmentUpdate(e.data.segment);
    				break;
    			case "holdstart":
    				buttonheld = true;
    				break;
    			case "holdend":
    				buttonheld = false;
    				break;
    			case "speechhandled":
    				if (e.data.success) {
    					$$invalidate(9, acknowledged = true);
    				}
    				break;
    			case "speechstate":
    				$$invalidate(16, clientState = e.data.state);
    				if (clientState === types.ClientState.Recording) {
    					$$invalidate(9, acknowledged = false);
    					$$invalidate(6, words = []);
    					lastSegmentId = null;
    				}
    				break;
    		}
    	};

    	const onSegmentUpdate = segment => {
    		if (segment === undefined) return;

    		// Animate VU meter
    		if (vumeter && buttonheld) {
    			vumeter.updateVU(Math.random() * 0.5 + 0.5, Math.random() * 75 + 75);
    		} // dispatchEvent(new CustomEvent("updateVU", {detail: {level: 1.0, seekTimeMs: 1000}}));

    		if (segment.isFinal) {
    			scheduleHide(words.length > 0 ? HIDE_TIMEOUT_MS : 0);
    		} else {
    			if (words.length > 0) {
    				if (!showingTranscript) {
    					$$invalidate(17, showingTranscript = true);
    				}

    				scheduleHide(HIDE_TIMEOUT_MS);
    			}
    		}

    		// Detect segment change
    		const segmentId = `${segment.contextId}/${segment.id}`;

    		if (lastSegmentId !== null) {
    			if (lastSegmentId !== segmentId) {
    				// New segment within the same utterance
    				$$invalidate(9, acknowledged = false);

    				lastSegmentId = segmentId;
    			}
    		} else {
    			lastSegmentId = segmentId;
    		}

    		// Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
    		$$invalidate(6, words = []);

    		segment.words.forEach(w => {
    			$$invalidate(
    				6,
    				words[w.index] = {
    					word: w.value,
    					serialNumber: w.index,
    					entityType: null,
    					isFinal: w.isFinal,
    					hide: false
    				},
    				words
    			);
    		});

    		// Replace words with entity values. Note that there may be overlapping tentative entity ranges
    		segment.entities.forEach(e => {
    			$$invalidate(6, words[e.startPosition].word = e.value, words);
    			$$invalidate(6, words[e.startPosition].entityType = e.type, words);
    			$$invalidate(6, words[e.startPosition].isFinal = e.isFinal, words);
    			$$invalidate(6, words[e.startPosition].hide = false, words);

    			for (let index = e.startPosition + 1; index < e.endPosition; index++) {
    				// words array may be "holey"
    				if (words[index]) $$invalidate(6, words[index].hide = true, words);
    			}

    			
    		});

    		// Remove holes and hidden from word array
    		$$invalidate(6, words = words.filter(w => !w.hide));
    	};

    	thisComponent.onSegmentUpdate = onSegmentUpdate;

    	const entityClass = word => {
    		return word.entityType || "";
    	};

    	const pingHandler = e => {
    		dispatchUnbounded("debug", "big-transcript.ping 1");
    	};

    	const scheduleHide = (prerollMs = 0) => {
    		cancelHide();

    		timeout = window.setTimeout(
    			() => {
    				timeout = null;

    				if (showingTranscript) {
    					$$invalidate(17, showingTranscript = false);
    				}
    			},
    			prerollMs
    		);
    	};

    	const cancelHide = () => {
    		if (timeout !== null) {
    			window.clearTimeout(timeout);
    			timeout = null;
    		}
    	};

    	onMount(() => {
    		let requestId = null;
    		const onSegmentUpdateAdapter = e => onSegmentUpdate(e.detail);
    		thisComponent.addEventListener("speechsegment", onSegmentUpdateAdapter);
    		thisComponent.addEventListener("ping", pingHandler);

    		return () => {
    			cancelAnimationFrame(requestId);
    			thisComponent.removeEventListener("speechsegment", onSegmentUpdateAdapter);
    			thisComponent.removeEventListener("ping", pingHandler);
    		};
    	});

    	const writable_props = ["placement", "voffset", "hoffset", "fontsize", "highlightcolor", "textbgcolor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<null> was created with unknown prop '${key}'`);
    	});

    	function vumeter_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			vumeter = $$value;
    			$$invalidate(8, vumeter);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("placement" in $$props) $$invalidate(0, placement = $$props.placement);
    		if ("voffset" in $$props) $$invalidate(1, voffset = $$props.voffset);
    		if ("hoffset" in $$props) $$invalidate(2, hoffset = $$props.hoffset);
    		if ("fontsize" in $$props) $$invalidate(3, fontsize = $$props.fontsize);
    		if ("highlightcolor" in $$props) $$invalidate(4, highlightcolor = $$props.highlightcolor);
    		if ("textbgcolor" in $$props) $$invalidate(5, textbgcolor = $$props.textbgcolor);
    	};

    	$$self.$capture_state = () => ({
    		ClientState: types.ClientState,
    		onMount,
    		fix,
    		get_current_component,
    		draw_orig: draw,
    		cubicInOut,
    		interpolateLinearf,
    		fadeIn,
    		VuMeter,
    		HIDE_TIMEOUT_MS,
    		placement,
    		voffset,
    		hoffset,
    		fontsize,
    		highlightcolor,
    		textbgcolor,
    		words,
    		vumeter,
    		buttonheld,
    		timeout,
    		lastSegmentId,
    		clientState,
    		showingTranscript,
    		visibility,
    		acknowledged,
    		thisComponent,
    		dispatchUnbounded,
    		draw: draw$1,
    		revealTransition,
    		slideTransition,
    		handleMessage,
    		onSegmentUpdate,
    		entityClass,
    		pingHandler,
    		scheduleHide,
    		cancelHide,
    		showlistening
    	});

    	$$self.$inject_state = $$props => {
    		if ("placement" in $$props) $$invalidate(0, placement = $$props.placement);
    		if ("voffset" in $$props) $$invalidate(1, voffset = $$props.voffset);
    		if ("hoffset" in $$props) $$invalidate(2, hoffset = $$props.hoffset);
    		if ("fontsize" in $$props) $$invalidate(3, fontsize = $$props.fontsize);
    		if ("highlightcolor" in $$props) $$invalidate(4, highlightcolor = $$props.highlightcolor);
    		if ("textbgcolor" in $$props) $$invalidate(5, textbgcolor = $$props.textbgcolor);
    		if ("words" in $$props) $$invalidate(6, words = $$props.words);
    		if ("vumeter" in $$props) $$invalidate(8, vumeter = $$props.vumeter);
    		if ("buttonheld" in $$props) buttonheld = $$props.buttonheld;
    		if ("timeout" in $$props) timeout = $$props.timeout;
    		if ("lastSegmentId" in $$props) lastSegmentId = $$props.lastSegmentId;
    		if ("clientState" in $$props) $$invalidate(16, clientState = $$props.clientState);
    		if ("showingTranscript" in $$props) $$invalidate(17, showingTranscript = $$props.showingTranscript);
    		if ("visibility" in $$props) $$invalidate(7, visibility = $$props.visibility);
    		if ("acknowledged" in $$props) $$invalidate(9, acknowledged = $$props.acknowledged);
    		if ("showlistening" in $$props) $$invalidate(10, showlistening = $$props.showlistening);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*words*/ 64) {
    			$$invalidate(10, showlistening = words.length === 0);
    		}

    		if ($$self.$$.dirty & /*clientState, showingTranscript, visibility*/ 196736) {
    			{
    				const newVisibility = clientState === types.ClientState.Recording || showingTranscript;

    				if (newVisibility !== visibility) {
    					dispatchUnbounded("visibilitychanged", newVisibility);
    				}

    				$$invalidate(7, visibility = newVisibility);
    			}
    		}
    	};

    	return [
    		placement,
    		voffset,
    		hoffset,
    		fontsize,
    		highlightcolor,
    		textbgcolor,
    		words,
    		visibility,
    		vumeter,
    		acknowledged,
    		showlistening,
    		draw$1,
    		revealTransition,
    		slideTransition,
    		handleMessage,
    		entityClass,
    		clientState,
    		showingTranscript,
    		vumeter_1_binding
    	];
    }

    class Big_transcript extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.BigTranscript{position:relative;user-select:none;font-family:'Saira Condensed', sans-serif;text-transform:uppercase;color:#fff;font-size:var(--fontsize);line-height:135%;display:flex;flex-direction:row;justify-content:start;flex-wrap:wrap}.TranscriptItem{position:relative;display:flex;flex-direction:row;align-items:center}.Entity{color:var(--highlight-color)}.TransscriptItemContent{z-index:1;display:flex;flex-wrap:nowrap;flex-direction:row;align-items:center;overflow:hidden}.TransscriptItemBgDiv{position:absolute;box-sizing:content-box;width:100%;height:100%;top:-0.2rem;left:-0.8rem;margin:0;padding:0.2rem 0.8rem;background-color:var(--text-bg-color);z-index:-1}.placementTop{position:fixed;top:0;left:0;right:0;bottom:0;margin:var(--voffset) var(--hoffset) 0 var(--hoffset);z-index:50;pointer-events:none}.listening{animation:flow 1s linear infinite;background:linear-gradient(-60deg, #fff8, #fffc, #fff8, #fffc, #fff8);background-size:200%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;-webkit-box-decoration-break:clone}@keyframes flow{0%{background-position:100% 50%}100%{background-position:0% 50%}}</style>`;

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
    				placement: 0,
    				voffset: 1,
    				hoffset: 2,
    				fontsize: 3,
    				highlightcolor: 4,
    				textbgcolor: 5
    			}
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
    		return [
    			"placement",
    			"voffset",
    			"hoffset",
    			"fontsize",
    			"highlightcolor",
    			"textbgcolor"
    		];
    	}

    	get placement() {
    		return this.$$.ctx[0];
    	}

    	set placement(placement) {
    		this.$set({ placement });
    		flush();
    	}

    	get voffset() {
    		return this.$$.ctx[1];
    	}

    	set voffset(voffset) {
    		this.$set({ voffset });
    		flush();
    	}

    	get hoffset() {
    		return this.$$.ctx[2];
    	}

    	set hoffset(hoffset) {
    		this.$set({ hoffset });
    		flush();
    	}

    	get fontsize() {
    		return this.$$.ctx[3];
    	}

    	set fontsize(fontsize) {
    		this.$set({ fontsize });
    		flush();
    	}

    	get highlightcolor() {
    		return this.$$.ctx[4];
    	}

    	set highlightcolor(highlightcolor) {
    		this.$set({ highlightcolor });
    		flush();
    	}

    	get textbgcolor() {
    		return this.$$.ctx[5];
    	}

    	set textbgcolor(textbgcolor) {
    		this.$set({ textbgcolor });
    		flush();
    	}
    }

    if (!customElements.get("big-transcript")) {
        customElements.define("big-transcript", Big_transcript);
    }
    else {
        console.warn("Skipping re-defining customElement big-transcript");
    }

}());
//# sourceMappingURL=big-transcript.js.map
