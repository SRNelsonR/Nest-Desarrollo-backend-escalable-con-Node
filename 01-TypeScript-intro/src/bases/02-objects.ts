export const pokemonIds = [1, 20, 30, 34, 68];

// pokemonIds.push(+'1');

// console.log(pokemonIds);

interface Pokemon {
    id: number;
    name: string;
    age?: number;
    // age: number | undefined; -- Atiene pero no es lo mismo
}

export const bulbasaur:Pokemon = {
    id: 1,
    name: 'Bulbasaur',
    age: 2
}

export const charmander: Pokemon = {
    id: 4,
    name: 'Charmander',
    age: 1
}

// console.log(bulbasaur);

export const pokemons: Pokemon[] = [];

pokemons.push(charmander, bulbasaur);

console.log( pokemons );