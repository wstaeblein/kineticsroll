<script>
    import countries from './countries.js';
    import { kineticscroll } from './kineticscroll.js';

console.log(countries)
</script>

<main>
	<h1>Kinetic Scroll</h1>
    <h3>Example</h3>
    <p>Drag vertically through the list of countries and territories<br>below to check the action behaviour</p>
    <div class="container">
        <div id="indic"></div>
        <ul use:kineticscroll={{ indicator: 'indic'}}>
            {#each countries as country}
                <li><img src="./flags/{country.code.toLowerCase()}.png" loading="lazy" alt="{country.name}" /><span>{country.name}</span></li>
            {/each}
        </ul>        
    </div>

</main>

<style>
    #indic {
        position: absolute;
        left: 1px;
        width: 6px;
        height: 20px;
        background-color: #ff3e00;
        z-index: 1;
    }

    p {
        text-align: center;
        margin: 0 0 1em;
    }
    .container {
        border: 1px solid #eee;
        width: fit-content;
        margin: auto;
        height: 400px;
        overflow: hidden;
    }
    ul {
        width: fit-content;
        text-align: left;
        list-style: none;
        padding: 0;
        margin: 0;
        background-color: #fafafa;
    }

    ul > li {
        padding: 10px 10px 10px 16px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    ul > li > img {
        width: 40px;
        height: 32px;
        object-fit: contain;
    }

    ul > li:last-child {
        border-bottom: none;
    }



	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
        text-align: center;
        margin: 1rem 0 0 0;
	}

    h3 {
        margin: 0 0 1em;
        text-align: center;
        text-transform: uppercase;
    }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>