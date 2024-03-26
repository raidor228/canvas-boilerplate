// images
import platform from '../img/platform.png'
import platformSmallTall from '../img/platformSmallTall.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import ak47 from '../img/ak47.png'
import boss from '../img/boss.png'

// video
import character from '../vid/character.webm'
import enemy1 from '../vid/enemy1.webm'
import enemy2 from '../vid/enemy2.webm'
import enemy3 from '../vid/enemy3.webm'
import enemy4 from '../vid/enemy4.webm'
import enemy5 from '../vid/enemy5.webm'
import enemy6 from '../vid/enemy6.webm'

// audio
import death from '../aud/death.mp3'
import take_damage from '../aud/take_damage.mp3'
import boss_fight from '../aud/boss_fight.mp3'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
 
canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 1.5;

const playerSpeed = 10;
const enemySpeed = 3;
const bossSpeed = 6;

const playerMaxHealth = 20;
const enemy1MaxHealth = 2;
const enemy2MaxHealth = 6;
const enemy3MaxHealth = 8;
const enemy4MaxHealth = 10;
const enemy5MaxHealth = 4;
const enemy6MaxHealth = 4;
const bossMaxHealth = 50;

const attackInterval = 750;
const minDistanceToAttackX = 150;
const minDistanceToAttackY = 250;

let kills = 0;

const startTime = new Date();

c.font = '24px Arial';
c.fillStyle = 'white';

// audio
var deathAudio = new Audio(death);
var takeDamageAudio = new Audio(take_damage);
var bossFightAudio = new Audio(boss_fight);

class FlyingText {
	constructor(position) {
		this.position = position;
		 
		c.fillText('', this.position.x, this.position.y);
	}
	
	update(text) {
		c.fillText(text, this.position.x, this.position.y);
	}
	
	move(offset) {
		this.position.x += offset;
	}
}

class Character {
    reset() {
        this.position = this.startPosition;
        this.velocity = {
            x: 0,
            y: 0
        };
    }

    constructor(source, startPosition, hasVelocity, speed, maxHealth, isVideo = true) {
        this.isVideo = isVideo;
		
		this.startPosition = startPosition;
		
		this.speed = speed;
		this.health = maxHealth;
		this.maxHealth = maxHealth;
		
		this.onGround = false;
		
        this.reset();

		this.hasVelocity = hasVelocity;

		if (this.isVideo) {
			this.video = document.createElement("video");
			this.video.src = source;
			this.video.autoPlay = false;
			this.video.loop = true;
			this.videoContainer = {
				video : this.video,
				ready : false,
			};
			this.video.oncanplay = () => this.readyToPlayVideo();
		}
		else {
			this.image = source;
			this.width = source.width;
			this.height = source.height;
		}

		if (!this.hasVelocity) {
			this.flyingText = new FlyingText({x: this.position.x, y: this.position.y - 20});
		}
    }

    readyToPlayVideo() {
        this.videoContainer.scale = canvas.height / this.videoContainer.video.videoHeight / 4;
        this.videoContainer.ready = true;
        
        this.width = this.videoContainer.video.videoWidth * this.videoContainer.scale;
        this.height = this.videoContainer.video.videoHeight * this.videoContainer.scale;
    }

    updateCanvas() {
		if (this.isVideo) {
			if (this.videoContainer.video.paused)
			{
				return;
			}
			
			if(this.videoContainer !== undefined && this.videoContainer.ready){
				var scale = this.videoContainer.scale;
				var vidH = this.videoContainer.video.videoHeight;
				var vidW = this.videoContainer.video.videoWidth;
				var top = this.position.y;
				var left = this.position.x;
				c.drawImage(this.videoContainer.video, left, top, vidW * scale, vidH * scale);
			}
		}
		else {
			c.drawImage(this.image, this.position.x - (this.width * 0.66) / 2, this.position.y, this.width * 0.66, this.height * 0.66);
		}

		if (!this.hasVelocity) {
			this.flyingText.update(this.health + '/' + this.maxHealth);
		}
    }

    update() {
        requestAnimationFrame(this.updateCanvas.bind(this));

        this.position.x += this.velocity.x;
		
		if (this.hasVelocity) {
			this.position.y += this.velocity.y;
			if (this.position.y + this.height + this.velocity.y <= canvas.height) {
				this.velocity.y += gravity;
			}
		}
    }
}

function gameOver(win) {
	c.fillStyle = 'rgba(0, 0, 0, 0.75)';
	c.fillRect(0, 0, canvas.width, canvas.height);

	const statusText = document.createElement('h1');
	if (win) {
		statusText.textContent = 'Вы выиграли!';
	}
	else {
		statusText.textContent = 'Вы проиграли!';
	}
	
	statusText.style.color = 'green';
	statusText.style.textDecoration = 'bold';
	statusText.style.position = 'fixed';
	statusText.style.top = '25%';
	statusText.style.left = '50%';
	statusText.style.transform = 'translate(-50%, -80%)';
	statusText.style.padding = '20px 40px';
	statusText.style.fontSize = '46px';

	const restartButton = document.createElement('button');
	restartButton.textContent = 'Начать сначала';
	restartButton.style.position = 'fixed';
	restartButton.style.top = '50%';
	restartButton.style.left = '50%';
	restartButton.style.transform = 'translate(-50%, -50%)';
	restartButton.style.padding = '20px 40px';
	restartButton.style.fontSize = '20px';
	restartButton.style.background = 'green';
	restartButton.style.color = 'white';
	restartButton.style.border = 'none';
	restartButton.style.cursor = 'pointer';

	restartButton.addEventListener('click', function() {
	  location.reload();
	});

	const interest = document.createElement('h1');
	interest.textContent = 'Всё самое интересное здесь:';
	interest.style.color = 'green';
	interest.style.position = 'fixed';
	interest.style.top = '60%';
	interest.style.left = '50%';
	interest.style.transform = 'translate(-50%, -80%)';
	interest.style.padding = '20px 40px';
	interest.style.fontSize = '30px';

	const link = document.createElement('a');
	link.href = 'https://kick.com/mellstroy271';
	link.textContent = 'https://kick.com/mellstroy271';
	link.style.color = 'green';
	link.style.textDecoration = 'underline';
	link.style.cursor = 'pointer';
	link.style.position = 'fixed';
	link.style.top = '65%';
	link.style.left = '50%';
	link.style.transform = 'translate(-50%, -50%)';
	link.style.padding = '20px 40px';
	link.style.fontSize = '30px';
	
	const link2 = document.createElement('a');
	link2.href = 'https://t.me/mellstroybonus';
	link2.textContent = 'https://t.me/mellstroybonus';
	link2.style.color = 'green';
	link2.style.textDecoration = 'underline';
	link2.style.cursor = 'pointer';
	link2.style.position = 'fixed';
	link2.style.top = '70%';
	link2.style.left = '50%';
	link2.style.transform = 'translate(-50%, -50%)';
	link2.style.padding = '20px 40px';
	link2.style.fontSize = '30px';
	
	document.body.appendChild(interest);
	document.body.appendChild(statusText);
	document.body.appendChild(link);
	document.body.appendChild(link2);
	document.body.appendChild(restartButton); 
}

class Player extends Character {
	constructor(source) {
		let startPosition = {
			x: 100,
			y: 250
		}
		super(source, startPosition, true, playerSpeed, playerMaxHealth); 
	}
	
	takeDamage(damage) {
		play_audio(takeDamageAudio);
		this.health = Math.max(0, this.health - damage);
		if (this.health <= 0) {
			gameIsOver = true;
			requestAnimationFrame(function() {
			  gameOver(false); 
			});
		}
	}
}

class Enemy extends Character {
	constructor(source, startPosition, player, damage, health, isVideo, speed) {
		super(source, startPosition, false, speed, health, isVideo);
		this.player = player;
		
		if (isVideo) {
			this.video.muted = true;
		}
		
		this.audioIsPlaying = false;
		
		this.damage = damage;
		this.attackInterval = attackInterval;
		this.lastAttackTime = 0;
		this.handleClick = this.handleClick.bind(this);
        canvas.addEventListener('click', this.handleClick);
	}
	
	moveToPlayer() {
		if (Math.abs(player.position.x - this.position.x) <= canvas.width) {
			if (this.isVideo) {
				this.video.muted = false;
			}
			
			if (!this.isVideo) {
				if (this.image == bossImage && !this.audioIsPlaying) {
					play_audio(bossFightAudio);
					this.audioIsPlaying = true;
				}
			}
			
			if (this.player.position.x < this.position.x) {
				this.position.x -= this.speed;
				this.flyingText.move(-this.speed);
			}
			else {
				this.position.x += this.speed;
				this.flyingText.move(this.speed);
			}
			
			const distanceToPlayerX = Math.abs(this.player.position.x - this.position.x);
			const distanceToPlayerY = Math.abs(this.player.position.y - this.position.y);
			if (distanceToPlayerX < minDistanceToAttackX && distanceToPlayerY < minDistanceToAttackY && Date.now() - this.lastAttackTime > this.attackInterval) {
				this.player.takeDamage(this.damage);
				this.lastAttackTime = Date.now();
			}
		}
		else {
			if (this.isVideo) {
				this.video.muted = true;
			}
		}
	}
	
	setEnemiesArray(enemiesArray) {
		this.enemiesArray = enemiesArray;
	}
	
	handleClick(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        if (
            clickX >= this.position.x &&
            clickX <= this.position.x + this.width &&
            clickY >= this.position.y &&
            clickY <= this.position.y + this.height
        ) {
            this.health -= 1;
			if (this.health <= 0) {
				kills++;
				this.removeEnemy()
			}
			else {
				play_audio(takeDamageAudio);
			}
        }
    }
	
	removeEnemy() {
        canvas.removeEventListener('click', this.handleClick);
		if (this.isVideo) {
			this.video.muted = true;
		}
        const index = this.enemiesArray.indexOf(this);
        if (index !== -1) {
			play_audio(deathAudio);
            this.enemiesArray.splice(index, 1);
        }
    }
}

class CharacterItem {
	constructor(image, character, offset, scale) {
		this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
		
		this.character = character;
		this.offset = offset;
	}

    draw() {
        c.drawImage(this.image, this.character.position.x + this.offset.x, this.character.position.y + this.offset.y, this.width, this.height);
	}
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw()
    {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw()
    {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
}

let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);
let ak47Image = createImage(ak47);
let bossImage = createImage(boss);

let player = new Player(character);
let platforms = []
let genericObjects = []

let enemies = []

let characterItems = []

let chapterTexts = []

let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0;

let gameIsOver = false;

function play_audio(audio) {
	audio.currentTime = 0;
	audio.play();
}

function init() {
    platformImage = createImage(platform);
    platformSmallTallImage = createImage(platformSmallTall);
 
    player.reset();

    platforms = [
        //new Platform({x: platformImage.width * 5 + 300 - 2 - platformSmallTallImage.width, y: 470, image: platformSmallTallImage}),
        new Platform({x: -1, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 1 - 3 * 1, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 2 - 3 * 2, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 3 - 3 * 3, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 4 - 3 * 4, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 5 - 3 * 5, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 6 - 3 * 6, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 7 - 3 * 7, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 8 - 3 * 8, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 9 - 3 * 9, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 10 - 3 * 10, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 11 - 3 * 11, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 12 - 3 * 12, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 13 - 3 * 13, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 14 - 3 * 14, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 15 - 3 * 15, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 16 - 3 * 16, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 17 - 3 * 17, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 18 - 3 * 18, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 19 - 3 * 19, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 20 - 3 * 20, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 21 - 3 * 21, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 22 - 3 * 22, y: 670, image: platformImage}),
        new Platform({x: platformImage.width * 23 - 3 * 23, y: 670, image: platformImage}),
    ]
	
    genericObjects = [
        new GenericObject({x: -1, y: -1, image: createImage(background)}),
    ]
 
	characterItems = [
		new CharacterItem(ak47Image, player, {x: 50, y: 40}, 0.3),
	]

	enemies = [
		new Enemy(enemy1, {x: 1800, y: 472}, player, 1, enemy1MaxHealth, true, enemySpeed),
		new Enemy(enemy1, {x: 2000, y: 472}, player, 1, enemy1MaxHealth, true, enemySpeed),
		
		new Enemy(enemy5, {x: 3500, y: 472}, player, 1, enemy5MaxHealth, true, enemySpeed),
		new Enemy(enemy5, {x: 3700, y: 472}, player, 1, enemy5MaxHealth, true, enemySpeed),
		new Enemy(enemy5, {x: 3900, y: 472}, player, 1, enemy5MaxHealth, true, enemySpeed),
		new Enemy(enemy5, {x: 4100, y: 472}, player, 1, enemy5MaxHealth, true, enemySpeed),
		
		new Enemy(enemy6, {x: 5600, y: 472}, player, 1, enemy6MaxHealth, true, enemySpeed),
		new Enemy(enemy6, {x: 5800, y: 472}, player, 1, enemy6MaxHealth, true, enemySpeed),
		new Enemy(enemy1, {x: 6000, y: 472}, player, 1, enemy1MaxHealth, true, enemySpeed),
		new Enemy(enemy1, {x: 6200, y: 472}, player, 1, enemy1MaxHealth, true, enemySpeed),
		
		new Enemy(enemy2, {x: 7500, y: 472}, player, 2, enemy2MaxHealth, true, enemySpeed),
		new Enemy(enemy2, {x: 7700, y: 472}, player, 2, enemy2MaxHealth, true, enemySpeed),
		new Enemy(enemy2, {x: 7900, y: 472}, player, 2, enemy2MaxHealth, true, enemySpeed),
		new Enemy(enemy3, {x: 8100, y: 472}, player, 2, enemy3MaxHealth, true, enemySpeed),
		new Enemy(enemy3, {x: 8300, y: 472}, player, 2, enemy3MaxHealth, true, enemySpeed),
		
		new Enemy(enemy3, {x: 9800, y: 472}, player, 3, enemy3MaxHealth, true, enemySpeed),
		new Enemy(enemy3, {x: 10000, y: 472}, player, 3, enemy3MaxHealth, true, enemySpeed),
		new Enemy(enemy4, {x: 10200, y: 472}, player, 3, enemy4MaxHealth, true, enemySpeed),
		new Enemy(enemy4, {x: 10400, y: 472}, player, 3, enemy4MaxHealth, true, enemySpeed),
		new Enemy(enemy4, {x: 10600, y: 472}, player, 3, enemy4MaxHealth, true, enemySpeed),
		
		new Enemy(bossImage, {x: 12500, y: 290}, player, 15, bossMaxHealth, false, bossSpeed),
	]
	
	chapterTexts = [
		{x: 1300, y: 100},
		{x: 3000, y: 100},
		{x: 5100, y: 100},
		{x: 7200, y: 100},
		{x: 9300, y: 100},
		{x: 11600, y: 100},
	]
	
	enemies.forEach(enemy => {
		enemy.setEnemiesArray(enemies);
	});

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0;
}

function animate() {
	if (gameIsOver) {
		return;
	}
	
	requestAnimationFrame(animate);

    genericObjects.forEach(genericObject => {
        genericObject.draw();
    });

    platforms.forEach(platform => {
        platform.draw();
    });
	
	player.update();
	
	enemies.forEach(enemy => {
		enemy.update();
		enemy.moveToPlayer();
	});

	characterItems.forEach(item => {
		item.draw();
	});
	
	c.fillStyle = 'white';
	c.fillText('Управление', 35, 50);
	c.fillText('W - прыжок', 35, 80);
	c.fillText('A - влево', 35, 110);
	c.fillText('D - вправо', 35, 140);
	c.fillText('Mouse1 - выстрел', 35, 170);
	
	c.fillText('Здоровье: ' + player.health + '/' + playerMaxHealth, 260, 50);
	c.fillText('Убито: ' + kills, 260, 80);
	let time = new Date() - startTime;
	c.fillText('Время: ' + Math.floor((time % (1000 * 60)) / 1000), 260, 110);
	
	c.font = '36px Arial';
	c.fillStyle = 'black';
	let index = 1;
	let bossIndex = 6;
	chapterTexts.forEach(text => {
		if (index !== bossIndex) {
			c.fillText('Волна №' + index, text.x - scrollOffset, text.y);
		}
		else {
			c.fillText('БОСС', text.x - scrollOffset, text.y);
		}
		index++;
	});
	c.fillStyle = 'white';
	
    if (keys.right.pressed && player.position.x < 600) {
        player.velocity.x = player.speed;
    }
    else if ((keys.left.pressed && player.position.x > 400)
        || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed;
    }
    else {
        player.velocity.x = 0;

        if (keys.right.pressed && scrollOffset < 12000) {
            scrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * 0.66;
            });
			enemies.forEach(enemy => {
				enemy.position.x -= player.speed;
				enemy.flyingText.move(-player.speed);
			});
        }
        else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += player.speed;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * 0.66;
            });
			enemies.forEach(enemy => {
				enemy.position.x += player.speed;
				enemy.flyingText.move(player.speed);
			});
        }
    }

	const platformCondition = platform => player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width;

	if (platforms.filter(platformCondition).length > 0) {
		player.velocity.y = 0;
		player.onGround = true;
	}
	else {
		player.onGround = false;
	}

    if (enemies.length === 0) {
        gameIsOver = true;
		requestAnimationFrame(function() {
		  gameOver(true); 
		});
    }

    if (player.position.y > canvas.height) {
        player.position.y = 200;
		player.velocity.y = 0;
    }
}



let keyed = false;

addEventListener('keydown', ({ keyCode }) => {
	if (!keyed) {
		keyed = true;
		
		init();
		animate();
		
		player.videoContainer.video.play();
		enemies.forEach(enemy => {
			if (enemy.isVideo) {
				enemy.videoContainer.video.play();
			}
		});
	}
	
    switch (keyCode) {
        case 65: // left
            keys.left.pressed = true;
            break;
        case 83: // down
            break;
        case 68: // right
            keys.right.pressed = true;
            break;
        case 87: // up
			if (player.onGround) {
				player.velocity.y -= 40;	
			}
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: // left
            keys.left.pressed = false;
            break;
        case 83: // down
            break;
        case 68: // right
            keys.right.pressed = false;
            break;
        case 87: // up
            break;
    }
})

c.fillText('Нажмите любую клавишу чтобы начать...', canvas.width / 2 - 200, canvas.height / 2);