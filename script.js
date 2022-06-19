const yargs = require('yargs');
const {add, list, search, deleteOrEdit} = require('./students.js');

yargs.command(
    'add',
    "Add new data",{
    name: {
        describe: 'Enter student full name, example : "The name"',
        demandOption: true,
        type: 'string'
    },
    number: {
        describe: "Enter 5 digit student id number",
        demandOption: true,
        type: 'string'
    },
    score: {
        describe: "Enter student score",
        demandOption: false,
		default: "-",
        type: 'string' 
    }
    },
    (argv) => {
        add(argv.number, argv.name, argv.score);
    }
).demandCommand();

yargs.command(
    'list',
    "List saved student's information",{
    length: {
        describe: "Input how many data should be showed in the terminal",
        demandOption: false,
        type: 'string',
    }
    },
    (argv) => {
        list(argv.length);
    } 
)

yargs.command(
    'search',
    "Search data with name or id number",{
    name: {
        describe: "The name that want to be searched in the data",
        type: 'string'
    },
    number: {
        describe: "The id number that want to be searched in the data",
        type: 'string'
    }
    },
    (argv) => {
        if(argv.name == undefined && argv.name == undefined){
            yargs.showHelp();
            console.log("\nInput name or number to perform searching!");
        }
        else{
            search(argv.number, argv.name);
        }
    }
)

yargs.command(
    'edit',
    "Edit a spesific existing data",{
        name: {
            describe: "The name that want to be edited",
            type: 'string'
        },
        number: {
            describe: "The id number that want to be edited",
            type: 'string'
        },
        newname: {
            describe: 'Input the new name. Example : "The Name"',
            type: 'string'
        },
        newnumber: {
            describe: 'Input a new 5 digit number.',
            type: 'string'
        },
        newscore: {
            describe: 'New score for the new data.',
            default: "-",
            type: 'string'
        }
    },
    (argv) => {
        if(argv.name == undefined && argv.number == undefined){
            yargs.showHelp();
            console.log("\nInput name or number to perform searching!");
        }
        else if(argv.newname == undefined && argv.newnumber == undefined){
            yargs.showHelp();
            console.log("\nInput new name or new number to edit data!");
        }
        else{
            removeOrEdit( "edit", argv.number, argv.name, argv.newnumber, argv.newname, argv.newscore);
        }
    }
)

yargs.command(
    'delete',
    "Delete a spesific existing data",{
        name: {
            describe: "The name that want to be deleted",
            type: 'string'
        },
        number: {
            describe: "The id number that want to be deleted",
            type: 'string'
        },
    },
    (argv) => {
        if(argv.name == undefined && argv.number == undefined){
            yargs.showHelp();
            console.log("\nInput name or number that want to be deleted!");
        }
        else{
            deleteOrEdit("delete", argv.number, argv.name);
        }
    }
)

yargs.parse()