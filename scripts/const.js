export class Constants {
    static #POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
    static #POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
    static #POKEMON_SHINY_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/";
    static #SHINY_ODDS = 1024;
    static #POKEDEX_MAX = 649;
    static #TICK_RATE = 1000;
    
    static get POKEMON_URL() {
        return this.#POKEMON_URL;
    }

    static get POKEDEX_MAX() {
        return this.#POKEDEX_MAX;
    }

    static get TICK_RATE() {
        return this.#TICK_RATE;
    }

    static get POKEMON_IMG_URL() {
        return this.#POKEMON_IMG_URL;
    }

    static get POKEMON_SHINY_IMG_URL() {
        return this.#POKEMON_SHINY_IMG_URL;
    }

    static get SHINY_ODDS() {
        return this.#SHINY_ODDS;
    }
}
