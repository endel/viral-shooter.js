var AudioInterface = (function() {
  var
    AUDIO_FILE = 'sounds/MC_Hammer_-_U_Cant_Touch_This',
    //AUDIO_FILE = 'sounds/RickRoll',
    //AUDIO_FILE = 'sounds/01_friday',
    //AUDIO_FILE = 'sounds/19092_psy_-_gangnam_style_koreyskiy_hardbas',
    //AUDIO_FILE = 'sounds/nyan2',
    fft = document.getElementById( 'fft' ),
    fftCtx = fft.getContext( '2d' ),
    waveform = document.getElementById( 'waveform' ),
    waveformCtx = waveform.getContext( '2d' ),
    dancer, kicks, off_kicks,
    kick_interval = null,
    canKick = true;

  /*
   * Dancer.js magic
   */
  Dancer.setOptions({
    flashSWF : '/lib/soundmanager2.swf',
    flashJS  : '/lib/soundmanager2.js'
  });

  dancer = new Dancer();
  kicks = dancer.createKick({
    //frequency: [0, 10],
    threshold: 0.2,
    //decay:     0.02,
    onKick: function () {
      if (canKick) {
        //console.log("Kick!");
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
    //frequency: [0, 5],
    threshold: 0.2,
    //decay:     0.05,
    onKick: function () {
      console.log("Off kick!");
    }
  }).on();

  dancer
    .fft( fft, { fillStyle: '#666' })
    .waveform( waveform, { strokeStyle: '#666'}) //, strokeWidth: 2
    .load({ src: AUDIO_FILE, codecs: [ 'mp3' ]}); // 'ogg',

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
    loading.innerHTML = '';
    $(loading).append( anchor );

    if ( !supported ) {
      var p = $('<p>Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!</p>');
      $(loading).append( p );
    }

    $(anchor).click(function () {
      dancer.play();
      $(loading).remove();
    });
  }

  // For debugging
  window.dancer = dancer;

  //var AudioInterface = function(options) {
  //};
  //return AudioInterface;
})();
