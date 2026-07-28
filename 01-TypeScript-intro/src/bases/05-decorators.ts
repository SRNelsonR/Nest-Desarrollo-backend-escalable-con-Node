class NewPokemon {
    constructor(
        public readonly id: number,
        public name: string,
    ) {}

    scream(){
        console.log(`Este es un nuevo pokemon asustado!!`);
    }

    speak(){
        console.log(`El pokemon no quiere hablar!`);
    }
}

const MyDecorator = () => {
    return (target: Function) => {
        // console.log(target);
        return NewPokemon;
    }
}

@MyDecorator()

export class Pokemon {
    constructor(
        public readonly id: number,
        public name: string,
    ) {}

    scream(){
        console.log(`${this.name.toUpperCase()}!!`);
    }

    speak(){
        console.log(`${this.name}, ${this.name}!`);
    }
}

export const charmander = new Pokemon(4, 'Charmander');

charmander.scream();
charmander.speak();