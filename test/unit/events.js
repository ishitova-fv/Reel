/**
 * .reel Unit Tests
 */
(function($){

  module('Events', reel_test_module_routine);

  asyncTest( 'Internal data setting triggers "store" event and passes name and value to the handler', function(){
    expect(3);
    var
      $reel= $('#image').reel({ frame: 1, speed: 1 }),
      compare= false

    $reel
      .bind('loaded.test', function(){
        setTimeout(function(){
          compare= true;
        }, 500);
      })
      .bind('store.test', function(e, name, value){
        if (compare && name == 'frame'){
          ok(name, '`name` is passed as first param');
          ok(value, '`value` is passed as second param');
          ok(value != 1, 'Frame passed in "store" binding differs from original frame 1');
          compare= false;
          start();
        }
      })
  });

  asyncTest( 'Internal data getting triggers "recall" event and passes name of the value in question', function(){
    expect(3);
    var
      $reel= $('#image').reel(),
      compare= false

    $reel
      .bind('loaded.test', function(){
        setTimeout(function(){
          compare= true;
        }, 500);
      })
      .bind('recall.test', function(e, name, value){
        if (compare){
          ok(true, '"recall" event is being triggered');
          ok(name, '`name` is passed as first param');
          ok(typeof value != 'undefined', '`value` is passed as second param');
          compare= false;
          start();
        }
      })
  });

  asyncTest( '`"openingDone"` event is triggered at the end of opening animation', function(){
    expect(2);
    var
      $reel= $('#image').reel({
        opening: 1
      })

    $reel
      .bind('openingDone.test', function(){
        ok( true, '`"openingDone"` has been triggered');
      })
      .bind('play.test', function(){
        ok( true, '`"play" event has fired closely following the `"openingDone"`');
        start();
      })
  });

  asyncTest( 'Default handling of `"openingDone"` event is cancelable by returning false from the handler', function(){
    expect(2);
    var
      $reel= $('#image').reel({
        opening: 1
      })

    $reel
      .bind('openingDone.test', function(){
        ok( true, '`"openingDone"` has been triggered and set to prevent event bubbling');
        setTimeout(function(){
          ok( true, 'The cancelled `"play"` correctly didn\'t fire (waited for it half a second)');
          start();
        }, 500);
        return false
      })
      .bind('play.test', function(){
        start();
      })
  });

  asyncTest( '`"play"` event starts to animate when `speed` option is set', function(){
    expect(2);
    var
      speed= 0.5,
      $reel= $('#image').reel({
        speed: speed
      })

    $reel
      .bind('openingDone.test', function(){
        setTimeout(function(){
          $reel.trigger('play');
        }, 50);
        setTimeout(function(){
          equal( $reel.data('playing'), true, 'Instance played with non-zero `speed` parameter starts to play');
          equal( $reel.data('speed'), speed, 'Stored internal speed value');
          start();
        }, 100);
      });
  });

  asyncTest( '`"play"` event has no effect, when no `speed` option was specified or is zero', function(){
    expect(2);
    var
      $reel= $('#image').reel()

    $reel
      .bind('openingDone.test', function(){
        setTimeout(function(){
          $reel.trigger('play');
        }, 50);
        setTimeout(function(){
          equal( $reel.data('playing'), false, 'Instance played with non-zero `speed` parameter starts to play');
          equal( $reel.data('speed'), 0, 'Stored internal speed value');
          start();
        }, 100);
      });
  });

  asyncTest( '`"play"` event accepts optional `speed` parameter, which overrides the one specified in options', function(){
    expect(4);
    var
      initial_speed= 0,
      new_speed= 1.23,
      $reel= $('#image').reel({
        speed: initial_speed // which is also the default value
      })

    $reel
      .bind('openingDone.test', function(){
        setTimeout(function(){
          equal( $reel.data('playing'), false, 'Instance initiated with `speed: 0` is not playing');
          equal( $reel.data('speed'), initial_speed, 'Stored internal speed value');
          $reel.trigger('play', [ new_speed ]);
        }, 50);
        setTimeout(function(){
          equal( $reel.data('playing'), true, 'Instance played with non-zero `speed` parameter starts to play');
          equal( $reel.data('speed'), new_speed, 'Stored internal speed value');
          start();
        }, 100);
      });
  });

})(jQuery);
