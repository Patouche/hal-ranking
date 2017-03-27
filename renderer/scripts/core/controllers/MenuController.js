(function () {

    'use strict';

    /** App import definition.*/
    angular.module('app.core').controller('MenuController', ['configService', MenuController]);

    /**
     * Class constructor.
     *
     * @param configService
     * @constructor
     */
    function MenuController(configService) {
        var vm = this;

        // Variables
        vm.open = isOpen();
        vm.toggleMenu = () => {
            window.localStorage.setItem('menu_open', !vm.open);
            vm.open = isOpen();
        };

        function isOpen() {
            var s = window.localStorage.getItem('menu_open');
            console.log('Is open :', s);
            return (s !== undefined) ? JSON.parse(s) : true;
        }

    }
})();
