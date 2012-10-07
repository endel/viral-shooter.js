var Game = (function() {
  var
    // Window
    WIDTH, HEIGHT,

    // Controllers
    audio, mouse = {x: 0, y: 0},

    // Renderer
    clock, controls, camera, scene, renderer, projector,

    // Game callbacks
    startGame, createEnemy, createAlly,

    // Game elements
    objects = [],

    // Game controller
    Game = function(options) {
      $(document).resize(function() {
        WIDTH = $(this).width();
        HEIGHT = $(this).height();
      }).resize();
      audio = new AudioInterface({
        start: startGame,
        kick: createEnemy,
        kickOff: createAlly
      })
      .load({file: 'sounds/MC_Hammer_-_U_Cant_Touch_This', threshold: 0.3});
      //.load({file: 'sounds/RickRoll', threshold: 0.1});
      //.load({file: 'sounds/09.All.Falls.Down', threshold: 0.31});
      //.load({file: 'sounds/01_friday'});
      //.load({file: 'sounds/19092_psy_-_gangnam_style_koreyskiy_hardbas', threshold: 0.28});
      //.load({file: 'sounds/nyan2', threshold: 0.22});
    };

  startGame = function() {
    $('h1').fadeOut();
    $('body').animate({backgroundColor: "#2c1e1e"}, 1000);
    Rendering.init();
    animate();
  };

  createEnemy = function() {
    Rendering.createSphere();
  };

  createAlly = function() {
  };

  var onDocumentMouseDown = function( event ) {
    event.preventDefault();

    var vector = new THREE.Vector3(
      ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5
    );
    projector.unprojectVector( vector, camera );

    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    var intersects = ray.intersectObjects( objects );

    if ( intersects.length > 0 ) {
      console.log(intersects[ 0 ]);

      //var particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( {
        //color: 0x000000,
        //program: function ( context ) {
          //context.beginPath();
          //context.arc( 0, 0, 1, 0, PI2, true );
          //context.closePath();
          //context.fill();
        //}
      //} ) );
      //particle.position = intersects[ 0 ].point;
      //particle.scale.x = particle.scale.y = 8;
      //scene.add( particle );
    }

    /*
    // Parse all the faces
    for ( var i in intersects ) {
    intersects[ i ].face.material[ 0 ].color
    .setHex( Math.random() * 0xffffff | 0x80000000 );
    }
    */
  }

  var Rendering = {
    init: function(){
      // usado no render para controlar a atualização
      clock = new THREE.Clock();

      // seta alguns atributos da camera
      var
        VIEW_ANGLE = 45,
        ASPECT = WIDTH/HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

      // get the DOM element to attach to
      // - assume we've got jQuery to hand
      var $container = $('#game');

      //cria um renderizador WebGL, camera e cena
      projector = new THREE.Projector();
      renderer = new THREE.WebGLRenderer();
      camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      window.scene = scene = new THREE.Scene();

      //posiciona a camera na posição 300 colocando-a para trás
      camera.position.z = 0;
      camera.position.x = 0;
      camera.position.y = 0;

      //inicializa o renderizador
      renderer.setSize(WIDTH,HEIGHT);

      //liga o renderer criado ao elemento DOM
      $container.append(renderer.domElement);

      // Track mouse position so we know where to shoot
      document.addEventListener( 'mousemove', onDocumentMouseMove, false );

      //captura o click do mouse
      document.addEventListener('mouseclick', onMouseClick, false);

      controls = new THREE.FirstPersonControls(camera);
      controls.movementSpeed = 200;
      controls.lookSpeed = 0.0075;
      controls.loofVertical = false;
      controls.noFly = true;
      controls.activeLook = false;

      Rendering.createSphere();

      document.addEventListener( 'mousedown', onDocumentMouseDown, false );

      //cria um ponto de luz
      //var pointLight = new THREE.PointLight(0xFFFFFF);
      var ambientLight = new THREE.AmbientLight(0xFFFFFF);

      //seta suas posições
      //pointLight.position.x = 100;
      //pointLight.position.y = 800;
      //pointLight.position.z = 130;

      //adiciona a camera para a cena
      scene.add(camera);
      //adiciona as luzes na cena
      //scene.add(pointLight);
      scene.add(ambientLight);

       //// add directional light source
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);

      //desenha na tela
      // renderer.render(scene,camera);
    },

    createSphere: function(x, y){
      if (!x || !y) {
        x = 0;
        y = 0;
      }
      var
        // seta as variaveis de controle da esfera
        radius = 60,
        segments = 16,
        rings = 16
        // cria o material da esfera
        sphereMaterial = new THREE.MeshPhongMaterial({color: 0x33382b}),
        sphere = new THREE.Mesh( new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);

      sphere.position.z = camera.position.z + (Math.random() * 1000 * (Math.random() < 0.5 ? -1 : 1));
      sphere.position.x = camera.position.x + 10000;
      sphere.position.y = camera.position.y + (Math.random() * 1000 * (Math.random() < 0.5 ? -1 : 1)); // + 300;

      scene.add(sphere);
    }
  }

  // Helper function for browser frames
  function animate() {
    requestAnimationFrame(animate);
    render();
  }


  //renderiza e atualiza a tela
  function render(){
    // console.log(camera.position.z + " " + camera.position.x);
    controls.update(clock.getDelta()); // Move camera

    camera.position.x += 50;

    for (var i=0;i<objects.length;i++) {
      //objects[i].position.x += -50;

      if(objects[i].position.x < camera.position.x) {
        objects.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / WIDTH) * 2 - 1;
    mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
  }

  function onMouseClick(e){
    e.preventDefault();
  }

  return Game;
})();

var game = new Game();
