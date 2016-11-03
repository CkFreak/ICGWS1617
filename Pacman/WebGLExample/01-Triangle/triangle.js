var gl;

window.onload = function init()
{
	// Get canvas and setup WebGL
    var array2 =  new Float32Array(drawPacman(8,90,10));
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
        return (angle * Math.PI / 180);
    }


    function drawPacman(vertices, angle, radius)
    {
        var rad = 0.1* radius;
        var deletevertices = toRadians(angle * 2.1);
        var winkelEck = toRadians(360 /vertices );
        if (vertices >= 26)
            {
                var anfangsK = (winkelEck / 2) +  toRadians(angle /2);
            }
        else
            {
                var anfangsK = (winkelEck /2);
            }

        var array =[0,0];
        var entfTri = 0;
        var hilfsvar = toRadians(angle);
        while (hilfsvar >= winkelEck)
            {
                hilfsvar = hilfsvar - winkelEck;
                entfTri++;
            }
        for (var i = 0; i<= (vertices - entfTri); i++)
            {
                array.push(rad * (Math.cos(winkelEck *i + anfangsK )));
                array.push(rad * (Math.sin(winkelEck * i + anfangsK)));
            }


        console.log(entfTri)
        return array;
    }

    function drawColor(vertices)
    {
        var colors =[];
        for (var i = 0; i < (vertices); i++)
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

function generateCustomPacman()
{
  var vertices = document.getElementById("numberOfVertices").value;
  var angle = document.getElementById("angle").value;
  var radius = document.getElementById("radius").value;

  drawPacman(vertices, angle, radius);
}