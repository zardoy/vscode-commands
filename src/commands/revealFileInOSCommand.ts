import { commands, Uri } from 'vscode';

export async function revealFileInOSCommand(path: string) {
	await commands.executeCommand('revealFileInOS', Uri.file(path));
}
