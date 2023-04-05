
// Vanilla JS module and Svelte action to transform a container into a momentum scroller
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
    let wheeling = false;
    let defaultConfigs = { indicator: '', useWheel: true, snap: false };
    let configs = {...defaultConfigs, ...cfgs};
    let indicator = configs.indicator ? document.getElementById(configs.indicator) : null;
    let timeConstant = 325; 
    let snapHeight = configs.snap ? getElementFullHeight(node.children[0]) : 1;
    let wheelTicker = 0;

    if (indicator) {
        let pos = getComputedStyle(parent).position;
        let hgt = getElementFullHeight(indicator); 
        if ('relative absolute fixed'.indexOf(pos) == -1) {
            parent.style.position = 'relative';
        }
        relative = (innerheight - hgt) / max;    
    }


    if (typeof window.ontouchstart !== 'undefined') {
        node.addEventListener('touchstart', start);
        node.addEventListener('touchmove', drag);
        node.addEventListener('touchend', release);
    }
    node.addEventListener('mousedown', start);
    node.addEventListener('mousemove', drag);
    node.addEventListener('mouseup', release);
    node.addEventListener('mouseleave', preRelease);
    if (configs.useWheel) { node.addEventListener('wheel', wheel); }

    function getElementFullHeight(ele) {
        let compStyle = window.getComputedStyle(ele);
        return ele.offsetHeight + parseInt(compStyle.getPropertyValue('margin-top')) + parseInt(compStyle.getPropertyValue('margin-bottom'));
    }

    function ypos(e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return e.targetTouches[0].clientY;
        } else if (e.deltaY) {
            return e.deltaY
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
        let now = Date.now();
        let elapsed = now - timestamp;
        timestamp = now;

        let delta = offset - frame;
        frame = offset;

        let v = 1000 * delta / (1 + elapsed);
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

        if (wheelTicker) { 
            clearTimeout(wheelTicker); 
        } else { 
            track(); 
            start(e, true);
        }

        y = ypos(e);
        delta = event.deltaY;
        reference = y;
        let total = offset + delta;
        let amount = configs.snap ? Math.round(total / snapHeight) * snapHeight : total; 
        scroll(amount);
     
        wheelTicker = setTimeout(function() {
            clearTimeout(wheelTicker);
            wheelTicker = 0;
            release(e);
        }, 60);

        e.preventDefault();
        e.stopPropagation();
        return false;        
    }

    function start(e, isWheel) {
        if (isWheel) { wheeling = true; } else { pressed = true; }
        reference = ypos(e);

        node.style.cursor = 'ns-resize';
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
            if (Math.abs(delta) > 5) {
                reference = y;
                scroll(offset + delta);

                Array.from(node.children).forEach((ele) => { ele.style.pointerEvents = 'none' });
            }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function preRelease(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.buttons == 1) { release(e); }
    }

    function release(e) {
        e.stopPropagation();
        e.preventDefault();

        pressed = false;
        wheeling = false;
        clearInterval(ticker);

        if (velocity > 10 || velocity < -10 || configs.snap) { 
            amplitude = 0.8 * velocity;
            target = Math.round(offset + amplitude);
            if (configs.snap) { target = Math.round(target / snapHeight) * snapHeight; }
            timestamp = Date.now();
            requestAnimationFrame(autoScroll);
        } 
        e.preventDefault();
        e.stopPropagation(); 

        Array.from(node.children).forEach((ele) => { ele.style.pointerEvents = 'auto' });
        node.style.cursor = 'auto';
        return false;
    }

    return {
		destroy() {
            if (typeof window.ontouchstart !== 'undefined') {
                node.removeEventListener('touchstart', start);
                node.removeEventListener('touchmove', drag);
                node.removeEventListener('touchend', release);
            }
            node.removeEventListener('mousedown', start);
            node.removeEventListener('mousemove', drag);
            node.removeEventListener('mouseup', release);
            if (configs.useWheel) { node.removeEventListener('wheel', wheel, { passive: false }); }
		}
	}
};