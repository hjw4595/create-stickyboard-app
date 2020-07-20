const fse = require("fs-extra");
const path = require("path");
const { Command, flags } = require("@oclif/command");
const { cli } = require("cli-ux");

const DEFAULT_APP_NAME = "my-stickyboard-app";

class CreateStickyboardAppCommand extends Command {
    static args = [{ name: "appName" }];

    async run() {
        const { flags, args } = this.parse(CreateStickyboardAppCommand);
        // let name = flags.name;

        let appName = args.appName;

        // Prompt for input application name
        if (!appName) {
            const inputAppName = await cli.prompt(
                `Enter application name(${DEFAULT_APP_NAME})`
            );

            if (inputAppName.length > 0) {
                appName = inputAppName;
            } else {
                appName = DEFAULT_APP_NAME;
            }
        }

        this.log(`Creating StickyBoard app (${appName})\n`);

        // Create a target directory
        const targetDirectory = path.join(__dirname, appName);
        this.log(`Target directory: ${targetDirectory}\n`);
        if (fse.existsSync(targetDirectory)) {
            const overwrite = await cli.confirm(
                `Directory ${appName} already exists. Overwrite it?(y/n)`
            );
            if (!overwrite) {
                this.log("Cancelled.");
                return;
            }
        }

        if (!fse.existsSync(targetDirectory)) {
            fse.mkdirSync(targetDirectory);
        }

        // Copy template to target directory
        try {
            await fse.copy("./templates/stickyboard-simple", targetDirectory);

            this.log(`\nSuccess! Created ${appName} at ${targetDirectory}
    Inside that directory, you can run several commands:

      npm run dev
        Starts the app with development mode.

      npm run build
        Bundles the app into static files for production.

      npm run production
        Starts the app with production mode.

      npm start
        Starts the app with daemon mode using PM2.

    We suggest that you begin by typing:

      cd ${appName}
      npm install
      npm run dev

Happy hacking!\n`);
        } catch (err) {
            console.error(err);
        }
    }
}

CreateStickyboardAppCommand.description = `Create StickyBoard app
Create StickyBoard apps with no build configuration.
`;

CreateStickyboardAppCommand.flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    // add --help flag to show CLI version
    help: flags.help({ char: "h" })
    // name: flags.string({ char: "n", description: "application name to create" })
};

module.exports = CreateStickyboardAppCommand;