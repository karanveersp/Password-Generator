/* Initialize variables to store reference and values */

var generateBtn = document.getElementById("generateBtn");
generateBtn.addEventListener("click", generate);

var lengthVal;
var readabilityVal;
setLengthAndReadability(); // capture initial values of sliders on page load

// display initial values under the slider
var lengthOutput = document.getElementsByName("lengthOutput");
lengthOutput[0].textContent = lengthVal;

var readabilityOutput = document.getElementsByName("readabilityOutput");
readabilityOutput[0].textContent = readabilityVal;

// array of result paragraphs
var resultParas = document.getElementsByClassName("password");
resultParas.disabled = true;

/* End initialization */





/* 
    Executed on Button click
    Based on slider values, generates three password strings
    which are displayed in the Results section.
    1) Calculate readable substring length based on % value of the slider.
    2) Calculate unreadable substring length based on readable length.
    3) 1 character in the length is reserved for a random digit from 0 to 9.
    4) Generate passwords and post them into the results section of the page. 
*/
function generate() {
    setLengthAndReadability();

    var readableSubstringLength = Math.floor(((readabilityVal / 100) * lengthVal) - 1);

    // if readability is -1, set to 0 so its an empty string
    if (readableSubstringLength < 0) {
        readableSubstringLength = 0;
    }

    var unreadableSubstringLength = lengthVal - readableSubstringLength - 1;
    if (unreadableSubstringLength < 0){
        unreadableSubstringLength = 0;
    }

    resultParas[0].textContent = getRandomPassword(readableSubstringLength, unreadableSubstringLength);


    resultParas[1].textContent = getRandomPassword(readableSubstringLength, unreadableSubstringLength);

    
    resultParas[2].textContent = getRandomPassword(readableSubstringLength, unreadableSubstringLength);

}


/*
Function that builds the actual password elements based on the readable and
unreadable substring lengths
1) Create an array and store the three parts of the password (readable, unreadable and digit) in it.
2) Shuffle the array to randomize the order of the three elements
3) Store the resulting order as a string and return
*/
function getRandomPassword(readableSubstringLength, unreadableSubstringLength) {
    let password = [];
    password[0] = buildWord(readableSubstringLength);
    
    // randomly capitalize the first letter
    if(password[0].length > 0){
        if (getRandom0And1() === 1){
            password[0] = Capitalize(password[0]);
        }
    }
    
    password[1] = buildUnreadableWord(unreadableSubstringLength);
    password[2] = Math.floor(Math.random() * 10);

    shuffle(password);
    
    let passwordString = "";
    
    for (let i = 0; i < 3; i++){
        passwordString += password[i];
    }
    
    return passwordString;
}



/**
 * Returns a capitalized string
 * @param {string} string
*/
function Capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Updates variables based on current slider values
*/
function setLengthAndReadability() {
    lengthVal = Number(document.getElementById("lengthSlider").value);
    readabilityVal = Number(document.getElementById("readSlider").value);
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}





/**
 * Returns a randomly mixed assortment of letters and special characters
 * @param {Number} unredableSubstringLength
*/
function buildUnreadableWord(unreadableSubstringLength) {
    let characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'T', 'S', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '#', '%', '&', '/', '(', ')', '=', '?', '@', '$', '{', '[', ']', '}'];
    
    shuffle(characters);
    
    let unreadableWord = "";
    for (let i = 0; i < unreadableSubstringLength; i++){
        unreadableWord += characters[i];
    }
    
    return unreadableWord;
}

/**
 * Returns a pronouncable word
 * @param {Number} readableSubstringLength
*/
function buildWord(readableSubstringLength) {

    let consonants = [
        // single consonants. Beware of Q, it's often awkward in words
        'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm',
        'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'z',
        // possible combinations excluding those which cannot start a word
        'gl', 'gr', 'ch', 'ph', 'ps', 'sh', 'st', 'th', 'wh'
    ];

    let nonStartingConsonants = [
       'ck', 'cm',
        'dr', 'ds',
        'ft',
        'gh', 'gn',
        'kr', 'ks',
        'ls', 'lt', 'lr',
        'mp', 'mt', 'ms',
        'ng', 'ns',
        'rd', 'rg', 'rs', 'rt',
        'ss', 'ts'
    ];

    let vowels = [
        // single vowels
        'a', 'e', 'i', 'o', 'u', 'y',
        // vowel combinations your language allows
        'ee', 'oa', 'oo'
    ];

    let currentSound;

    let putVowelIn = false;
    if (getRandom0And1() === 1) {
        putVowelIn = true;
    }

    if (putVowelIn) {
        currentSound = vowels;
    } else {
        currentSound = consonants;
    }


    let word = "";
    let consonantMaxLength = consonants.length;
    let vowelMaxLength = vowels.length;
    let useNonStartingConsonants = true;

    while (word.length < readableSubstringLength) {

        // if only 1 character difference in length, don't process two letter sounds
        if (readableSubstringLength - word.length < 2) {
            consonantMaxLength = consonants.length - 9;
            vowelMaxLength = vowels.length - 3;
            useNonStartingConsonants = false;
        }

        if (putVowelIn) {
            currentSound = vowels;
            word += currentSound[GetRandomIndex(vowelMaxLength)];
            putVowelIn = false;

            // choose whether to add non-starting cons or regular cons
            if (getRandom0And1() === 1 && useNonStartingConsonants) {
                currentSound = nonStartingConsonants;
            } else {
                currentSound = consonants;
            }
        } else {
            if (currentSound === nonStartingConsonants) {
                word += currentSound[GetRandomIndex(currentSound.length)];
            } else {
                word += currentSound[GetRandomIndex(consonantMaxLength)];

            }
            putVowelIn = true;
        }

    }
    return word;
}


/**
 * Returns random 0 or 1
*/
function getRandom0And1(){
    return (Math.floor(Math.random()*2));
}

/**
 * Returns a random index
 * @param {Number} maxArrayLength 
*/
function GetRandomIndex(maxArrayLength) {
    let randIndex = Math.floor(Math.random() * maxArrayLength);
    return randIndex;
}
