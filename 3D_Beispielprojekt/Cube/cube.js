var gl;
var canvas;
var eye;
var target;
var up;

var angleLog = 0; // Speichert den aktuellen Winkel
var angleR; 
var positions;
var colors;
var normals;

var positionBuffer;
var colorBuffer;
var normalsBuffer;
var normal;

var modelMatrixLoc;
var modelMatrixLoc2;
var boden;
var cube;
var cube2;

var viewMatrixLoc;
var viewMatrix;

var projectionMatrixLoc;
var projectionMatrix;

//Cube Faces 
var frontFace = [                   -0.5, -0.5,  0.5,
								     0.5, -0.5,  0.5,
								     0.5,  0.5,  0.5,
										
									 0.5,  0.5,  0.5,
									-0.5,  0.5,  0.5,
									-0.5, -0.5,  0.5];

var rightFace = [                    0.5,  0.5,  0.5,
									 0.5, -0.5,  0.5,
									 0.5, -0.5, -0.5,
										
									 0.5, -0.5, -0.5,
									 0.5,  0.5, -0.5,
									 0.5,  0.5,  0.5];

var backFace = [                    -0.5, -0.5, -0.5,
									 0.5, -0.5, -0.5,
									 0.5,  0.5, -0.5,
										
									 0.5,  0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5, -0.5, -0.5];

var leftFace = [                    -0.5,  0.5,  0.5,
									-0.5, -0.5,  0.5,
									-0.5, -0.5, -0.5,
										
									-0.5, -0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5,  0.5,  0.5];

var bottomFace = [                  -0.5, -0.5,  0.5,
									 0.5, -0.5,  0.5,
									 0.5, -0.5, -0.5,
										
									 0.5, -0.5, -0.5,
									-0.5, -0.5, -0.5,
									-0.5, -0.5,  0.5];

var topFace = [                     -0.5,  0.5,  0.5,
									 0.5,  0.5,  0.5,
									 0.5,  0.5, -0.5,
										
									 0.5,  0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5,  0.5,  0.5];

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
    
    //setzt die größe des Canvas / viewports auf Fenster Größe (nur zu Testzwecken)
    canvas.width = document.body.clientWidth;
    canvas.heigth = document.body.clientHeight;
    
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	
									 // Front
	positions = new Float32Array([  -0.5, -0.5,  0.5,
								     0.5, -0.5,  0.5,
								     0.5,  0.5,  0.5,
										
									 0.5,  0.5,  0.5,
									-0.5,  0.5,  0.5,
									-0.5, -0.5,  0.5,
										
									 // Right
									 0.5,  0.5,  0.5,
									 0.5, -0.5,  0.5,
									 0.5, -0.5, -0.5,
										
									 0.5, -0.5, -0.5,
									 0.5,  0.5, -0.5,
									 0.5,  0.5,  0.5,
										
									 // Back
									-0.5, -0.5, -0.5,
									 0.5, -0.5, -0.5,
									 0.5,  0.5, -0.5,
										
									 0.5,  0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5, -0.5, -0.5,
										
									 // Left
									-0.5,  0.5,  0.5,
									-0.5, -0.5,  0.5,
									-0.5, -0.5, -0.5,
										
									-0.5, -0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5,  0.5,  0.5,
										
									 // Bottom
									-0.5, -0.5,  0.5,
									 0.5, -0.5,  0.5,
									 0.5, -0.5, -0.5,
										
									 0.5, -0.5, -0.5,
									-0.5, -0.5, -0.5,
									-0.5, -0.5,  0.5,
										
									 // Top
									-0.5,  0.5,  0.5,
									 0.5,  0.5,  0.5,
									 0.5,  0.5, -0.5,
										
									 0.5,  0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5,  0.5,  0.5
								]); 
										
									// Front
	colors = new Float32Array([     0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									
									// Right
									0, 1, 0, 1, 
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									
									// Back
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									
									// Left
									1, 1, 0, 1, 
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									
									// Bottom
									1, 0, 1, 1, 
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									
									// Top
									0, 1, 1, 1, 
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1
								]);
// TO - DO Normalen definieren.
    normals = new Float32Array([]);
    
    // rechnet Winkel in Radianten um
    function toRadians(angle)
  {
      return (angle * Math.PI / 180);
  }
   

	// Configure viewport

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

    // Load positions into the GPU and associate shader variables

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables
	
	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
    
    // Load normals into the GPU and associate shader variables
    
    generateAllNormals();
        console.log(normals);
    
    var normalsBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
	// Set model matrix für die Objekte
	
	cube = new Float32Array([1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0.6, 0, 0, 1]);
    
    cube2 = new Float32Array([1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									-0.6, 0, 0, 1]);
    
    boden = new Float32Array([1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, -1, 0, 1]);
    
    // macht aus einem Cube den Boden via scale
    boden = mat4.scale(boden, boden, vec3.fromValues(3.0, 0.01, 3.0));
	
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");

    // Set view matrix

	eye = vec3.fromValues(0.0, 0.0, 5.0);
	target = vec3.fromValues(0.0, 0.0, 0.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    // Set projection matrix

	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.5, 100);

	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
    
    // Bewegung durch WASD
    document.onkeydown = function (e)
    {
        var key = e.keyCode;
        
        // 0.2 ist die Geschwindigkeitsskalierungsvariable
        var sinx = Math.sin(toRadians(angleLog)) * 0.2; 
        var cosx = Math.cos(toRadians(angleLog)) * 0.2;
        switch (key)
        {
            //Translation vor und zurück in Abhängigkeit zu den Winkeln, quasi wie bei Pacman.
            case 87:
                eye[0] -= sinx; 
                eye[2] -= cosx;
                target[0] -= sinx;
                target[2] -= cosx;
                break;
                
            case 83:
                eye[0] += sinx;
                eye[2] += cosx;
                target[0] += sinx;
                target[2] += cosx;
                break;
            
            // Translation links rechts in Abhängigkeit der Winkel, habs durch ausprobieren herausgefunden. FRAGT NICHT WARUM AMK!    
            case 65:
                eye[0] -= cosx;
                eye[2] += sinx;
                target[0] -= cosx;
                target[2] += sinx;
                
                break;
                
            case 68:
                eye[0] += cosx;
                eye[2] -= sinx;
                target[0] += cosx;
                target[2] -= sinx;
                break;
        }
    }
    
    // linke Maustaste addiert je nach Position im Canvas (links oder rechts) einen Winkel.
    document.onmousedown = function (e)
    {
        
        if (e.clientX > canvas.width / 2)
        {
                angleR = 0;
                angleR -= 10;
        }
        else if (e.clientY < canvas.width / 2)
        {
                angleR = 0;
                angleR = 10;         
        }
        
        //die eigentliche Rotation
        rotateCam(angleR);     
    }
    
    // http://glmatrix.net/docs/vec3.js.html#line629    -> rotiert um Y Achse: Parameter (output, input, mittelpunkt, angle)!
    function rotateCam(angle)
    {
        angleLog += angle;
        var angles = toRadians(angle);
        vec3.rotateY(target, target, eye, angles);
    }
        
    
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.lookAt(viewMatrix, eye, target, up);
    
    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc, false, cube);
    
	gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
    gl.uniformMatrix4fv(modelMatrixLoc, false, cube2);
    
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
    
    gl.uniformMatrix4fv(modelMatrixLoc, false, boden);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
    
	requestAnimFrame(render);
}

function calculateNormalVector(positionVertices)
{
    var x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4;
    
    x1 = positionVertices[0];
    y1 = positionVertices[1];
    z1 = positionVertices[2];
    x2 = positionVertices[3];
    y2 = positionVertices[4];
    z2 = positionVertices[5];
    x3 = positionVertices[6];
    y3 = positionVertices[7];
    z3 = positionVertices[8];
    x4 = positionVertices[12];
    y4 = positionVertices[13];
    z4 = positionVertices[14];
    
    var firstVector = vec3.fromValues((x2-x1), (y2-y1), (z2-z1));
    var secondVector = vec3.fromValues((x4-x1), (y4-y1), (z4-z1));
    
    var normalVector =
        vec3.fromValues((y2-y1)*(z4-z1)-(z2-z1)*(y4-y1), -(x2-x1)*(z4-z1)+(z2-z1)*(x4-x1), (x2-x1)*(y4-y1)-(y2-y1)*(x4-x1));
    
    
    return normalVector;
}

function generateAllNormals()
{
    var allFaces = [frontFace, rightFace, backFace, leftFace, bottomFace, topFace];
    var array = [];
    for (var i = 0; i < 6; ++i)
        {
            var a = calculateNormalVector(allFaces[i]);
            for (var j = 0; j < 6 ; ++j)
            {
                array.push(a[0]);
                array.push(a[1]);
                array.push(a[2]);
            }
            
                
        }
    normals = new Float32Array(array);
}