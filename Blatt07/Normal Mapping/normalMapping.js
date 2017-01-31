var gl;
var canvas;

var eye;
var target;
var up;

var lastMousePosX = 0;
var lastMousePosY = 0;

var rotationAngleY = 0;
var rotationAngleX = 0;

var objects = [];
var sandTexture;

var timer = setInterval(timeFunction, 50);

var tick = 0.0;

function timeFunction(){
	tick += 0.1;
	tick = tick % 20.0;
};


var RenderObject = function(transform, color, shader, buffer, bufferLength)
{
	this.transform = transform;
	this.color = color;
	this.shader = shader;
	this.buffer = buffer;
	this.bufferLength = bufferLength;
	this.lighting = false;
	this.textured = false;
	
	this.rotationY = 0.01;
	this.rotationX = 0.01;
	this.rotationZ = 0.01;
}

RenderObject.prototype.rotate = function(angle, axis) 
{
	mat4.rotate(this.transform, this.transform, angle, axis);
}

function initTextures() {
    sandTexture = gl.createTexture();
    sandImage = new Image();
    sandImage.onload = function () { handleTextureLoaded(sandImage, sandTexture); }
    sandImage.src = "sand_diffuse.jpg";

    // TODO 1: Erstelle analog zu diffuser Textur eine Normal Map für den Sand.
    normalTexture = gl.createTexture();
    normalImage = new Image();
    normalImage.onload = function () {handleTextureLoaded(normalImage, normalTexture);}
    normalImage.src = "sand_normal.jpg";

}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	initTextures();

	// Specify position and color of the vertices
	
										// Front
	var islandVertices = new Float32Array([		-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, 0.5, 0.5,
										
										0.5, 0.5, 0.5,
										-0.5, 0.5 ,0.5,
										-0.5, -0.5, 0.5,
										
										// Right
										0.5, 0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										0.5, 0.5, -0.5,
										0.5, 0.5, 0.5,
										
										// Back
										-0.5, -0.5, -0.5,
										0.5, -0.5, -0.5,
										0.5, 0.5, -0.5,
										
										0.5, 0.5, -0.5,
										-0.5, 0.5 ,-0.5,
										-0.5, -0.5, -0.5,
										
										// Left
										-0.5, 0.5, 0.5,
										-0.5, -0.5, 0.5,
										-0.5, -0.5, -0.5,
										
										-0.5, -0.5, -0.5,
										-0.5, 0.5, -0.5,
										-0.5, 0.5, 0.5,
										
										// Bottom
										-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										-0.5, -0.5 , -0.5,
										-0.5, -0.5, 0.5,
										
										// Top
										-0.5, 0.5, 0.5,
										0.5, 0.5, 0.5,
										0.5, 0.5, -0.5,
										
										0.5, 0.5, -0.5,
										-0.5, 0.5 , -0.5,
										-0.5, 0.5, 0.5
										]);
										
	var islandNormals = new Float32Array([
										// Front
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,

										// Right
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,

										// Back
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,

										// Left
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,

										// Bottom
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,

										// Top
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,																													
	]);
    
	var islandTextureCoordinates = new Float32Array([
							// Front
							0.0, 0.0,
							1.0, 0.0,
							1.0, 1.0,
							1.0, 1.0,
							0.0, 1.0,
							0.0, 0.0,							
                            // Right
							0.0, 0.0,
							0.0, 1.0,
							1.0, 1.0,
							1.0, 1.0,
							1.0, 0.0,
							0.0, 0.0,
							// Back
							0.0, 0.0,
							0.0, 1.0,
							1.0, 1.0,
							1.0, 1.0,
							1.0, 0.0,
							0.0, 0.0,							
                            // Left
							0.0, 0.0,
							1.0, 0.0,
							1.0, 1.0,
							1.0, 1.0,
							0.0, 1.0,
							0.0, 0.0,						
                            // Bottom
							0.0, 0.0,
							1.0, 0.0,
							1.0, 1.0,
							1.0, 1.0,
							0.0, 1.0,
							0.0, 0.0,							
                            // Top
							0.0, 0.0,
							1.0, 0.0,
							1.0, 1.0,
							1.0, 1.0,
							0.0, 1.0,
							0.0, 0.0
	]);
										
	
    var waterVertices = waterFunction(0.01);


	// Ursprüngliches Wasser	
/*
		1, 0, 1,
		1, 0, -1,
		-1, 0, -1,
		  
		-1, 0, -1,
		-1, 0, 1,
		1, 0, 1
*/
	//Simple, größere Plane
/*
		1, 0,-1,
		0, 0,-1,
		1, 0, 0,

		1, 0, 0,
		0, 0,-1,
		0, 0, 0,

		0, 0, 0,
		0, 0,-1,
		-1,0,-1,

		0, 0, 0,
		-1, 0,-1,
		-1, 0, 0,

		1, 0, 1,
		1, 0, 0,
		0, 0, 0,

		1, 0, 1,
		0, 0, 0,
		0, 0, 1,

		0, 0, 1,
		0, 0, 0,
		-1, 0, 0,

		0, 0, 1,
		-1, 0, 0,
		-1, 0, 1
*/
		
	
										 
											// Front
	var palmTreeVertices = new Float32Array([		-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										1, 0.5, 1,
										
										1, 0.5, 1,
										-1, 0.5 ,1,
										-0.5, -0.5, 0.5,
										
										// Right
										1, 0.5, 1,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										1, 0.5, -1,
										1, 0.5, 1,
										
										// Back
										-0.5, -0.5, -0.5,
										0.5, -0.5, -0.5,
										1, 0.5, -1,
										
										1, 0.5, -1,
										-1, 0.5 ,-1,
										-0.5, -0.5, -0.5,
										
										// Left
										-1, 0.5, 1,
										-0.5, -0.5, 0.5,
										-0.5, -0.5, -0.5,
										
										-0.5, -0.5, -0.5,
										-1, 0.5, -1,
										-1, 0.5, 1,
										
										// Bottom
										-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										-0.5, -0.5 , -0.5,
										-0.5, -0.5, 0.5,
										
										// Top
										-1, 0.5, 1,
										1, 0.5, 1,
										1, 0.5, -1,
										
										1, 0.5, -1,
										-1, 0.5 , -1,
										-1, 0.5, 1
										]);
	
	var palmLeafVertices = new Float32Array([0, 0, -0.2,
										  0, 0, 0.2,
										  1, -0.3, 0,
										 ]);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader programs

	var defaultProgram = initShaders(gl, "vertex-shader", "fragment-shader");
	var vertexLightingProgram = initShaders(gl, "vertex-shader-lighting", "fragment-shader-lighting");
	var wasser = initShaders(gl, "water-vertex-shader", "water-fragment-shader");
	
	///// ISLAND OBJECT /////
	
	// Create buffer and copy data into it
	var vertexBufferIsland = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferIsland);
	gl.bufferData(gl.ARRAY_BUFFER, islandVertices, gl.STATIC_DRAW);
	
	var normalBufferIsland = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferIsland);
	gl.bufferData(gl.ARRAY_BUFFER, islandNormals, gl.STATIC_DRAW);
    
	var textureCoordinateBufferIsland = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBufferIsland);
	gl.bufferData(gl.ARRAY_BUFFER, islandTextureCoordinates, gl.STATIC_DRAW);
	
	// Create object
	var island = new RenderObject(mat4.create(), vec4.fromValues(1,1,0,1), vertexLightingProgram, vertexBufferIsland, islandVertices.length/3);
	island.normalBuffer = normalBufferIsland;
	island.normalBufferLength = islandNormals.length/3;
	island.lighting = true;
	island.textured = true;
	island.texCoordBuffer = textureCoordinateBufferIsland;
	mat4.translate(island.transform, island.transform, vec3.fromValues(0, 0, 0));
	mat4.scale(island.transform, island.transform, vec3.fromValues(5, 1, 5));
	
	// Push object on the stack
	objects.push(island);
	
	///// WATER OBJECT /////
	
	// Create buffer and copy data into it
	var vertexBufferWater = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferWater);
	gl.bufferData(gl.ARRAY_BUFFER, waterVertices, gl.STATIC_DRAW);
	
	// Create object
	var water = new RenderObject(mat4.create(), vec4.fromValues(0,0,1,1), wasser, vertexBufferWater, waterVertices.length/3);
	mat4.translate(water.transform, water.transform, vec3.fromValues(0, 0, 0));
	mat4.scale(water.transform, water.transform, vec3.fromValues(50, 1, 50));
	
	// Push object on the stack
	objects.push(water);
	
	///// PALM TREE OBJECTS /////
	
	for (var i = 0; i < 5; i++) 
	{
		// Create buffer and copy data into it
		var vertexBufferPalmTree = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferPalmTree);
		gl.bufferData(gl.ARRAY_BUFFER, palmTreeVertices, gl.STATIC_DRAW);
	
		// Create object
		var palmTree = new RenderObject(mat4.create(), vec4.fromValues(0.58,0.3,0,1), defaultProgram, vertexBufferPalmTree, palmTreeVertices.length/3);
		mat4.scale(palmTree.transform, palmTree.transform, vec3.fromValues(0.2, 0.2, 0.2));
		mat4.translate(palmTree.transform, palmTree.transform, vec3.fromValues(5, 3+i, 5));
	
		// Push object on the stack
		objects.push(palmTree);
	}
	
	///// PALM LEAF OBJECTS /////
	
	for (var i = 0; i < 4; i++) 
	{
		// Create buffer and copy data into it
		var vertexBufferPalmLeaf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferPalmLeaf);
		gl.bufferData(gl.ARRAY_BUFFER, palmLeafVertices, gl.STATIC_DRAW);
	
		// Create object
		var palmLeaf = new RenderObject(mat4.create(), vec4.fromValues(0,1,0,1), defaultProgram, vertexBufferPalmLeaf, palmLeafVertices.length/3);
		mat4.translate(palmLeaf.transform, palmLeaf.transform, vec3.fromValues(1, 1.6, 1));
		mat4.rotate(palmLeaf.transform, palmLeaf.transform, Math.PI * 0.5 * i, vec3.fromValues(0, 1, 0));
	
		// Push object on the stack
		objects.push(palmLeaf);
	}
	
	// Setup projectionMatrix (perspective)
	
	var fovy = Math.PI * 0.25; // 90 degrees
	var aspectRatio = canvas.width / canvas.height;
	var nearClippingPlane = 0.5;
	var farClippingPlane = 100;
	
	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fovy, aspectRatio, nearClippingPlane, farClippingPlane);
	
	//setup viewMatrix (camera)

	eye = vec3.fromValues(-12.0, 1.0, -8.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);
	
	lookVector= vec3.fromValues(0.0,0.0,-1.0);
	target = vec3.create();
	vec3.add(target, eye, lookVector);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);
	
	// Bind input events to functions
	
    document.onkeydown = handleKeyDown;
    document.onmousemove = handleMouseMove;
    lastMousePosX = canvas.width/2;
    lastMousePosY = canvas.height/2;
    
	render();
};

function render()
{	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	
	objects.forEach(function(object) 
	{
		// Set shader program
		gl.useProgram(object.shader);

		// Set attribute
		var vPosition = gl.getAttribLocation(object.shader, "vPosition");
		gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		// Set lighting
		if (object.lighting == true)
		{
			var vNormal = gl.getAttribLocation(object.shader, "vNormal");
			gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
			gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vNormal);
			
			// Set object color
			var ambientLightLoc = gl.getUniformLocation(object.shader, "ka");
			gl.uniform4f(ambientLightLoc, 0.1, 0.1, 0.1, 1.0);
			var diffuseLightLoc = gl.getUniformLocation(object.shader, "kd");
			gl.uniform4fv(diffuseLightLoc, object.color);
			var specularLightLoc = gl.getUniformLocation(object.shader, "ks");
			gl.uniform4fv(specularLightLoc, object.color);
			
			// Set light source attributes
			var diffuseLightSourceLoc = gl.getUniformLocation(object.shader, "Id");
			gl.uniform4f(diffuseLightSourceLoc, 1.0, 1.0, 1.0, 1.0);
			var specularLightSourceLoc = gl.getUniformLocation(object.shader, "Is");
			gl.uniform4f(specularLightSourceLoc, 0.2, 0.15, 0.0, 1.0);
			var lightPositionLoc = gl.getUniformLocation(object.shader, "lightPosition");
			gl.uniform3f(lightPositionLoc, -5.0, 4.0, -5.0);
			var ambientLightWorldLoc = gl.getUniformLocation(object.shader, "Ia");
			gl.uniform4f(ambientLightWorldLoc, 0.1, 0.1, 0.1, 1.0);
			
			// Calculate and set normal matrix
			var mvMatrix = mat4.create();
			mat4.multiply(mvMatrix, viewMatrix, object.transform);
			var normalMatrix = mat4.create();
			mat4.transpose(normalMatrix, mvMatrix);
			mat4.invert(normalMatrix, normalMatrix);
			normalMatrixLoc = gl.getUniformLocation(object.shader, "normalMatrix");
			gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);
		}
		else
		{
			var colorLoc = gl.getUniformLocation(object.shader, "objectColor");
			gl.uniform4fv(colorLoc, object.color);
		}
		
	    // Set textures
		if (object.textured == true) {
		    // Put tex coords from the VBO to the shader
		    var vTextureCoord = gl.getAttribLocation(object.shader, "vTexCoord");
		    gl.bindBuffer(gl.ARRAY_BUFFER, object.texCoordBuffer);
		    gl.vertexAttribPointer(vTextureCoord, 2, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vTextureCoord);

		    // Connect diffuse map to the shader
		    gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, sandTexture);
		    gl.uniform1i(gl.getUniformLocation(object.shader, "diffuseMap"), 0);
            
		    // TODO 3: Verknüpfe Normal Map analog zu diffuser Map mit Shader.
		    gl.activeTexture(gl.TEXTURE1);
		    gl.bindTexture(gl.TEXTURE_2D, normalTexture);
		    gl.uniform1i(gl.getUniformLocation(object.shader, "normalMap"), 1);
		    
		}
		
		// Set uniforms
		var projectionMatrixLoc = gl.getUniformLocation(object.shader, "projectionMatrix");
		var viewMatrixLoc = gl.getUniformLocation(object.shader, "viewMatrix");
		var modelMatrixLoc = gl.getUniformLocation(object.shader, "modelMatrix");
		gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
		gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
		gl.uniformMatrix4fv(modelMatrixLoc, false, object.transform);

		// Zeitabhängig Variable an den Shader übergeben
		var tickloc = gl.getUniformLocation(object.shader, "tick");
		gl.uniform1f(tickloc, tick);


		// Draw
		gl.drawArrays(gl.TRIANGLES, 0, object.bufferLength);
	});

	requestAnimFrame(render);
}

function handleKeyDown(event) 
{
	// Extract view direction for xz plane
	var viewDirection = vec3.fromValues(lookVector[0], 0, lookVector[2]);
	
	// Compute strafe direction
	var strafeDirection = vec3.fromValues(lookVector[2], 0, -lookVector[0]);
		
	// Up
	if (String.fromCharCode(event.keyCode) == 'W') 
	{
		// Add view direction to eye position AND look vector to target
		vec3.add(eye, eye, viewDirection);
		vec3.add(target, eye, lookVector);
		mat4.lookAt(viewMatrix, eye, target, up);
	}
	// Down
	if (String.fromCharCode(event.keyCode) == 'S') 
	{
		// Subtract view direction to eye position AND look vector to target
		vec3.subtract(eye, eye, viewDirection);
		vec3.add(target, eye, lookVector);
		mat4.lookAt(viewMatrix, eye, target, up);
	}
	// Right
	if (String.fromCharCode(event.keyCode) == 'D') 
	{
		// Subtract strafe direction to eye position AND look vector to target
		vec3.subtract(eye, eye, strafeDirection);
		vec3.add(target, eye, lookVector);
		mat4.lookAt(viewMatrix, eye, target, up);
	}
	// Left
	if (String.fromCharCode(event.keyCode) == 'A') 
	{
		// Add strafe direction to eye position AND look vector to target
		vec3.add(eye, eye, strafeDirection);
		vec3.add(target, eye, lookVector);
		mat4.lookAt(viewMatrix, eye, target, up);
	}
}

function handleMouseMove(event) 
{
	// Remove the offset of the canvas rectangle from mouse coordinates
	
	var x = event.clientX - canvas.getBoundingClientRect().left;
	var y = event.clientY - canvas.getBoundingClientRect().top;
	
	var newX = lastMousePosX - x;
	lastMousePosX = x;
	
	var newY = lastMousePosY - y;
	lastMousePosY = y;
	
	// Translate mouse movement to angle: 1px = 1 degree
	rotationAngleY += Math.PI/180 * newX;
	rotationAngleX -= Math.PI/180 * newY;
	
	// Cut rotation angle between -45 and 45 degree
	if (rotationAngleX > Math.PI/4)
	{
		rotationAngleX = Math.PI/4;
	}
	else if (rotationAngleX < -Math.PI/4)
	{
		rotationAngleX = -Math.PI/4;
	}
	
	var rotationVector = vec3.create();
	var rotationMatrix = mat4.create();

	mat4.fromZRotation(rotationMatrix,rotationAngleX);
	vec3.transformMat4(rotationVector,vec3.fromValues(-1.0,0.0,0.0),rotationMatrix);
	
	mat4.fromYRotation(rotationMatrix,rotationAngleY);
	vec3.transformMat4(lookVector,rotationVector,rotationMatrix);
	
	vec3.add(target, eye, lookVector);

	mat4.lookAt(viewMatrix, eye, target, up);
}

function waterFunction(x){

	var waterArray = [];

    for(var i = -1.0; i < 1.0; i += x){
		for(var j = -1.0; j < 1.0; j += x){
			waterArray.push(
				i, 0.0, j,
				i + x, 0.0, j + x,
				i + x, 0.0, j,

				i, 0.0, j,
				i, 0.0, j + x,
				i + x, 0.0, j + x)
		}

    }
    return new Float32Array(waterArray);
}