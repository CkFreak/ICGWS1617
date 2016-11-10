var gl;

window.onload = function init()
{

	// Get canvas and setup WebGL

	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices

	var vertices = new Float32Array(getVertices(5, 360, 75));
	var colors = new Float32Array(getColors(vertices.length / 2));

	function toRadians(angle){
		return (angle * Math.PI / 180);
	}

	/**
	*	Gibt das Vertices-Array zurück und nimmt dafür die
	* Anzahl der Vertices, den Winkel und die Größe des Pacmans entgegen.
	*/
	function getVertices(radius, numberOfVertices, mouthAngle){
		var verticesArray = [0,0];

		var vangle = toRadians(360 / numberOfVertices);
		var mouth = toRadians(mouthAngle) / vangle;

		var rad = (radius % 10) / 10;

		for(var i = 0; i <= numberOfVertices - mouth; i++){
			verticesArray.push(rad * (Math.cos((i + mouth/2) * vangle)));
			verticesArray.push(rad * (Math.sin((i + mouth/2) * vangle)));
		}
		return verticesArray;

	}

	function getColors(number){
		var colorArray = [];

		for(var i = 0; i < number; i++){
			colorArray.push(0.5, 1, 0.25, 1);
		}

		return colorArray;
	}


	// Configure viewport
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load positions into the GPU and associate shader variables
	var posVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posVBO);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables
	var colorVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	render(vertices.length / 2);
};

function render(length)
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, length);
}
