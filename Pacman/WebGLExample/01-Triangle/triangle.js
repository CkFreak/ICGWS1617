var gl;

window.onload = function init()
{
	// Get canvas and setup WebGL

	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	// Array mit den Koordinaten
	var vertices;
	// Array mit den Farben
	var colors;

	/*Diese Funktion nimmt einen Radius zwischen 0 und 1 eine Anzahl an vertices und einen Winkel für den Mund
	  Das Array vertices und colors wird mit den passenden Werten gefüllt
		Aus Gründen wie der Kreis aufgebaut wird wird erst bei etwa 150 Dreiecken der Mund in der angegebenen Größe angezeigt
	*/
	function drawPacman(r, nOV, mAngle)
	{
		//Hier wird aus der nOV und dem mAngle der angle berechnet
    //Der angle repräsentiert wie viele Dreiecke aus dem Kreis entfehrnt werden um den Mund freizulegen
		var anglePT = (360 / (nOV - 2)); //Der Winkel den jedes Dreiecke hat
		var angle = (mAngle / anglePT).toFixed(0); //Anzahl der zu entfehrnenden Dreiecke
		if(angle % 2 != 0){ //Wenn die Anzahl der zu enfernenden Dreiecke nicht grade ist wird sie grade gemacht
			angle++;
		}

		verticesx = new Float32Array((nOV - angle)); //Hält die x Koordinaten. Die Koordinaten für die zu entfehrnenden Dreiecke werden abgezogen
		verticesy = new Float32Array((nOV - angle)); //Hält die y Koordinaten. Die Koordinaten für die zu entfehrnenden Dreiecke werden abgezogen
		colors = new Float32Array(nOV * 4); //Hält die Farben für die Dreiecke
		verticesx[0] = 0; //Die ersten Punkte setzen den Mittelpunkt des Kreises
		verticesy[0] = 0; //Hält die x Koordinaten. Die Koordinaten für die zu entfehrnenden Dreiecke werden abgezogen

		//Befüllt verticesx und verticesy mit Koordinaten. Legt man durch den Pacman eine Horizontale Linie
		//so werden ober und unterhalb von ihr die Koordinaten für die Dreiecke die den Mund aussparen gleichmäßig ausgelassen
		for (var i = 1; i < nOV; i++) {
			if(i > angle / 2 && i < verticesx.length + (angle/2)){
				verticesx[i - (angle / 2)] = r * Math.cos(i * 2 * Math.PI / (nOV - 2)); //In Bogenmaß + (anglePT / 2)
				verticesy[i - (angle / 2)] = r * Math.sin(i * 2 * Math.PI / (nOV - 2));
			}
		}

		verticesx[verticesx.length - 1] = 0; // Die letzte Koordinate zeigt wieder auf den Mittelpunkt
		verticesy[verticesy.length - 1] = 0; // Die letzte Koordinate zeigt wieder auf den Mittelpunkt

		vertices = new Float32Array((nOV - angle) * 2); //Array in dem die x und y Koordinaten vereint werden
		for(var i = 0; i < verticesx.length; i++){
			vertices[i * 2] = verticesx[i];
			vertices[i*2 +1] = verticesy[i];
		}

		//Für jedes Dreieck wird eine Farbe hinzugefügt
		for(var i = 0; i < verticesx.length * 4; i++){
			colors[i*4] = 1;
			colors[i*4 + 1] = 1;
			colors[i*4 + 2] = 0;
			colors[i*4 + 3] = 1;
		}
		//Zusatzinfos für die Konsole
		console.log("Angegebener Radius: " + r);
		console.log("Anzahl der vertices: " + nOV);
		console.log("Anzahl der Dreiecke gesamt: " + (nOV - 2));
		console.log("Angegebener Winkel: " + mAngle + "°");
		console.log("Anzahl der zu entfehrnenden Dreiecke: " + angle);
	}

	drawPacman(1, 10, 30);

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

	render(vertices);
};

//Da sich je nach Angaben die länge des Arrays ändert wird dies mit übergeben
function render(vertices)
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}
