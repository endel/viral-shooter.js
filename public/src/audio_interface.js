var AudioInterface = (function() {

  var
    that,
    options,
    callbacks = {},
    fft = document.getElementById( 'fft' ),
    fftCtx = fft.getContext( '2d' ),
    waveform = document.getElementById( 'waveform' ),
    waveformCtx = waveform.getContext( '2d' ),
    dancer, kicks, off_kicks,
    kick_interval = null,
    canKick = true,
    load,

    AudioInterface = function(o) {
      that = this;
      callbacks.start = o.start;
      callbacks.kick = o.kick;
      callbacks.kickOff = o.kickOff;

      this.load = load;
    };


  load = function(options) {
    if (!options.threshold) {
      options.threshold = 0.2;
    }
    console.log("Using threshold: ", options.threshold)

    /*
     * Dancer.js magic
     */
    Dancer.setOptions({
      flashSWF : '/lib/soundmanager2.swf',
      flashJS  : '/lib/soundmanager2.js'
    });

    dancer = new Dancer();
    kicks = dancer.createKick({
      threshold: options.threshold,
      onKick: function () {
        if (canKick) {
          if (callbacks.kick) {
            callbacks.kick.apply(dancer);
          }

          // Dissalow kicks for 80ms
          canKick = false;
          setTimeout(function() {
            canKick = true;
          }, 80);
        }
        fftCtx.fillStyle = '#ff0077';
      },
      offKick: function () {
        fftCtx.fillStyle = '#666';
      }
    }).on();

    off_kicks = dancer.createKick({
      threshold: options.threshold,
      onKick: function () {
        if (callbacks.kickOff) {
          callbacks.kickOff.apply(dancer);
        }
      }
    }).on();

    dancer
      .fft( fft, { fillStyle: '#666' })
      .waveform( waveform, { strokeStyle: '#666'}) //, strokeWidth: 2
      .load({ src: options.file, codecs: [ 'mp3' ]}); // 'ogg',

    Dancer.isSupported() || loaded();
    !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

    /*
     * OnLoad binding
     */
    function loaded () {
      var
        loading = $('#loading'),
        anchor  = document.createElement('A'),
        supported = Dancer.isSupported();

      anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
      anchor.setAttribute( 'href', '#' );
      $(loading).html('').append( anchor );

      if ( !supported ) {
        var p = $('<p>Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!</p>');
        $(loading).append( p );
      }

      $(anchor).click(function () {
        if (callbacks.start) {
          callbacks.start.apply(dancer);
        }
        dancer.play();
        $(loading).fadeOut();
      });
    }

    // For debugging
    window.dancer = dancer;
    return that;
  };

  // Return AudioInterface constructor
  return AudioInterface;
})();
