import axios from 'axios';
export class Pokemon {
    // public id: number;
    // public name: string;

    // constructor(id: number, name: string){
    //     this.id = id;
    //     this.name = name;
    //     console.log('constructor llamado');
    // }
    // Es lo mismo que

    get imageURL(): string {
        return `https://pokemon.com/${ this.id }.jpg`;
    }

    constructor(
        public readonly id: number,
        public name: string,
        // public imageURL: string
    ){
        console.log('constructor llamado');
    }

    scream(){
        console.log(`${ this.name.toUpperCase() }!!!`);
    }

    speak(){
        console.log(`${ this.name }, ${ this.name }`);
    }

    async getMoves(){
        // return 10;
        // const moves = 10;
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/4');
        console.log(data.moves);
        // return resp;
        return data.moves;
    }
}

export const charmander = new Pokemon(4, 'Charmander');

// charmander.id = 10;
// charmander.name = 'Mew';
// console.log(charmander.imageURL);

// charmander.scream();
// charmander.speak();

// console.log(charmander.getMoves());
charmander.getMoves();