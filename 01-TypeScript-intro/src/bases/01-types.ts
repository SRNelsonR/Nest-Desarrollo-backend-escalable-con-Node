export let name: string = 'Oscar';
export const age: number = 31;
export const isValid: boolean = true;

name = 'Maria';
// name = 123;
// name = true;
// console.log({isValid});

export const templateString = `Esto es un string
multilinea
que puede tener
" dobles
' simple
inyectar valores ${ name }
expresiones ${ 1 + 1 }
números: ${ age }
booleanos: ${ isValid }
`

console.log(templateString);