var deathStar = window.document.createElement('div');
var startTime = null;
var incrementX = 10;
var incrementY = 3;

var deathStarStyle = {
    boxSizing: "border-box",
    padding: "0px",
    borderRadius: "50%",
    width: "200px",
    height: "200px",
    border: "3px solid green",
    backgroundColor: "rgba( 0, 255, 0, 0.2 )",
    backgroundImage: "url('http://www.b3takit.co.uk/images/deathstar.jpg')",
    backgroundSize: "210px 210px",
    backgroundPosition: "-9px -9px, center",
    position: "absolute",
    top: "30px",
    left: "30px",
    zIndex: 3
};

var propName;
for (propName in deathStarStyle) {
    deathStar.style[propName] = deathStarStyle[propName];
}

var body = window.document.querySelector('body');
body.appendChild(deathStar);

function animationFrame(timestamp) {
    startTime = startTime ? startTime : timestamp;

    var timeElapsed = timestamp - startTime;
    var deathStarX = parseInt(deathStar.style.left, 10);
    var deathStarWidth = parseInt(deathStar.style.width, 10);
    var deathStarY = parseInt(deathStar.style.top, 10);
    var deathStarHeight = parseInt(deathStar.style.height, 10);

    if (deathStarX >= window.innerWidth - deathStarWidth || deathStarX <= 0) {
        incrementX *= -1;
    }

    if (deathStarY >= window.innerHeight - deathStarHeight || deathStarY <= 0) {
        incrementY *= -1;
    }

    deathStar.style.left = deathStarX + incrementX + "px";
    deathStar.style.top = deathStarY + incrementY + "px";
    window.requestAnimationFrame(animationFrame);
}

var keys = {
    left : 37,
    right : 39,
    up : 38,
    down : 40
}

function keyPressed(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    switch (keyCode) {
        case keys.left :
            console.log( 'left' );
            incrementX--;
            break;
        case keys.right :
            console.log( 'right' );
            incrementX++;
            break;
        case keys.up :
            console.log( 'up' );
            incrementY--;
            break;
        case keys.down :
            console.log( 'down' );
            incrementY++;
            break;
        default:
            break;
    }
}

window.addEventListener( "keydown", keyPressed, false );

window.requestAnimationFrame( animationFrame );
