(function () {
  'use strict';

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    angular
      .module('virtualRepeatVerticalDemo', ['ngMaterial'])
      .controller('AppCtrl', function() {
        this.items = [];

        for (var i = 1; i < 100; i++) {
            var heights =  40;
            if((i%8) == 0 ){
                heights = 90;
            }
          this.items.push({'name':i,'height':heights});


        }
      });

})();
