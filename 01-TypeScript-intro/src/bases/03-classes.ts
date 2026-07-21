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
}

export const charmander = new Pokemon(4, 'Charmander');

// charmander.id = 10;
// charmander.name = 'Mew';
console.log(charmander.imageURL);

charmander.scream();
charmander.speak();