import { commands, Disposable, window } from 'vscode';
import { $config } from './extension';
import { run } from './run';
import { TopLevelCommands } from './types';
import { forEachCommand } from './utils';

const registeredCommandsDisposables: Disposable[] = [];

/**
 * Register commands to be able to execute it from a keybinding.
 */
export function updateUserCommands(items: TopLevelCommands): void {
	unregisterUserCommands();

	forEachCommand((item, key) => {
		if (key === '') {
			// Don't show error message for empty string. User is likely typing.
			return;
		}
		let disposable: Disposable;
		try {
			disposable = commands.registerCommand(key, () => {
				run(item);
			});
			registeredCommandsDisposables.push(disposable);
		} catch (err) {
			window.showErrorMessage(`Failed to register command: ${(err as Error).message}`);
		}
	}, items);

	for (const alias in $config.alias) {
		const command = $config.alias[alias];
		let disposable: Disposable;
		try {
			disposable = commands.registerCommand(alias, (args: unknown[]) => {
				run({
					command,
					args,
				});
			});
			registeredCommandsDisposables.push(disposable);
		} catch (err) {
			window.showErrorMessage(`Failed to register alias: ${(err as Error).message}`);
		}
	}
}
/**
 * Dispose user defined commands.
 */
export function unregisterUserCommands() {
	for (const command of registeredCommandsDisposables) {
		command.dispose();
	}
	registeredCommandsDisposables.length = 0;
}
