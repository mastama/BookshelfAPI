const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.Server({
        port: 9000,
        host: 'localhost',
    });

    // call routes

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();