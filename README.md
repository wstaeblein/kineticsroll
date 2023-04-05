# Svelte Kinetic Scroll


Simple Vanilla JS module and Svelte action to transform a container into a vertical momentum scroller, much like cellphones touch screens work when you tap and drag. Point it to a target container and start dragging around with your mouse or finger.

There are a few settings that can optionally be passed into the function as an object with any of the following properties:

- **indicator** - ID of an element that should be within the container and be absolute positioned. This element will serve as an indicator of the scroll and is to be styled by you. Default: empty (no indicator will appear)

- **useWheel** - True if you wish to have some basic scroll wheel support. Default: true.

- **snap** - If true scrolling will end at the closest element border. Only works properly if all elements in the list are the same height. Default: false.

![Example](public/sample.png)

##### [Check out the DEMO](https://wstaeblein.github.io/kineticsroll/)

## Svelte Action

```html
<script>
    import countries from './countries.js';
    import { kineticscroll } from './kineticscroll.js';

    let configs = {
        indicator: 'littlebar'
    }
</script>

<section>
    <div class="container">
        <div id="littlebar"></div>
        <ul use:kineticscroll={configs}>
            {#each countries as country}
                <li>
                    <img src="./flags/{country.code.toLowerCase()}.png" loading="lazy" alt="{country.name}" />
                    <span>{country.name}</span>
                </li>
            {/each}
        </ul>        
    </div>
</section> 

<style>
    #littlebar {
        position: absolute;
        left: 1px;
        width: 6px;
        height: 20px;
        background-color: #ff3e00;
        z-index: 1;
    }
</style>
```
This action expects that a container has a fixed height and a direct child that is longer than this height. If you intend to use an indicator, the container should be absolute or relative positioned. If it isn't the action will change its position to relative.


## Vanilla JS Module

```html
    <div class="container" style="position: relative;">
        <div id="indic" style="transform: translateY(0px);"></div> 
        <ul style="transform: translateY(0px);">
            <li>
                <img src="./flags/ab.png" loading="lazy" alt="Abkhazia">
                <span>Abkhazia</span>
            </li>
            <li>
                <img src="./flags/af.png" loading="lazy" alt="Afghanistan">
                <span>Afghanistan</span></li>
                <li><img src="./flags/ax.png" loading="lazy" alt="Åland Islands">
                <span>Åland Islands</span>
            </li>
        </ul>
    </div>

    <script type="module" src="./kineticscroll.js"></script>

    <script type="module">
        import { kineticscroll } from './kineticscroll.js';

        let target = document.querySelector('.container > ul');

        document.addEventListener('DOMContentLoaded', async function(event) {
           kineticscroll(target, { indicator: 'indic', snap: true });
        });
    </script>

```


## Instalation and Usage

**Only tested on Svelte and latest browsers 3**

This is so simple that it doesn't need a NPM package. Just copy the file ``/src/kineticscroll.js`` to your project's appropriate folder and import it where needed. All other files are just there for the sake of the example.


## Notes

To avoid problems with underlying click events, this class temporarily suspends pointer events on the container element's children. This is done via the pointer-events CSS selector. You may experience some problems should you be manipulating this selector on your container's children and using this class at the same time. The class will do a pointer-events: 'none' when a drag has moved and a pointer-events: 'auto' at the mouseup event.

## Example

Download this code, extract it and run:

```
npm i
npm run dev
```

Or [Click here](https://wstaeblein.github.io/kineticsroll/) to access the online demo.