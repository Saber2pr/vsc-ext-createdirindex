import { readdir, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import * as vscode from 'vscode';

const indexFileName = 'index'
const indexFileExt = '.ts'

export const createIndexFileContent = (moduleNames: string[]) =>
	moduleNames.map(n => `export * from './${n}';`).join('\n')

export async function genIndex(dir: string) {
	const result = await promisify(readdir)(dir)

	const moduleNames = result
		.map(n => n.split('.')[0])
		.filter(m => m !== indexFileName)

	const content = createIndexFileContent(moduleNames)

	await promisify(writeFile)(join(dir, indexFileName + indexFileExt), content)
}

export function activate(context: vscode.ExtensionContext) {
	const createIndexCommand = vscode.commands.registerCommand('createdirindex', (uri: vscode.Uri) => {
		genIndex(uri.fsPath)
	});

	context.subscriptions.push(createIndexCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }
