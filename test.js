const fs = require('fs');
const validator = require('validator');
const clc = require('cli-color');
const clui = require('clui');

const dataDir = './studentsData.json';
const warn = clc.red.bold;
const success = clc.green.bold;

const getData = (dir) => {
    if(!fs.existsSync(dir)){
        console.log(warn("Data not found!"));
        return false;
    }

    let data = JSON.parse(fs.readFileSync(dir, 'utf-8'));
    if(data.length == 0){
        console.log(warn("The data is empty!"));
        return false;
    }
    return data;
} 

const validData = (number, name) => {

    if(!validator.isAlpha(name.split(' ').join(''))){
        console.log(warn(`The student name is invalid`));
        return false;
    }

    if(validator.isNumeric(number) && number.length == 5){
        return true;
    }
    console.log(warn(`The student id number is invalid`));
}

const sortData = (data) => {
    data.sort((a, b) => {
        const name1 = a.name.toLowerCase();
        const name2 = b.name.toLowerCase();

        if(name1 < name2)
            return -1;
        if(name1 > name2)
            return 1;
        
        return 0;
    });
}

const saveData = (dir, data) => {
    sortData(data);
    fs.writeFileSync(dir, JSON.stringify(data));
}

const searchDataIndex = (datas, number, name) => {
    let length = datas.length
    let results = [];
    let filteredResults = null;

    if(number != undefined){
        for(let i = 0; i < length; i++){
            if(datas[i].number.includes(number))
                results.push(i);
        }
    }
    if(name != undefined){
        for(let i = 0; i < length; i++){
            if(datas[i].name.toLowerCase().includes(name.toLowerCase()))
                results.push(i);
        }
    }
    
    if(name != undefined && number != undefined){
        filteredResults = [...new Set(results)];
        return filteredResults;
    }

    if(results.length == 0){
        console.log(warn("Data not found!"))
        return 0;
    }
    return results;
}

const headerForTable = (message, rows, headers) => {
    let outputBuffer = new clui.LineBuffer({
        x: 0, y: 0,
        width: 'console', height: (rows + 5)
    });
       
    let title = new clui.Line(outputBuffer)
		.column(message, 25, [clc.cyan]).fill().store()
        
       
    let blankLine = new clui.Line(outputBuffer)
        .fill().store();

    let subTitle = new clui.Line(outputBuffer)
    for(let heading of headers){
        const newLine = subTitle.column(heading, 20, [clc.blue]);
        subTitle = newLine;
    }
    subTitle.fill().store();

    return outputBuffer;
}

const add = (number, name, score) => {

    if(!fs.existsSync(dataDir)){
        fs.writeFileSync(dataDir, '[]', 'utf-8');
    }
    
    //Read the file and decode it with UTF-8
    const fileBuffer = fs.readFileSync('./studentsData.json', 'utf-8');
    const data = JSON.parse(fileBuffer);
    const newData = {name, number, score};

    //If duplicate number or name found, the variable value will be undefined
    const sameName = data.find(element => element.name.toLowerCase() === name.toLowerCase());
    const sameNumber = data.find(element => element.number === number);
    
    if(sameName != undefined){
        console.log(warn(`The student named ${name} already registered!`));
    }
    else if(sameNumber != undefined){
        console.log(warn(`The student with number ${number} already registered!`));
    }
    else if(validData(number, name)){
        data.push((newData));
        saveData(dataDir, data);
        console.log(success("Data has been updated!"));
    }
}

const removeOrEdit = (number, name, newNumber, newName, newScore = "-", mode) => {
	let data = getData(dataDir);
    if(data == false)
        return 0;
    
    let results = searchDataIndex(data, number, name);
	let foundIndex = results[0];
    if(!results)
        return 0;
    if(results.length > 1){
        console.log(warn("Found more than one data, use search command or list command to find the spesific data."))
        return 0;
    }

	if(newNumber == undefined)
		newNumber = data[foundIndex].number;
	else if(newName == undefined)
		newName = data[foundIndex].name;
	
    data.splice(foundIndex, 1);
    saveData(dataDir, data)
    
	if(mode === "remove"){
		console.log(success("Data has been deleted!"));
		return 0;}
	else if(mode === "edit"){
		if(validData(newNumber, newName))
			add(newNumber, newName, newScore); 
	}
}


// removeOrEdit(undefined, "someone new", "11203", "not new", "edit");

console.log(clc.cyanBright("Test"));