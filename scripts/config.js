requirejs.config({
    // Add this map config in addition to any baseUrl or
    // paths config you may already have in the project.
    baseUrl: "scripts",

    paths: {
        //jquery: ["https://code.jquery.com/jquery-3.5.1.min"],
        EasyQueryMaker:['EasyQueryMaker']
    },

    /* map: {
        // '*' means all modules will get 'jquery-private'
        // for their 'jquery' dependency.
        '*': { 'jquery': 'jquery-private' },
        // 'jquery-private' wants the real jQuery module
        // though. If this line was not here, there would
        // be an unresolvable cyclic dependency.
        'jquery-private': ["https://code.jquery.com/jquery-3.5.1.min.js"]
    } */

});

// and the 'jquery-private' module, in the
// jquery-private.js file:
/* define(['jquery'], function (jq) {
    return jq.noConflict(true);
}); */