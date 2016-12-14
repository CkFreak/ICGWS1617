var gl;
var canvas;
var eye;
var target;
var up;

var angleLog = 0; // Speichert den aktuellen Winkel
var positions;
var colors;

var xPosition;
var yPosition;
var _mouseDown = 0;

var positionBuffer;
var colorBuffer;

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
            
            // Translation links rechts in Abhängigkeit der Winkel
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
    	if(_mouseDown)
    	{
    		// Rotation um y-Achse
	        if (e.screenX < xPosition)
	        {
	    		//console.log(e.screenX);
	            rotateCamY(-1);
	        }
	        else if (e.screenX > xPosition )
	        {
	    		rotateCamY(1);
	        }

	        // Rotation um x-Achse
	        if(e.screenY < yPosition)
	        {
	        	console.log(e.screenY);
	        	rotateCamX(-1);
	        }
	        else if(e.screenY > yPosition)
	        {
	        	console.log(e.screenY);
	        	rotateCamX(1);
	        }
	        xPosition = e.screenX;
	        yPosition = e.screenY;
    	}

    }		
    
    // http://glmatrix.net/docs/vec3.js.html#line629    -> rotiert um Y Achse: Parameter (output, input, mittelpunkt, angle)!
    function rotateCamY(angle)
    {
        angleLog += angle;
        var rad = toRadians(angle);
        vec3.rotateY(target, target, eye, rad);
    }

    function rotateCamX(angle)
    {
        var rad = toRadians(angle);
        vec3.rotateX(target, target, eye, rad);
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