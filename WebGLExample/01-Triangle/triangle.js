var gl;

window.onload = function init()
{
	// Get canvas and setup WebGL    
    var array2 =  new Float32Array(drawPacman(8,25,10));
    var colors = new Float32Array(drawColor(array2.length / 2));
    
    console.log(array2.length)
    console.log(array2)
    console.log(colors.length)
    console.log(colors)
    

	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
    function toRadians(angle)
    {
        return angle * (180 * Math.PI);
    }
    function drawPacman(vertices, angle, radius)
    {
        var rad = 0.1* radius;
        var aK = -1 * (angle / 2);
        var winkelEck = (360 / vertices);
        var array =[0,0];
        for (var i = 0; i< (vertices -1 ); i++)
            {
                array.push(rad * (Math.cos((winkelEck * i) + aK))); 
                array.push(rad * (Math.sin((winkelEck * i) + aK)));
            }
        
        return array;
    }
    
    function drawColor(vertices)
    {
        var colors =[1,1,0,1];
        for (var i = 0; i < (vertices -1); i++)
            {
                colors.push(1,1,0,1);
            }
        return colors;
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
	gl.bufferData(gl.ARRAY_BUFFER, array2, gl.STATIC_DRAW);

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

	render((array2.length / 2));
};

function render(lengths)
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, lengths);
}
