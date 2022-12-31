
// Svelte action to transform a container into a momentum scroller
// By Walter Staeblein - 2022
export function kineticscroll(node, cfgs) {
    'use strict';

    let reference, velocity, frame, timestamp, ticker, amplitude, target, relative;
    let parent = node.parentElement;
    let innerheight = parseInt(getComputedStyle(parent).height, 10);
    let max = parseInt(getComputedStyle(node).height, 10) - innerheight;
    let offset = 0;
    let min = 0;
    let pressed = false;
    let defaultConfigs = { indicator: '', useWheel: true };
    let configs = {...defaultConfigs, ...cfgs};
    let indicator = configs.indicator ? document.getElementById(configs.indicator) : null;
    let timeConstant = 325; 

    if (indicator) {
        let pos = getComputedStyle(parent).position;
        let hgt = getElementFullHeight(indicator); 
        if ('relative absolute fixed'.indexOf(pos) == -1) {
            parent.style.position = 'relative';
        }
        relative = (innerheight - hgt) / max;    
    }


    if (typeof window.ontouchstart !== 'undefined') {
        node.addEventListener('touchstart', tap);
        node.addEventListener('touchmove', drag);
        node.addEventListener('touchend', release);
    }
    node.addEventListener('mousedown', tap);
    node.addEventListener('mousemove', drag);
    node.addEventListener('mouseup', release);
    if (configs.useWheel) { node.addEventListener('wheel', wheel); }

    function getElementFullHeight(ele) {
        let compStyle = window.getComputedStyle(ele);
        return ele.offsetHeight + parseInt(compStyle.getPropertyValue('margin-top')) + parseInt(compStyle.getPropertyValue('margin-bottom'));
    }

    function ypos(e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return e.targetTouches[0].clientY;
        }

        // mouse event
        return e.clientY;
    }

    function scroll(y) {
        offset = (y > max) ? max : (y < min) ? min : y;
        node.style.transform = 'translateY(' + (-offset) + 'px)';
        if (indicator) { indicator.style.transform = 'translateY(' + (offset * relative) + 'px)'; }
    }

    function track() {
        var now, elapsed, delta, v;

        now = Date.now();
        elapsed = now - timestamp;
        timestamp = now;
        delta = offset - frame;
        frame = offset;

        v = 1000 * delta / (1 + elapsed);
        velocity = 0.8 * v + 0.2 * velocity;
    }

    function autoScroll() {
        var elapsed, delta;

        if (amplitude) {
            elapsed = Date.now() - timestamp;
            delta = -amplitude * Math.exp(-elapsed / timeConstant);
            if (delta > 0.5 || delta < -0.5) {
                scroll(target + delta);
                requestAnimationFrame(autoScroll);
            } else {
                scroll(target);
            }
        }
    }

    function wheel(e) {
        var y, delta;

        y = ypos(e);
        delta = event.deltaY;
        if (delta > 2 || delta < -2) {
            reference = y;
            scroll(offset + delta);
        }
        e.preventDefault();
        e.stopPropagation();
        return false;        
    }

    function tap(e) {
        pressed = true;
        reference = ypos(e);

        velocity = amplitude = 0;
        frame = offset;
        timestamp = Date.now();
        clearInterval(ticker);
        ticker = setInterval(track, 100);

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function drag(e) {
        var y, delta;

        if (pressed) {
            y = ypos(e);
            delta = reference - y; 
            if (delta > 2 || delta < -2) {
                reference = y;
                scroll(offset + delta);
            }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function release(e) {
        pressed = false;
        clearInterval(ticker);

        if (velocity > 10 || velocity < -10) {
            amplitude = 0.8 * velocity;
            target = Math.round(offset + amplitude);
            timestamp = Date.now();
            requestAnimationFrame(autoScroll);
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    return {
		destroy() {
            if (typeof window.ontouchstart !== 'undefined') {
                node.removeEventListener('touchstart', tap);
                node.removeEventListener('touchmove', drag);
                node.removeEventListener('touchend', release);
            }
            node.removeEventListener('mousedown', tap);
            node.removeEventListener('mousemove', drag);
            node.removeEventListener('mouseup', release);
            if (configs.useWheel) { node.removeEventListener('wheel', wheel); }
		}
	}
};