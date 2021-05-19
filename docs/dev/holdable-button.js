
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
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
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    let outros;
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

    /* src/components/MicFrame.svelte generated by Svelte v3.38.0 */

    const file$3 = "src/components/MicFrame.svelte";

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
    			attr_dev(stop0, "stop-color", "var(--gradient-stop1)");
    			attr_dev(stop0, "offset", "0%");
    			add_location(stop0, file$3, 17, 4, 383);
    			attr_dev(stop1, "stop-color", "var(--gradient-stop2)");
    			attr_dev(stop1, "offset", "100%");
    			add_location(stop1, file$3, 18, 4, 443);
    			attr_dev(linearGradient, "x1", "50%");
    			attr_dev(linearGradient, "y1", "0%");
    			attr_dev(linearGradient, "x2", "50%");
    			attr_dev(linearGradient, "y2", "100%");
    			attr_dev(linearGradient, "id", "a");
    			add_location(linearGradient, file$3, 16, 2, 319);
    			add_location(defs, file$3, 15, 2, 310);
    			attr_dev(path0, "d", "M46 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z");
    			attr_dev(path0, "fill", "#FFF");
    			add_location(path0, file$3, 22, 2, 570);
    			attr_dev(path1, "d", "M46 0C20.595 0 0 20.595 0 46s20.595 46 46 46 46-20.595 46-46S71.405 0 46 0zm0 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z");
    			attr_dev(path1, "fill", "url(#a)");
    			add_location(path1, file$3, 26, 2, 727);
    			attr_dev(g, "fill", "none");
    			attr_dev(g, "fillrule", "nonzero");
    			add_location(g, file$3, 21, 2, 533);
    			attr_dev(svg, "class", "buttonFrameEl");
    			attr_dev(svg, "viewBox", "0 0 92 92");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg, "position", "absolute");
    			set_style(svg, "width", "100%");
    			set_style(svg, "height", "100%");
    			set_style(svg, "pointer-events", "none");
    			set_style(svg, "user-select", "none");
    			set_style(svg, "transform", "rotate(var(--fx-rotation))");
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
    	validate_slots("MicFrame", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MicFrame> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MicFrame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MicFrame",
    			options,
    			id: create_fragment$3.name
    		});
    	}
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
    const stateToAppearance = {
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
    };

    /* src/components/MicIcon.svelte generated by Svelte v3.38.0 */
    const file$2 = "src/components/MicIcon.svelte";

    // (17:0) {#if icon === Icon.Mic}
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
    			add_location(path, file$2, 23, 4, 451);
    			attr_dev(rect, "x", "20");
    			attr_dev(rect, "y", "1");
    			attr_dev(rect, "width", "16");
    			attr_dev(rect, "height", "37");
    			attr_dev(rect, "rx", "8");
    			add_location(rect, file$2, 26, 4, 643);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fill-rule", "evenodd");
    			add_location(g, file$2, 22, 2, 411);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 17, 0, 320);
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
    		source: "(17:0) {#if icon === Icon.Mic}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#if icon === Icon.Error}
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
    			attr_dev(path0, "fill-rule", "nonzero");
    			add_location(path0, file$2, 34, 4, 866);
    			attr_dev(path1, "d", "M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z");
    			add_location(path1, file$2, 38, 4, 1084);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fill-rule", "evenodd");
    			add_location(g, file$2, 33, 2, 826);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 32, 0, 742);
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
    		source: "(32:0) {#if icon === Icon.Error}",
    		ctx
    	});

    	return block;
    }

    // (44:0) {#if icon === Icon.Denied}
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
    			add_location(path0, file$2, 46, 4, 1431);
    			attr_dev(path1, "d", "M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z");
    			add_location(path1, file$2, 47, 4, 1542);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fill-rule", "nonzero");
    			add_location(g, file$2, 45, 2, 1391);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 44, 0, 1307);
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
    		source: "(44:0) {#if icon === Icon.Denied}",
    		ctx
    	});

    	return block;
    }

    // (53:0) {#if icon === Icon.Poweron}
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
    			attr_dev(path, "fill-rule", "nonzero");
    			add_location(path, file$2, 55, 4, 1893);
    			attr_dev(rect, "x", "24");
    			attr_dev(rect, "y", "1");
    			attr_dev(rect, "width", "8");
    			attr_dev(rect, "height", "23");
    			attr_dev(rect, "rx", "4");
    			add_location(rect, file$2, 59, 4, 2181);
    			attr_dev(g, "fill", "#000");
    			attr_dev(g, "fill-rule", "evenodd");
    			add_location(g, file$2, 54, 2, 1853);
    			attr_dev(svg, "class", "buttonIconEl");
    			attr_dev(svg, "viewBox", "0 0 56 56");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 53, 0, 1769);
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
    		source: "(53:0) {#if icon === Icon.Poweron}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let if_block0 = /*icon*/ ctx[0] === Icon.Mic && create_if_block_3(ctx);
    	let if_block1 = /*icon*/ ctx[0] === Icon.Error && create_if_block_2(ctx);
    	let if_block2 = /*icon*/ ctx[0] === Icon.Denied && create_if_block_1(ctx);
    	let if_block3 = /*icon*/ ctx[0] === Icon.Poweron && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			set_style(div, "position", "absolute");
    			set_style(div, "width", "60%");
    			set_style(div, "height", "60%");
    			set_style(div, "top", "50%");
    			set_style(div, "left", "50%");
    			set_style(div, "transform", "translate(-50%, -50%)");
    			set_style(div, "pointer-events", "none");
    			set_style(div, "transition", "0.25s");
    			set_style(div, "opacity", "var(--icon-opacity)");
    			add_location(div, file$2, 4, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon*/ ctx[0] === Icon.Mic) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*icon*/ ctx[0] === Icon.Error) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*icon*/ ctx[0] === Icon.Denied) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*icon*/ ctx[0] === Icon.Poweron) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					if_block3.m(div, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
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
    	validate_slots("MicIcon", slots, []);
    	let { icon = Icon.Mic } = $$props;
    	const writable_props = ["icon"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MicIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({ Icon, icon });

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon];
    }

    class MicIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { icon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MicIcon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get icon() {
    		throw new Error("<MicIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<MicIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MicFx.svelte generated by Svelte v3.38.0 */

    const file$1 = "src/components/MicFx.svelte";

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
    			attr_dev(stop0, "stop-color", "var(--gradient-stop1)");
    			attr_dev(stop0, "offset", "0%");
    			add_location(stop0, file$1, 16, 6, 353);
    			attr_dev(stop1, "stop-color", "var(--gradient-stop2)");
    			attr_dev(stop1, "offset", "100%");
    			add_location(stop1, file$1, 17, 6, 415);
    			attr_dev(linearGradient, "x1", "50%");
    			attr_dev(linearGradient, "y1", "10%");
    			attr_dev(linearGradient, "x2", "50%");
    			attr_dev(linearGradient, "y2", "100%");
    			attr_dev(linearGradient, "id", "a");
    			add_location(linearGradient, file$1, 15, 4, 286);
    			attr_dev(feGaussianBlur, "stdDeviation", "18");
    			attr_dev(feGaussianBlur, "in", "SourceGraphic");
    			add_location(feGaussianBlur, file$1, 27, 6, 639);
    			attr_dev(filter, "x", "-35%");
    			attr_dev(filter, "y", "-35%");
    			attr_dev(filter, "width", "170%");
    			attr_dev(filter, "height", "170%");
    			attr_dev(filter, "filterUnits", "objectBoundingBox");
    			attr_dev(filter, "id", "b");
    			add_location(filter, file$1, 19, 4, 499);
    			add_location(defs, file$1, 14, 2, 275);
    			attr_dev(circle, "filter", "url(#b)");
    			attr_dev(circle, "cx", "124");
    			attr_dev(circle, "cy", "124");
    			attr_dev(circle, "r", "79");
    			attr_dev(circle, "fill", "url(#a)");
    			attr_dev(circle, "fillrule", "evenodd");
    			add_location(circle, file$1, 30, 2, 721);
    			attr_dev(svg, "viewBox", "0 0 246 246");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg, "top", "-75%");
    			set_style(svg, "left", "-75%");
    			set_style(svg, "height", "250%");
    			set_style(svg, "width", "250%");
    			set_style(svg, "position", "absolute");
    			set_style(svg, "pointer-events", "none");
    			set_style(svg, "opacity", "var(--fx-opacity)");
    			set_style(svg, "transform", "rotate(var(--fx-rotation))");
    			add_location(svg, file$1, 0, 0, 0);
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
    	validate_slots("MicFx", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MicFx> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MicFx extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MicFx",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/holdable-button.svelte generated by Svelte v3.38.0 */

    const { window: window_1 } = globals;
    const file = "src/holdable-button.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let micfx;
    	let t0;
    	let micframe;
    	let t1;
    	let micicon;
    	let t2;
    	let slot;
    	let current;
    	let mounted;
    	let dispose;
    	micfx = new MicFx({ $$inline: true });
    	micframe = new MicFrame({ $$inline: true });

    	micicon = new MicIcon({
    			props: {
    				icon: /*effectiveAppearance*/ ctx[7].icon
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(micfx.$$.fragment);
    			t0 = space();
    			create_component(micframe.$$.fragment);
    			t1 = space();
    			create_component(micicon.$$.fragment);
    			t2 = space();
    			slot = element("slot");
    			this.c = noop;
    			attr_dev(div, "class", "ButtonComponents");
    			set_style(div, "transform", "scale(" + /*scale*/ ctx[4][1] + ")");
    			add_location(div, file, 200, 2, 6324);
    			add_location(slot, file, 209, 2, 6499);
    			set_style(main, "width", /*size*/ ctx[0]);
    			set_style(main, "height", /*size*/ ctx[0]);
    			set_style(main, "--gradient-stop1", /*gradientstop1*/ ctx[1]);
    			set_style(main, "--gradient-stop2", /*gradientstop2*/ ctx[2]);
    			set_style(main, "--fx-rotation", /*rotation*/ ctx[3][1] + "deg");
    			set_style(main, "--fx-opacity", /*fxOpacity*/ ctx[6][1]);
    			set_style(main, "--icon-opacity", /*iconOpacity*/ ctx[5][1]);
    			add_location(main, file, 183, 0, 5906);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(micfx, div, null);
    			append_dev(div, t0);
    			mount_component(micframe, div, null);
    			append_dev(div, t1);
    			mount_component(micicon, div, null);
    			append_dev(main, t2);
    			append_dev(main, slot);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mouseup", /*tangentEnd*/ ctx[9], false, false, false),
    					listen_dev(window_1, "keydown", /*keyDownCallback*/ ctx[10], false, false, false),
    					listen_dev(window_1, "keyup", /*keyUpCallBack*/ ctx[11], false, false, false),
    					listen_dev(main, "mousedown", /*tangentStart*/ ctx[8], false, false, false),
    					listen_dev(main, "touchstart", /*tangentStart*/ ctx[8], false, false, false),
    					listen_dev(main, "dragstart", /*tangentStart*/ ctx[8], false, false, false),
    					listen_dev(main, "mouseup", /*tangentEnd*/ ctx[9], false, false, false),
    					listen_dev(main, "touchend", /*tangentEnd*/ ctx[9], { passive: true }, false, false),
    					listen_dev(main, "dragend", /*tangentEnd*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const micicon_changes = {};
    			if (dirty & /*effectiveAppearance*/ 128) micicon_changes.icon = /*effectiveAppearance*/ ctx[7].icon;
    			micicon.$set(micicon_changes);

    			if (!current || dirty & /*scale*/ 16) {
    				set_style(div, "transform", "scale(" + /*scale*/ ctx[4][1] + ")");
    			}

    			if (!current || dirty & /*size*/ 1) {
    				set_style(main, "width", /*size*/ ctx[0]);
    			}

    			if (!current || dirty & /*size*/ 1) {
    				set_style(main, "height", /*size*/ ctx[0]);
    			}

    			if (!current || dirty & /*gradientstop1*/ 2) {
    				set_style(main, "--gradient-stop1", /*gradientstop1*/ ctx[1]);
    			}

    			if (!current || dirty & /*gradientstop2*/ 4) {
    				set_style(main, "--gradient-stop2", /*gradientstop2*/ ctx[2]);
    			}

    			if (!current || dirty & /*rotation*/ 8) {
    				set_style(main, "--fx-rotation", /*rotation*/ ctx[3][1] + "deg");
    			}

    			if (!current || dirty & /*fxOpacity*/ 64) {
    				set_style(main, "--fx-opacity", /*fxOpacity*/ ctx[6][1]);
    			}

    			if (!current || dirty & /*iconOpacity*/ 32) {
    				set_style(main, "--icon-opacity", /*iconOpacity*/ ctx[5][1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(micfx.$$.fragment, local);
    			transition_in(micframe.$$.fragment, local);
    			transition_in(micicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(micfx.$$.fragment, local);
    			transition_out(micframe.$$.fragment, local);
    			transition_out(micicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(micfx);
    			destroy_component(micframe);
    			destroy_component(micicon);
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
    	let visible;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("null", slots, []);
    	
    	let { icon = SpeechState.Idle } = $$props;
    	let { capturekey = " " } = $$props;
    	let { size = "6rem" } = $$props;
    	let { gradientstop1 = "#15e8b5" } = $$props;
    	let { gradientstop2 = "#4fa1f9" } = $$props;
    	let { hide = undefined } = $$props;
    	let tangentHeld = false;
    	let holdStartTimestamp = 0;
    	let rotation = [0, 0];
    	let scale = [0, 0];
    	let iconOpacity = [1, 1];
    	let fxOpacity = [0, 0];
    	let effectiveAppearance = stateToAppearance[icon];
    	let timeout = null;
    	let prevFrameMillis = 0;
    	let frameMillis = 0;

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
    		$$invalidate(4, scale = [1, 0]);

    		let requestId = null;

    		const tick = () => {
    			prevFrameMillis = frameMillis;
    			frameMillis = new Date().getTime();
    			const tickMs = frameMillis - (prevFrameMillis || frameMillis);

    			if (effectiveAppearance.effect === Effect.Connecting) {
    				// Animate iconOpacity when starting
    				$$invalidate(5, iconOpacity[0] = Math.cos(frameMillis / 2500 * Math.PI * 2) * 0.25 + 0.25, iconOpacity);
    			}

    			if (effectiveAppearance.effect === Effect.Busy) {
    				// Animate iconOpacity when tarting
    				$$invalidate(5, iconOpacity[0] = Math.cos(frameMillis / 1000 * Math.PI * 2) * 0.25 + 0.25, iconOpacity);
    			}

    			$$invalidate(4, scale = [scale[0], animateValue(scale[1], visible ? scale[0] : 0, 0.2, tickMs)]);
    			$$invalidate(5, iconOpacity = [iconOpacity[0], animateValue(iconOpacity[1], iconOpacity[0], 0.08, tickMs)]);
    			$$invalidate(6, fxOpacity = [fxOpacity[0], animateValue(fxOpacity[1], fxOpacity[0], 0.08, tickMs)]);
    			$$invalidate(3, rotation = [rotation[0] + 2.5, animateValue(rotation[1], rotation[0], 0.05, tickMs)]);
    			requestId = requestAnimationFrame(tick);
    		};

    		tick();
    		return () => cancelAnimationFrame(requestId);
    	});

    	const tangentStart = event => {
    		event.preventDefault();
    		event.stopPropagation();

    		if (visible && !tangentHeld) {
    			$$invalidate(15, tangentHeld = true);
    			holdStartTimestamp = Date.now();
    			$$invalidate(4, scale[0] = 1.35, scale);
    			$$invalidate(6, fxOpacity[0] = 1, fxOpacity);
    			vibrate();

    			// Connect on 1st press
    			if (effectiveAppearance.behaviour === Behaviour.Click) {
    				// Play a rotation whirl
    				$$invalidate(3, rotation[0] += 720, rotation);

    				// Auto-release hold after some time
    				if (timeout === null) {
    					timeout = window.setTimeout(
    						() => {
    							$$invalidate(6, fxOpacity[0] = 0, fxOpacity);

    							// scale[0] = 0;
    							// updateSkin();
    							timeout = null;
    						},
    						500
    					);
    				}
    			}

    			// Trigger callback defined as property
    			if (thisComponent.onholdstart) thisComponent.onholdstart();

    			// Also trigger an event
    			dispatchUnbounded("holdstart");
    		}
    	};

    	const tangentEnd = () => {
    		if (tangentHeld) {
    			$$invalidate(4, scale[0] = 1, scale);
    			$$invalidate(6, fxOpacity[0] = 0, fxOpacity);
    			$$invalidate(15, tangentHeld = false);
    			const eventPayload = { timeMs: Date.now() - holdStartTimestamp };
    			vibrate();

    			// Cancel any pending auto-release
    			if (timeout !== null) {
    				window.clearTimeout(timeout);
    			}

    			// Trigger callback defined as property
    			if (thisComponent.onholdend) thisComponent.onholdend(eventPayload);

    			// Also trigger an event
    			dispatchUnbounded("holdend", eventPayload);
    		}
    	};

    	const keyDownCallback = event => {
    		if (capturekey) {
    			if (event.key === capturekey) {
    				var focused_element = document.hasFocus() && document.activeElement !== document.body && document.activeElement !== document.documentElement && document.activeElement || null;

    				if (!focused_element) {
    					if (!event.repeat) {
    						tangentStart(event);
    					} else {
    						event.preventDefault();
    						event.stopPropagation();
    					}
    				}
    			}
    		}
    	};

    	const keyUpCallBack = event => {
    		if (event.key === capturekey) {
    			tangentEnd();
    		}
    	};

    	const animateValue = (value, target, pull, tickMs) => {
    		const NOMINAL_FRAME_MILLIS = 1000 / 60;
    		pull = Math.pow(pull, NOMINAL_FRAME_MILLIS / tickMs);
    		return value * (1 - pull) + target * pull;
    	};

    	const vibrate = (durationMs = 5) => {
    		if (navigator.vibrate !== undefined) {
    			navigator.vibrate(durationMs);
    		}
    	};

    	const updateSkin = newAppearance => {
    		if (effectiveAppearance !== newAppearance) {
    			$$invalidate(7, effectiveAppearance = newAppearance);

    			switch (newAppearance.icon) {
    				case Icon.Mic:
    				case Icon.Denied:
    				case Icon.Error:
    					$$invalidate(5, iconOpacity[0] = 1, iconOpacity);
    					break;
    			}
    		}
    	};

    	const writable_props = ["icon", "capturekey", "size", "gradientstop1", "gradientstop2", "hide"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<null> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("icon" in $$props) $$invalidate(12, icon = $$props.icon);
    		if ("capturekey" in $$props) $$invalidate(13, capturekey = $$props.capturekey);
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("gradientstop1" in $$props) $$invalidate(1, gradientstop1 = $$props.gradientstop1);
    		if ("gradientstop2" in $$props) $$invalidate(2, gradientstop2 = $$props.gradientstop2);
    		if ("hide" in $$props) $$invalidate(14, hide = $$props.hide);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		get_current_component,
    		MicFrame,
    		MicIcon,
    		MicFx,
    		Icon,
    		Effect,
    		Behaviour,
    		SpeechState,
    		stateToAppearance,
    		icon,
    		capturekey,
    		size,
    		gradientstop1,
    		gradientstop2,
    		hide,
    		tangentHeld,
    		holdStartTimestamp,
    		rotation,
    		scale,
    		iconOpacity,
    		fxOpacity,
    		effectiveAppearance,
    		timeout,
    		prevFrameMillis,
    		frameMillis,
    		thisComponent,
    		dispatchUnbounded,
    		tangentStart,
    		tangentEnd,
    		keyDownCallback,
    		keyUpCallBack,
    		animateValue,
    		vibrate,
    		updateSkin,
    		visible
    	});

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(12, icon = $$props.icon);
    		if ("capturekey" in $$props) $$invalidate(13, capturekey = $$props.capturekey);
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("gradientstop1" in $$props) $$invalidate(1, gradientstop1 = $$props.gradientstop1);
    		if ("gradientstop2" in $$props) $$invalidate(2, gradientstop2 = $$props.gradientstop2);
    		if ("hide" in $$props) $$invalidate(14, hide = $$props.hide);
    		if ("tangentHeld" in $$props) $$invalidate(15, tangentHeld = $$props.tangentHeld);
    		if ("holdStartTimestamp" in $$props) holdStartTimestamp = $$props.holdStartTimestamp;
    		if ("rotation" in $$props) $$invalidate(3, rotation = $$props.rotation);
    		if ("scale" in $$props) $$invalidate(4, scale = $$props.scale);
    		if ("iconOpacity" in $$props) $$invalidate(5, iconOpacity = $$props.iconOpacity);
    		if ("fxOpacity" in $$props) $$invalidate(6, fxOpacity = $$props.fxOpacity);
    		if ("effectiveAppearance" in $$props) $$invalidate(7, effectiveAppearance = $$props.effectiveAppearance);
    		if ("timeout" in $$props) timeout = $$props.timeout;
    		if ("prevFrameMillis" in $$props) prevFrameMillis = $$props.prevFrameMillis;
    		if ("frameMillis" in $$props) frameMillis = $$props.frameMillis;
    		if ("visible" in $$props) visible = $$props.visible;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hide*/ 16384) {
    			visible = hide === undefined || hide === "false";
    		}

    		if ($$self.$$.dirty & /*tangentHeld, icon*/ 36864) {
    			// Run this reactive statement whenever icon parameters (icon) changes
    			{
    				if (!tangentHeld) updateSkin(stateToAppearance[icon]);
    			}
    		}
    	};

    	return [
    		size,
    		gradientstop1,
    		gradientstop2,
    		rotation,
    		scale,
    		iconOpacity,
    		fxOpacity,
    		effectiveAppearance,
    		tangentStart,
    		tangentEnd,
    		keyDownCallback,
    		keyUpCallBack,
    		icon,
    		capturekey,
    		hide,
    		tangentHeld
    	];
    }

    class Holdable_button extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>main{position:relative;pointer-events:auto;cursor:pointer;border-radius:50%;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none !important;-webkit-user-select:none !important}.ButtonComponents{width:100%;height:100%}</style>`;

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
    				icon: 12,
    				capturekey: 13,
    				size: 0,
    				gradientstop1: 1,
    				gradientstop2: 2,
    				hide: 14
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
    		return ["icon", "capturekey", "size", "gradientstop1", "gradientstop2", "hide"];
    	}

    	get icon() {
    		return this.$$.ctx[12];
    	}

    	set icon(icon) {
    		this.$set({ icon });
    		flush();
    	}

    	get capturekey() {
    		return this.$$.ctx[13];
    	}

    	set capturekey(capturekey) {
    		this.$set({ capturekey });
    		flush();
    	}

    	get size() {
    		return this.$$.ctx[0];
    	}

    	set size(size) {
    		this.$set({ size });
    		flush();
    	}

    	get gradientstop1() {
    		return this.$$.ctx[1];
    	}

    	set gradientstop1(gradientstop1) {
    		this.$set({ gradientstop1 });
    		flush();
    	}

    	get gradientstop2() {
    		return this.$$.ctx[2];
    	}

    	set gradientstop2(gradientstop2) {
    		this.$set({ gradientstop2 });
    		flush();
    	}

    	get hide() {
    		return this.$$.ctx[14];
    	}

    	set hide(hide) {
    		this.$set({ hide });
    		flush();
    	}
    }

    if (!customElements.get("holdable-button")) {
        customElements.define("holdable-button", Holdable_button);
    }
    else {
        console.warn("Skipping re-defining customElement holdable-button");
    }

}());
//# sourceMappingURL=holdable-button.js.map
