
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
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

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
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

    /* src/big-transcript.svelte generated by Svelte v3.35.0 */

    const { console: console_1 } = globals;
    const file = "src/big-transcript.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (99:8) {#each words as word}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*word*/ ctx[10].word + "";
    	let t1;
    	let t2_value = " " + "";
    	let t2;
    	let t3;
    	let div2_class_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div0, "class", "TransscriptItemBgDiv");
    			add_location(div0, file, 101, 10, 3875);
    			attr_dev(div1, "class", "TransscriptItemContent");
    			add_location(div1, file, 102, 10, 3921);
    			attr_dev(div2, "class", div2_class_value = `TranscriptItem ${/*word*/ ctx[10].entityType !== null ? "Entity" : ""} ${/*word*/ ctx[10].isFinal ? "Final" : ""} ${/*word*/ ctx[10].entityType ?? ""}`);
    			add_location(div2, file, 99, 8, 3661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*words*/ 1 && t1_value !== (t1_value = /*word*/ ctx[10].word + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*words*/ 1 && div2_class_value !== (div2_class_value = `TranscriptItem ${/*word*/ ctx[10].entityType !== null ? "Entity" : ""} ${/*word*/ ctx[10].isFinal ? "Final" : ""} ${/*word*/ ctx[10].entityType ?? ""}`)) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(99:8) {#each words as word}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value = /*words*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Test test";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.c = noop;
    			set_style(div0, "color", "red");
    			add_location(div0, file, 92, 2, 3412);
    			set_style(div1, "margin-bottom", "1.5rem");
    			add_location(div1, file, 97, 4, 3588);
    			attr_dev(div2, "class", "BigTranscript");
    			add_location(div2, file, 91, 0, 3382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(window, "message", /*message_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*words*/ 1) {
    				each_value = /*words*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("big-transcript", slots, []);
    	
    	

    	// Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
    	const thisComponent = get_current_component();

    	const dispatchUnbounded = (name, detail) => {
    		thisComponent.dispatchEvent(new CustomEvent(name,
    		{
    				detail,
    				composed: true, // propagate across the shadow DOM
    				
    			}));
    	};

    	dispatchUnbounded("debug", "big-transcript.init 1");
    	const fade$1 = fix(fade);

    	const revealTransition = fix((node, { delay = 0, duration = 800 }) => {
    		return {
    			delay,
    			duration,
    			easing: cubicInOut,
    			css: t => `
        opacity: ${interpolateLinearf(fadeIn, t, 0, 1)};
        max-height: ${interpolateLinearf(fadeIn, t, 0, 0.6) * 10}rem;
        margin-bottom: ${interpolateLinearf(fadeIn, t, 0, 0.6) * 1.5}rem;
      `
    		};
    	});

    	const slideTransition = fix((node, { delay = 0, duration = 250 }) => {
    		return {
    			delay,
    			duration,
    			css: t => `
        max-width: ${interpolateLinearf(fadeIn, t, 0, 1) * 10}rem;
      `
    		};
    	});

    	dispatchUnbounded("debug", "big-transcript.init 2");

    	let words = [
    		{
    			word: "Initializing",
    			entityType: null,
    			isFinal: true,
    			serialNumber: 1
    		}
    	];

    	let visible = false;

    	const onSegmentUpdate = segment => {
    		dispatchUnbounded("debug", "big-transcript.onSegmentUpdate 1");
    		if (segment === undefined) return;
    		dispatchUnbounded("debug", "big-transcript.onSegmentUpdate 2");
    		visible = !segment.isFinal;

    		// Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
    		$$invalidate(0, words = []);

    		segment.words.forEach(w => {
    			$$invalidate(
    				0,
    				words[w.index] = {
    					word: w.value,
    					serialNumber: w.index,
    					entityType: null,
    					isFinal: w.isFinal
    				},
    				words
    			);
    		});

    		// Tag words with entities
    		segment.entities.forEach(e => {
    			words.slice(e.startPosition, e.endPosition).forEach(w => {
    				w.entityType = e.type;
    				w.isFinal = e.isFinal;
    			});
    		});

    		// Remove holes from word array
    		$$invalidate(0, words = words.flat());
    	}; // words = [...words];

    	thisComponent.onSegmentUpdate = onSegmentUpdate;

    	const pingHandler = e => {
    		dispatchUnbounded("debug", "big-transcript.ping 1");
    	};

    	onMount(() => {
    		console.log("-------------------------");
    		let requestId = null;
    		const onSegmentUpdateAdapter = e => onSegmentUpdate(e.detail);
    		thisComponent.addEventListener("segment-update", onSegmentUpdateAdapter);

    		thisComponent.addEventListener("ping", pingHandler);

    		// tick();
    		dispatchUnbounded("debug", "big-transcript.onmount 2");

    		return () => {
    			cancelAnimationFrame(requestId);
    			thisComponent.removeEventListener("ping", pingHandler);
    			thisComponent.removeEventListener("segment-update", onSegmentUpdateAdapter);
    		};
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<big-transcript> was created with unknown prop '${key}'`);
    	});

    	const message_handler = e => {
    		e.data.type === "segment-update" && onSegmentUpdate(e.data.segment);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fix,
    		get_current_component,
    		fade_orig: fade,
    		cubicInOut,
    		interpolateLinearf,
    		fadeIn,
    		thisComponent,
    		dispatchUnbounded,
    		fade: fade$1,
    		revealTransition,
    		slideTransition,
    		words,
    		visible,
    		onSegmentUpdate,
    		pingHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ("words" in $$props) $$invalidate(0, words = $$props.words);
    		if ("visible" in $$props) visible = $$props.visible;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [words, onSegmentUpdate, message_handler];
    }

    class Big_transcript extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.BigTranscript{position:relative;user-select:none}.TranscriptItem{position:relative;display:inline-block;margin-left:0.25rem}.Entity{color:cyan}.TransscriptItemContent{z-index:1}.TransscriptItemBgDiv{position:absolute;box-sizing:content-box;width:100%;height:100%;margin:-0.4rem -0.6rem;padding:0.4rem 0.6rem;background-color:#000;z-index:-1}</style>`;

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
    			{}
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("big-transcript", Big_transcript);

}());
//# sourceMappingURL=big-transcript.js.map
