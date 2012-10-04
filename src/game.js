//var camera, scene, renderer;
//var geometry, material, mesh;

//init();
//animate();

//function init() {

    //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    //camera.position.z = 1000;

    //scene = new THREE.Scene();

    //geometry = new THREE.CubeGeometry( 200, 200, 200 );
    //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    //mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );

    //renderer = new THREE.CanvasRenderer();
    //renderer.setSize( window.innerWidth, window.innerHeight );

    //document.body.appendChild( renderer.domElement );

//}

//function animate() {

    //// note: three.js includes requestAnimationFrame shim
    //requestAnimationFrame( animate );

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    //renderer.render( scene, camera );

//}

console.log("Hey!");

(function () {

  var
    AUDIO_FILE = 'sounds/19092_psy_-_gangnam_style_koreyskiy_hardbas.mp3',
    fft = document.getElementById( 'fft' ),
    ctx = fft.getContext( '2d' ),
    dancer, kick;

  /*
   * Dancer.js magic
   */
  Dancer.setOptions({
    flashSWF : '/lib/soundmanager2.swf',
    flashJS  : '/lib/soundmanager2.js'
  });

  dancer = new Dancer();
  kick = dancer.createKick({
    onKick: function () {
      ctx.fillStyle = '#ff0077';
    },
    offKick: function () {
      ctx.fillStyle = '#666';
    }
  }).on();

  dancer
    .fft( fft, { fillStyle: '#666' })
    .load({ src: AUDIO_FILE, codecs: [ 'mp3' ]}); // 'ogg',

  Dancer.isSupported() || loaded();
  !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

  /*
   * Loading
   */

  function loaded () {
    var
      loading = document.getElementById( 'loading' ),
      anchor  = document.createElement('A'),
      supported = Dancer.isSupported(),
      p;

    anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
    anchor.setAttribute( 'href', '#' );
    loading.innerHTML = '';
    loading.appendChild( anchor );

    if ( !supported ) {
      p = document.createElement('P');
      p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
      loading.appendChild( p );
    }

    anchor.addEventListener( 'click', function () {
      dancer.play();
      document.getElementById('loading').style.display = 'none';
    });
  }

  // For debugging
  window.dancer = dancer;

})();
