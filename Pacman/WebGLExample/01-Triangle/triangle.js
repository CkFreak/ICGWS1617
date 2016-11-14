var gl;

//damit man vertices.length / 2 in render benutzen kann.
var vertices =[0,0];

window.onload = function init(noV, angle, radius)
{
    // Get canvas and setup WebGL
  var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  // Erzeugen der Arrays
  var colors = [];
  var rotation;
  var translation;

  // Funktion um Winkel in Grad zu Radianten umzuwandeln
  function toRadians(angle)
  {
      return (angle * Math.PI / 180);
  }

  // füllt die Vertices und Color Arrays mit Koordinaten bzw. Werten.
  function getVertices(noV, angle, radius)
  {
      // damit man einen Radius zwischen 1 und 10 angeben kann.
      var rad = 0.1* radius;
      var winkelEck = toRadians(360 / noV);
      var newangle = toRadians(angle) / winkelEck;

      //Vertices mit Koordinaten befüllen
      for (var i = 0; i<= (noV - newangle); i++)
          {
              vertices.push(rad * (Math.cos((i + newangle / 2) * winkelEck)));
              vertices.push(rad * (Math.sin((i + newangle / 2) * winkelEck)));
          }

      //colors mit Farbe füllen
      for (var i = 0; i < (vertices.length / 2); i++)
          {
              colors.push(1,1,0,1);
          }
  }

  function setTranslation(x,y)
  {
       translation =   [1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        x, y, 0, 1];
  }

  function setRotation(angle)
  {
      rotation = [Math.cos(toRadians(angle)), Math.sin(toRadians(angle)),     0, 0,
                 -1 * Math.sin(toRadians(angle)), Math.cos(toRadians(angle)), 0, 0,
                  0,                               0,                         1, 0,
                  0,                               0,                         0, 1];
  }

  var x = 0;
  var y = 0;
  var abstand = radius / 10;
  function setMoveVec(angle)
  {
		var xx = Math.cos(toRadians(angle)) * 0.1;
		var yy = Math.sin(toRadians(angle)) * 0.1;
		x += xx;
    y += yy

    //Bedingung damit sich Pacman bewegt bzw. nicht den Canvas verlässt.
    if(x < 1 - abstand && x > -1 + abstand && y < 1 - abstand && y > -1 + abstand)
    {
      setTranslation(x, y);
    }
		else
    {
  	  x -= xx;
  	  y -= yy;
    }


	}

  getVertices(noV, angle, radius);
  setTranslation(0,0);
  setRotation(0);

  var floatvertices = new Float32Array(vertices);
  var floatcolors = new Float32Array(colors);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load positions into the GPU and associate shader variables

	var posVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posVBO);
	gl.bufferData(gl.ARRAY_BUFFER, floatvertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

  var rC = 0;
  document.onkeydown = function(e)
  {
	   var key = e.keyCode;
     //console.log(key)

		if(key == 39)
		{
			setRotation(rC-= 10);
		}
		else if (key == 37)
    {
      setRotation(rC+= 10);
		}
		else if(key == 38)
    {
	    setMoveVec(rC);
		}
    //console.log(rC)

		var rotationLoc = gl.getUniformLocation(program, "rotaLoc");
		gl.uniformMatrix4fv(rotationLoc, false, rotation);

		var translationLoc = gl.getUniformLocation(program, "transLoc");
		gl.uniformMatrix4fv(translationLoc, false, translation);
	}

  var transLoc = gl.getUniformLocation(program, "transLoc");
  gl.uniformMatrix4fv(transLoc, false, translation);

  var rotaLoc = gl.getUniformLocation(program, "rotaLoc");
  gl.uniformMatrix4fv(rotaLoc,false, rotation);

	// Load colors into the GPU and associate shader variables

	var colorVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
	gl.bufferData(gl.ARRAY_BUFFER, floatcolors, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);


  // erzeugt einen Pacman über eine Eingabe und Button.
  generateCustomPacman = function ()
  {
    var vertices2 = document.getElementById("numberOfVertices").value;
    var angle = document.getElementById("angle").value;
    var radius = document.getElementById("radius").value;

    vertices = [0,0];
    colors = [];
    init(vertices2, angle, radius);
    render();
  }
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
  requestAnimFrame(render);
}
