var gl;

window.onload = function init()
{
	// Get canvas and setup WebGL

	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	/*
	var vertices = new Float32Array([	-1, -1,
										0, 1,
										1, -1]);
	var colors = new Float32Array([ 1, 0, 0, 1,
									1, 1, 0, 1,
									0, 0, 1, 1,]);
	*/
	//TODO: Methodenaufrufe die vertices und color Werte zuweisen
  //var vertices = new Float32Array([]);
	//var colors = new Float32Array([])
	// Configure viewport

	function getVertices(){
		return new Float32Array([ 1, 0, 0, 1,
			1, 1, 0, 1,
			0, 0, 1, 1,]);

		}

		function getColors(){
			return new Float32Array([ 1, 0, 0, 1,
				1, 1, 0, 1,
				0, 0, 1, 1,]);
			}

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load positions into the GPU and associate shader variables
  //TODO: Zugriff auf Methode, die vertices verändert oder returnt
	var posVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posVBO);
	gl.bufferData(gl.ARRAY_BUFFER, vertices = getVertices(), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables
  //TODO: Zugriff auf Methode, die colors verändert oder returnt
	var colorVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
	gl.bufferData(gl.ARRAY_BUFFER, color = getColors(), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	render();
};

//TODO: Anzahl der Vertices durch Variable ersetzen
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES_FAN, 0, 3);
}

//TODO: Hilfsfunktionen, die Arrays returnen oder verändern
