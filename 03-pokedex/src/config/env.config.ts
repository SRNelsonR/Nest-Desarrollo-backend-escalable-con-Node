export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || '3002',
    defaultLimit: +process.env.DEFAULT_LIMIT! || '7'
});

// Lo de arriba es lo mismo que esto
// const envFn = () => {
//     return {

//     };
// }