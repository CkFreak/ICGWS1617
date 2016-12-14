var gl;
var canvas;
var program;

var eye;
var target;
var up;

var angleLog = 0; // Speichert den aktuellen Winkel
var positions;
var colors;

var xPosition;
var yPosition;
var _mouseDown = 0;
var _keyPressed = [false, false, false, false]; // Array für die gedrückten Tasten: W A S D

var positionBuffer;
var colorBuffer;
var cubeVerticesNormalBuffer;


var modelMatrixLoc;
var modelMatrixLoc2;
var boden;
var cube;
var cube2;

var viewMatrixLoc;
var viewMatrix;

var projectionMatrixLoc;
var projectionMatrix;

window.onload = function init()
{
	initWebGL(document);
	initListener(document);


	// Specify position and color of the vertices	
									 
	positions = new Float32Array([  
		// Front
		-0.5, -0.5,  0.5,
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
										
									
	colors = new Float32Array([
		// Front
	     0, 0, 1, 1,
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
    
	// Aus den Mozilla-Docs: 
  	var vertexNormals = new Float32Array([
	    // vorne
	     0.0,  0.0,  1.0,
	     0.0,  0.0,  1.0,
	     0.0,  0.0,  1.0,
	     0.0,  0.0,  1.0,
	     0.0,  0.0,  1.0,
	     0.0,  0.0,  1.0,

	     // rechts
	     1.0,  0.0,  0.0,
	     1.0,  0.0,  0.0,
	     1.0,  0.0,  0.0,
	     1.0,  0.0,  0.0,
	     1.0,  0.0,  0.0,
	     1.0,  0.0,  0.0,
	    
	    // hinten
	     0.0,  0.0, -1.0,
	     0.0,  0.0, -1.0,
	     0.0,  0.0, -1.0,
	     0.0,  0.0, -1.0,
	     0.0,  0.0, -1.0,
	     0.0,  0.0, -1.0,
	    
		// links
	    -1.0,  0.0,  0.0,
	    -1.0,  0.0,  0.0,
	    -1.0,  0.0,  0.0,
	    -1.0,  0.0,  0.0,
	    -1.0,  0.0,  0.0,
	    -1.0,  0.0,  0.0,

	    // unten
	     0.0, -1.0,  0.0,
	     0.0, -1.0,  0.0,
	     0.0, -1.0,  0.0,
	     0.0, -1.0,  0.0,
	     0.0, -1.0,  0.0,
	     0.0, -1.0,  0.0,

		// oben
	     0.0,  1.0,  0.0,
	     0.0,  1.0,  0.0,
	     0.0,  1.0,  0.0,
	     0.0,  1.0,  0.0,
	     0.0,  1.0,  0.0,
	     0.0,  1.0,  0.0       
  	]);
  
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

	// Aus den Mozialla-Docs
	cubeVerticesNormalBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);


	var aVertexNormal = gl.getAttribLocation(program, "aVertexNormal");
    gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexNormal);

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
    boden = mat4.scale(boden, boden, vec3.fromValues(3.0, 0, 3.0));
	
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
    
	render();
	
};

// Initiiert WebGL mit dem ganzen Standardkram
function initWebGL(document)
{
	// Get canvas and setup webGL
	canvas = document.getElementById("gl-canvas");
    
    
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Configure viewport
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 0.9, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Init shader program and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
}

// Setzt die Listener
function initListener(document){

// Bewegung durch WASD
document.onkeydown = function (e)
{   
    // 0.2 ist die Geschwindigkeitsskalierungsvariable
    var sinx = Math.sin(toRadians(angleLog)) * 0.2; 
    var cosx = Math.cos(toRadians(angleLog)) * 0.2;
  
    switch (e.keyCode)
    {
        //Translation vor und zurück in Abhängigkeit zu den Winkeln, quasi wie bei Pacman.
        case 87:
        	_keyPressed[0] = true;
            eye[0] -= sinx; 
            eye[2] -= cosx;
            target[0] -= sinx;
            target[2] -= cosx;
            break;
            
        case 83:
        	_keyPressed[1] = true;
            eye[0] += sinx;
            eye[2] += cosx;
            target[0] += sinx;
            target[2] += cosx;
            break;
        
        // Translation links rechts in Abhängigkeit der Winkel
        case 65:
        	_keyPressed[2] = true;
            eye[0] -= cosx;
            eye[2] += sinx;
            target[0] -= cosx;
            target[2] += sinx;
            break;
            
        case 68:
        	_keyPressed[3] = true;
            eye[0] += cosx;
            eye[2] -= sinx;
            target[0] += cosx;
            target[2] -= sinx;
            break;
    }
}

//gedrückte Taste wird nicht mehr gedrückt
document.onkeyup = function(e){
	switch(e.keyCode){
		case 87:
			_keyPressed[0] = false;
			break;
		
		case 83:
			_keyPressed[1] = false;
			break;

		case 65:
			_keyPressed[2] = false;
			break;

		case 68:
			_keyPressed[3] = false;
			break;
	}
}

// Setzt das Feld _mousedown auf true 
document.onmousedown = function(e){
	++_mouseDown;
}     

// Setzt das Feld _mousedown wieder auf false
document.onmouseup = function(e){
	--_mouseDown;
}

// Bewegt die Kamera auf der x-Ebene, wenn _mouseDown true ist.
document.onmousemove = function (e)
{
	// Gibt den Winkel an, um den rotiert werden soll
	var xzRotationsWinkel = 0.5;
	var yRotationsWinkel = 2;

	//if(_mouseDown)
	//{
		// Rotation um y-Achse, ruft eine Hilfsfunktion hinter init auf
	//}
    if (e.screenX > xPosition )
    {
		rotateY(toRadians(yRotationsWinkel));
    }
    if (e.screenX < xPosition)
    {
       	rotateY(toRadians(-yRotationsWinkel));
    }

    // Rotation um x-Achse
    if(e.screenY > yPosition)
    {
    	//console.log(e.screenY);
    	rotateXZ(toRadians(xzRotationsWinkel));
    }

    if(e.screenY < yPosition)
    {
    	//console.log(e.screenY);
    	rotateXZ(toRadians(-xzRotationsWinkel));
    }

    xPosition = e.screenX;
    yPosition = e.screenY;
    }	
}

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Setzt die ViewMatrix
    mat4.lookAt(viewMatrix, eye, target, up);
    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
    
    // Läd die ModeMatrix des ersten Cubes und jagt sie durch
    // die Shader
    gl.uniformMatrix4fv(modelMatrixLoc, false, cube);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);

    // Zweite ModelMatrix durch die Shader jagen
    gl.uniformMatrix4fv(modelMatrixLoc, false, cube2);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
    
    // Und die letzte ModelMatrix durch die Shader ballern
    gl.uniformMatrix4fv(modelMatrixLoc, false, boden);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
    
    // Wiederhole den Spaß
	requestAnimFrame(render);
}

// Implementation der Quaternionen von Yannic
function rotateY(radY){
	var direction = vec3.create();
	vec3.subtract(direction,target,eye);
	var q = quat.create();
	quat.setAxisAngle(q,up,radY);
	vec3.transformQuat(direction,direction,q);
	vec3.add(target,eye,direction);
}

function rotateXZ(radXZ){
	var direction = vec3.create();
	vec3.subtract(direction,target,eye);
	var strafeDirection = vec3.create();
	vec3.cross(strafeDirection,direction,up);
	var upDirection = vec3.create();
	vec3.copy(upDirection,up);
	var q = quat.create();
	quat.setAxisAngle(q,strafeDirection,radXZ);
	vec3.transformQuat(direction,direction,q);
	vec3.add(target,eye,direction);
}

// rechnet Winkel in Radianten um
function toRadians(angle)
{
  return (angle * Math.PI / 180);
}