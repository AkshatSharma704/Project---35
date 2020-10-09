//Create variables here
var dog, happyDog, database, foodS, foodStock;
var database,position;
var dogSprite;
var feedPet,addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  //load images here
  dog = loadImage("images/Dog.png");
  happyDog = loadImage("images/happydog.png");
}

function setup() {
  createCanvas(800, 500);

  database = firebase.database();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);
  
  dogSprite = createSprite(350,300,150,150);
  dogSprite.addImage(dog);
  dogSprite.scale = 0.15;

  foodObj = new Food();

  feedPet = createButton("Feed The Dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);

  //add styles here
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 370,30);
   }
  foodObj.display();
  textSize(15);
  fill("white");
  stroke("black");
  text("Press The Button To feed The Dog",130,10,300,20);
  drawSprites();
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x = 0;
  }
  else{
    x = x - 1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dogSprite.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}