// Für WebGL
var gl;
var canvas;
var program;

// Für die Objekte
var objects = [];
var modelMatrixLoc;
var positionLoc;
var colorLoc;

// Für die Bewegung
var eye;
var target;
var up;
// Tastatursteuerung
// Array für die gedrückten Tasten: W A S D Q E
var _keyPressed = [false, false, false, false, false, false]; 
var _kameraWinkel = 0;
// Maussteuerung
var _mouseDown = 0;
var xPosition;
var yPosition;


// var angleLog = 0; // Speichert den aktuellen Winkel
// var positions;
// var colors;

// var earthTexture;
// var earthImage;

// 

// var positionBuffer;
// var colorBuffer;
// var cubeVerticesNormalBuffer;
// var texBuffer;

// 

// //var erthTexture;

// var modelMatrixLoc2;
// var boden;
// var cube;
// var cube2;

// var viewMatrixLoc;
// var viewMatrix;

// var projectionMatrixLoc;
// var projectionMatrix;

// var normTransCubeMatrixLoc;
// var normTransCubeMatrix;

var RenderObject = function(modelMatrix, color, vertexBuffer, indexBuffer, normalBuffer)
{
	this.modelMatrix = modelMatrix;
	this.color = color;
	this.vertexBuffer = vertexBuffer;
	this.indexBuffer = indexBuffer;
	this.numVertices = indexBuffer.numItems;
	this.normalBuffer = normalBuffer;

}

window.onload = function init()
{
	initWebGL(document);
	initListener(document);

	/// Setze die Objekte ///
	// Create CylinderObject
	var cylinderString = document.getElementById("cylinder").innerHTML;
	cylinderMesh = new OBJ.Mesh(cylinderString);
	OBJ.initMeshBuffers(gl, cylinderMesh);
	
	cylinderObject = new RenderObject(mat4.create(), vec4.fromValues(1, 0, 0, 1), 
		cylinderMesh.vertexBuffer, cylinderMesh.indexBuffer, cylinderMesh.normalBuffer);
	objects.push(cylinderObject);
	
	// Create CubeObject
	var cubeString = document.getElementById("cube").innerHTML;
	cubeMesh = new OBJ.Mesh(cubeString);
	OBJ.initMeshBuffers(gl, cubeMesh);

	cubeObject = new RenderObject(mat4.create(), vec4.fromValues(0, 0, 1, 1),
		cubeMesh.vertexBuffer, cubeMesh.indexBuffer, cubeMesh.normalBuffer);	
	// Skaliere Form unseres Cubes
	mat4.scale(cubeObject.modelMatrix, cubeObject.modelMatrix, 
		vec3.fromValues(10,0.1,10));
	// Bewege Cube auf der Y-Achse nach unten
	mat4.translate(cubeObject.modelMatrix, cubeObject.modelMatrix,
		vec3.fromValues(0,-15,0));
	// Pushe das neue Objekt auf den Stack
	objects.push(cubeObject);


	/// Setze die restlichen Matrizen ///
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
    

	//Set transformationmatrix for normals
	normTransMatrix = mat4.create();
	normTransMatrix = mat4.transpose(normTransMatrix,normTransMatrix);
	normTransMatrix = mat4.invert(normTransMatrix,normTransMatrix);

	normTransMatrixLoc = gl.getUniformLocation(program, "normTransMatrix");
	gl.uniformMatrix4fv(normTransMatrixLoc, false, normTransMatrix);
	
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	colorLoc = gl.getUniformLocation(program, "vColor");
	positionLoc = gl.getAttribLocation(program, "vPosition");
	normalLoc = gl.getAttribLocation(program,"vNormal");

	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	moveObjects();
    
    objects.forEach(function(object){
		// Setzt die ViewMatrix
		mat4.lookAt(viewMatrix, eye, target, up);
		gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

		// Set attributes
		gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
		gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positionLoc);

		gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
		gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(normalLoc);

		// Set uniforms
		gl.uniformMatrix4fv(modelMatrixLoc, false, object.modelMatrix);
		gl.uniform4fv(colorLoc, object.color);

		// Draw
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);
		gl.drawElements(gl.TRIANGLES, object.numVertices, gl.UNSIGNED_SHORT, 0);
		//gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
	});

    // Wiederhole den Spaß
	requestAnimFrame(render);
}

// Initiiert WebGL mit dem ganzen Standardkram
function initWebGL(document)
{
	// Get canvas and setup webGL
	canvas = document.getElementById("gl-canvas");
    
    
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Configure viewport
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.6, 0.6, 0.6, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Init shader program and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
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

function moveObjects(){

	// 0.2 ist die Geschwindigkeitsskalierungsvariable
    var sinx = Math.sin(toRadians(_kameraWinkel)) * 0.2; 
    var cosx = Math.cos(toRadians(_kameraWinkel)) * 0.2;
    // W
	if(_keyPressed[0]){
		eye[0] -= sinx; 
        eye[2] -= cosx;
        target[0] -= sinx;
        target[2] -= cosx;	
	}
	// S
	if(_keyPressed[1]){         
		eye[0] += sinx;
        eye[2] += cosx;
        target[0] += sinx;
        target[2] += cosx;
    }
    // A
	if(_keyPressed[2]){
		eye[0] -= cosx;
        eye[2] += sinx;
        target[0] -= cosx;
        target[2] += sinx;
	}
	// D
	if(_keyPressed[3]){
		eye[0] += cosx;
        eye[2] -= sinx;
        target[0] += cosx;
        target[2] -= sinx;
	}
	// Q
	if(_keyPressed[4]){
		rotateY(toRadians(2));
	}
	// E
	if(_keyPressed[5]){
		rotateY(toRadians(-2));
	}
}



// Setzt die Listener
function initListener(document){

	// Bewegung durch WASD
	document.onkeydown = function (e){ 
	    switch (e.keyCode){
	        //W
	        case 87:
	        	_keyPressed[0] = true;
                break;	            
	        //S
	        case 83:
	        	_keyPressed[1] = true;
	            break;
	        // A
	        case 65:
	        	_keyPressed[2] = true;	       
	            break;
	        // D
	        case 68:
	        	_keyPressed[3] = true;
	            break;
            // Q
            case 81:
            	_keyPressed[4] = true;
            	break;
        	// E
        	case 69:
        		_keyPressed[5] = true;
	    }
	}

	//gedrückte Taste wird nicht mehr gedrückt
	document.onkeyup = function(e){
		switch(e.keyCode){
			// W
			case 87:
				_keyPressed[0] = false;
				break;
			// S
			case 83:
				_keyPressed[1] = false;
				break;
			// A
			case 65:
				_keyPressed[2] = false;
				break;
			// D
			case 68:
				_keyPressed[3] = false;
				break;
            // Q
            case 81:
            	_keyPressed[4] = false;
            	break;
        	// E
        	case 69:
        		_keyPressed[5] = false;
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
	document.onmousemove = function (e){
		// Gibt den Winkel an, um den rotiert werden soll
		var xzRotationsWinkel = 0.5;
		var yRotationsWinkel = 2;

		if(_mouseDown){
		    if (e.screenX > xPosition ){
				rotateY(toRadians(yRotationsWinkel));
		    }
		    if (e.screenX < xPosition){
		       	rotateY(toRadians(-yRotationsWinkel));
		    }
		    // Rotation um x-Achse
		    if(e.screenY > yPosition){
		    	//console.log(e.screenY);
		    	rotateXZ(toRadians(xzRotationsWinkel));
		    }
		    if(e.screenY < yPosition){
		    	//console.log(e.screenY);
		    	rotateXZ(toRadians(-xzRotationsWinkel));
		    }
    	}
	    xPosition = e.screenX;
	    yPosition = e.screenY;
    }	
}

// rechnet Winkel in Radianten um
function toRadians(angle)
{
  return (angle * Math.PI / 180);
}





// Auskomentierte Funktionen


/*// Specify position and color of the vertices	
									 
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
  	]);*/

 /* // Load positions into the GPU and associate shader variables
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

	// Lade die Normalen in den Buffer und weise sie dem
	// Attribut zu
	cubeVerticesNormalBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);

	var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
*/

/*
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
*/


  	/*
  	//Definition der Textur
  	earthTexture = gl.createTexture();
  	earthImage = new Image();
  	earthImage.onload = function(){
  		handleTexture(earthTexture, earthImage);
  	};
  	earthImage.src = "earth.jpg";
  	

	// Läd ein Bild auf eine Textur
	function handleTexture(texture, image){
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	}

  	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);

  	var texCoords = new Float32Array([
  		0,0,
  		0,1,
  		1,1,
  		1,1,
  		1,0,
  		0,0,
  		0,0,
  		0,1,
  		1,1,
  		1,1,
  		1,0,
  		0,0,
  		0,0,
  		0,1,
  		1,1,
  		1,1,
  		1,0,
  		0,0,
  		0,0,
  		0,1,
  		1,1,
  		1,1,
  		1,0,
  		0,0,
  		0,0,
  		0,1,
  		1,1,
  		1,1,
  		1,0,
  		0,0,
  		0,0,
  		0,1,
  		1,1,
  		1,1,
  		1,0,
  		0,0,]);
  
  


    // Lade Texturen 
    texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    var vTexCoords = gl.getAttribLocation(program, "vTexCoords");
    gl.vertexAttribPointer(vTexCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoords);

    // Verlinkung mit Shadervariablen
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, earthTexture);
    var loc = gl.getUniformLocation(program, "map");
    gl.uniform1i(loc, 0);
	*/