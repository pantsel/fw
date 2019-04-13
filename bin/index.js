const argv = require('minimist')(process.argv.slice(2));


// console.log(argv)

const commands = {
  generate: {
    component: {
      argvLength: 3,
      validate: function () {
        if(argv._.length !== commands.generate.component.argvLength) return error(`Invalid arguments length`);
      },
      run: async (args) => {
        await require('./genertors/component').run(args[2])
      }
    }
  }
}

if (argv._[0] === 'generate') {

  const command = commands[argv._[0]][argv._[1] || '_'];
  if(!command) return error(`Invalid action, try: '${argv._[0]} ${Object.keys(commands[argv._[0]]).join('/')}'`)
  command.validate();
  command.run(argv._).then(result => {

  }).catch(e => {
    throw e;
  });

}else{
  return error('Invalid command.');
}

function error(text) {
  console.error(text)
  process.exit()
}
